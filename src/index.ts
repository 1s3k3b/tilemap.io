import express from 'express';
import { Server } from 'http';
import socketio from 'socket.io';
import Tilemap from './server/Tilemap';

const app = express();
const server = new Server(app);

app.get('/', (_, res) => {
    return res.sendFile('/client/index.html', { root: './src' });
});
app.get('/tilemap', (_, res) => {
    return res.send(tilemap.arr);
});
app.post('/tilemap/:x/:y/:t', (req, res) => {
    var { x, y, t } = req.params;
    var [ x, y, t ] = [ parseInt(x) as unknown as string, parseInt(y) as unknown as string, `${parseInt(t)}` ];
    if ([ x, y, t ].some(e => isNaN(e as unknown as number) || !tilemap.arr[y as unknown as number] || !tilemap.arr[y as unknown as number][x as unknown as number] || !['0', '1', '2'].includes(t))) return res.sendStatus(404);

    try {
        tilemap.arr[y as unknown as number][x as unknown as number] = t;
    }
    catch {
        return res.sendStatus(500);
    }
    return res.send(tilemap.arr);
});
app.get('/users/:id', (req, res) => {
    const found = connections[req.params.id as unknown as number];
    if (!found) return res.sendStatus(404);
    return res.send({ ...found.data, name: found.name });
});
app.delete('/users/:id', (req, res) => {
    const found = connections[req.params.id as unknown as number];
    if (!found) return res.sendStatus(404);
    delete connections[found.id];
    return res.send({ ...found.data, name: found.name });
});

app.use('/dist', express.static('dist'));
app.use('/src', express.static('src'));
app.use('/client', express.static('dist/client'));
server.listen(2000);

const connections: { [ key: number ]: { id: number; conn: socketio.Socket; name?: string; data?: object } } = {};
const tilemap = new Tilemap(96, 50);

const io = socketio(server, {});

io.sockets.on('connection', s => {
    const id = new Array(Object.keys(connections).length + 1).fill(() => Math.floor(Math.random() * (Object.keys(connections).length + 1))).map(f => f()).filter(n => !Object.keys(connections).includes(`${n}`))[0];
    console.log('Connection!', id);
    s.on('disconnect', () => {
        delete connections[id];
        console.log('Disconnected!', id);
    });
    connections[id] = { id, conn: s };

    s.on('name', d => { connections[id].name = d; });
    s.on('player', d => { connections[id].data = d; });
    s.emit('ready', { tilemap, id });
});

setInterval(() => {
    const chunk = [];

    for (const id in connections) {
        const s = connections[id];
        chunk.push({ ...s.data, name: s.name });
    }

    for (const id in connections) {
        const s = connections[id];
        s.conn.emit('tilemap', tilemap);
        s.conn.emit('players', chunk.filter(Boolean));
    }
}, 1000 / 25);
