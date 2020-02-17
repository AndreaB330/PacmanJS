function generate_maze(w, h, bridges=0.0) {
    let tiles = generateArray([w, h], 1);
    let to_id = (x, y) => x * h + y;
    let p = [];
    for (let i = 0; i <= to_id(w - 1, h - 1); i++) p.push(i);
    let get = (x) => {
        return p[x] === x ? x : p[x] = get(p[x]);
    };
    let unite = (x, y) => {
        p[get(x)] = get(y);
    };

    let destroy = (x, y) => {
        [
            [x - 1, y],
            [x + 1, y],
            [x, y + 1],
            [x, y - 1]
        ].forEach(([nx, ny]) => {
            if (tiles[nx][ny] === 0)
                unite(to_id(x, y), to_id(nx, ny));
        });
        tiles[x][y] = 0;
    };

    let rooms = [];

    let make_room = (x, y, r) => {
        let offsetX = Math.min(Math.max(1, x - r), w - 2 - 2 * r);
        let offsetY = Math.min(Math.max(1, y - r), h - 2 - 2 * r);
        offsetX = Math.floor((offsetX + 1) / 2) * 2 - 1;
        offsetY = Math.floor((offsetY + 1) / 2) * 2 - 1;
        for (let i = 0; i < 2 * r + 1; i++) {
            for (let j = 0; j < 2 * r + 1; j++) {
                destroy(offsetX + i, offsetY + j);
            }
        }
        rooms.push([offsetX, offsetY, r]);
    };

    /*make_room(Math.floor(w / 2), Math.floor(h / 2), 2);
    make_room(0, 0, 2);
    make_room(100, 0, 2);
    make_room(0, 100, 2);
    make_room(100, 100, 2);*/

    let walls = [];
    for (let i = 1; i < w - 1; i += 2) {
        for (let j = 1; j < h - 1; j += 2) {
            tiles[i][j] = 0;
            if (i < w - 2) {
                walls.push([i + 1, j]);
            }
            if (j < h - 2) {
                walls.push([i, j + 1]);
            }
        }
    }

    shuffle(walls);

    walls.forEach((wall) => {
        let first, second;
        if (wall[0] % 2 === 0) {
            first = to_id(wall[0] - 1, wall[1]);
            second = to_id(wall[0] + 1, wall[1]);
        } else {
            first = to_id(wall[0], wall[1] + 1);
            second = to_id(wall[0], wall[1] - 1);
        }
        if (get(first) !== get(second) || Math.random() < bridges) {
            destroy(wall[0], wall[1]);
        }
    });
    return {tiles: tiles, rooms: rooms};
}