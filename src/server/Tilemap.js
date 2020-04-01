module.exports = class Tilemap {
    constructor(width, height, pre) {
        let tilemap = new Array(height).fill(new Array(width).fill(''));
        const twoDwaterDirs = new Array(Math.floor(height / 2)).fill(new Array(Math.floor(width / 2)).fill('')).map((row, y) => row.map((dir, x) => [x, y]));
        const waterDirs = [];
        twoDwaterDirs.map(a => a.map(b => waterDirs.push(b)));

        let putFirstTile = false;

        tilemap = tilemap.map((row, rowI) => row.map((_, i) => {
            if (!putFirstTile && Math.random() > 0.5) {
                putFirstTile = true;
                this.firstTile = [i, rowI];
                return '1';
            }
            return '0';
        }));

        if (!putFirstTile) tilemap[0][0] = '1';

        for (let i = 0; i < 3; i++) {
            tilemap = tilemap.map((row, rowI) => row.map((tileInRow, j) => {
                if (tileInRow === '0') return '0';
                const surroundings = checkSurroundings(tilemap, j, rowI);
                const surroundedWalls = surroundings.filter(surr => surr.tile === '0');
                const surroundedPath = surroundings.filter(surr => surr.tile === '1');

                if (surroundedPath.length <= 1) {
                    const pickedWall = surroundedWalls[Math.floor(Math.random() * surroundedWalls.length)];
                    const pickedWall2 = surroundedWalls[Math.floor(Math.random() * surroundedWalls.length)];
                    if (pickedWall) {
                        tilemap[pickedWall.y][pickedWall.x] = '1';
                        if ((Math.random() < 0.5 || !surroundedPath) && pickedWall !== pickedWall2) tilemap[pickedWall2.y][pickedWall2.x] = '1';
                    }
                    else {
                        if (tilemap[rowI][j + 1]) tilemap[rowI][j + 1] = '1';
                        if (Math.random() > 0.7 && tilemap[rowI + 1]) tilemap[rowI + 1][j] = '1';
                    }
                }
                return tileInRow;
            }));
        }

        tilemap = tryWater(tilemap, 0, 0, waterDirs);

        tilemap = pre ? pre : tilemap;

        this.arr = tilemap;

        this.string = tilemap.map(r => r.join('')).join('\n');
    }
    renderToCanvas(ctx, w, h) {
        const colors = ['#5afc4c', '#586a70', '#49a3fc'];

        const drawBorder = (xPos, yPos, width, height, thickness = 1) => {
            ctx.fillStyle = '#000000';
            ctx.fillRect(xPos - thickness, yPos - thickness, width + thickness * 2, height + thickness * 2);
        };

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                ctx.fillStyle = colors[this.arr[y][x]];
                ctx.fillRect(x * w, y * h, w, h);
                drawBorder(x * w, y * h, w, h);
            }
        }
    }
};

const neighborDirs = [ [ 0, -1 ], [ 1, 0 ], [ 0, 1 ] ];

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

const tryWater = (arr, x, y, waterDirs) => {
    const area = waterDirs.map(([dX, dY]) => {
        return {
            x: x + dX,
            y: y + dY,
            tile: arr[dY][dX],
        };
    });
    if (area.map(t => t.tile).includes('1')) {
        if (y === arr.length - 1) return arr;
        else if (x === arr[0].length - 1) return tryWater(arr, 0, y + 1, waterDirs);
        return tryWater(arr, x + 1, y, waterDirs);
    }
    const xys = area.map(xy => [xy.x, xy.y]);
    return arr.map((row, yR) => row.map((t, xR) => xys.includes([xR, yR]) ? '2' : t));
};
