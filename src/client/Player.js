export default class Player {
    constructor(tilemap, baseX, baseY) {
        this.width = tilemap.arr[0].length;
        this.height = tilemap.arr.length;
        this.tilemap = tilemap;

        this.x = baseX;
        this.y = baseY;

        this.player = new Proxy({
            hp: 100,
            x: baseX,
            y: baseY,
            keyPressed: undefined,
        }, {
            set: (obj, prop, val) => {
                obj[prop] = val;
                this.x = this.player.x;
                this.y = this.player.y;
                return true;
            },
        });
    }
    init() {
        const getTilemapPos = (tm, p) => tm.arr[(p.keyPressed === 'up' ? p.y - 1 : (p.keyPressed === 'down' ? p.y + 1 : p.y))][(p.keyPressed === 'right' ? p.x + 1 : (p.keyPressed === 'left' ? p.x - 1 : p.x))];

        window.addEventListener('keydown', e => {
            switch (`${e.code}`) {
            case 'KeyW':
            case 'ArrowUp':
                this.player.keyPressed = 'up';
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.player.keyPressed = 'down';
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.player.keyPressed = 'left';
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.player.keyPressed = 'right';
                break;
            }
        });
        window.addEventListener('keyup', e => {
            switch (`${e.code}`) {
            case 'KeyW':
            case 'ArrowUp':
                this.player.keyPressed = undefined;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.player.keyPressed = undefined;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.player.keyPressed = undefined;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.player.keyPressed = undefined;
                break;
            }
        });

        setInterval(() => {
            if (this.player.keyPressed === 'right' && this.player.x !== this.width - 1 && getTilemapPos(this.tilemap, this.player) === '1') this.player.x++;
            if (this.player.keyPressed === 'left' && this.player.x !== 0 && getTilemapPos(this.tilemap, this.player) === '1') this.player.x--;
            if (this.player.keyPressed === 'up' && this.player.y !== 0 && getTilemapPos(this.tilemap, this.player) === '1') this.player.y--;
            if (this.player.keyPressed === 'down' && this.player.y !== this.height - 1 && getTilemapPos(this.tilemap, this.player) === '1') this.player.y++;
        }, 100);
    }
    drawOnTilemap(ctx, w, h) {
        const colors = ['#5afc4c', '#586a70', '#49a3fc', '#fc4949'];
        const isWater = false;

        const drawBorder = (xPos, yPos, width, height, thickness = 1) => {
            ctx.fillStyle = '#000000';
            ctx.fillRect(xPos - thickness, yPos - thickness, width + thickness * 2, height + thickness * 2);
        };

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                ctx.fillStyle = colors[(x === player.x && y === player.y ? 3 : tilemap.arr[y][x])];
                ctx.fillRect(x * w, y * h, w, h);
            }
        }
    }
}

const neighborDirs = [
    /* [ -1, -1 ],*/ [ 0, -1 ], [ 1, -1 ],
    /* [ -1,  0 ],*/ [ 1, 0 ],
    /* [ -1,  1 ],*/ [ 0, 1 ], [ 1, 1 ],
];

const getFromMatrix = ([m, x, y]) => (m[y] || [])[x];

const getNeighbors = (x, y, n, m) => n.map(([dX, dY], i) => {
    return {
        x: x + dX,
        y: y + dY,
        tile: '',
        isCorner: i === 1 || i === 4,
    };
}).map(i => {
    i.tile = getFromMatrix([m, i.x, i.y]);
    return i;
}).filter(v => v.tile !== undefined);

const checkSurroundings = (arr, x, y) => getNeighbors(x, y, neighborDirs, arr);
