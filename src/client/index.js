import Player from "./Player.js";

const getel = id => document.getElementById(id);
const s = io();

const fixDpi = c => {
    const dpi = window.devicePixelRatio;
    const height = +getComputedStyle(c).getPropertyValue('height').slice(0, -2);
    const width = +getComputedStyle(c).getPropertyValue('width').slice(0, -2);

    c.setAttribute('height', height * dpi);
    c.setAttribute('width', width * dpi);
};

const c = getel('c');
const ctx = c.getContext('2d');
fixDpi(c);

const [ WIDTH, HEIGHT ] = [ 96, 50 ];

s.on('ready', ({ tilemap, id }) => {
    s.emit('name', prompt('Enter your name.', 'Guest_' + id) || 'Guest_' + id);
    const player = new Player(tilemap, tilemap.firstTile[0], tilemap.firstTile[1]);
    player.init(c, ctx, WIDTH, HEIGHT);

    const renderToCanvas = () => {
        const colors = ['#5afc4c', '#586a70', '#49a3fc'];

        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                ctx.fillStyle = colors[tilemap.arr[y][x]];
                ctx.fillRect(x * WIDTH, y * HEIGHT, WIDTH, HEIGHT);
            }
        }
    };

    s.emit('player', { x: player.x, y: player.y });
    s.on('players', chunk => {
        renderToCanvas();
        for (const pl of chunk) {
            ctx.fillStyle = '#fc4949';
            ctx.fillRect(pl.x * WIDTH, pl.y * HEIGHT, WIDTH, HEIGHT);
            ctx.fillStyle = '#fefefe';
            ctx.font = '10px Arial';
            const mes = ctx.measureText(pl.name);
            ctx.fillText(pl.name, pl.x * WIDTH + mes.width / 2, pl.y * HEIGHT - 10);
        }
        s.emit('player', { x: player.x, y: player.y });
    });
});
