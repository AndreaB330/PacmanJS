class GameMap {
    constructor(width, height, bridges = 0.15) {
        this.width = width;
        this.height = height;
        let maze = generate_maze(this.width, this.height, bridges);
        this.tiles = maze.tiles;
        this.rooms = maze.rooms;
    }

    is_valid(pos) {
        return pos[0] >= 0 && pos[1] >= 0 && pos[0] < this.width && pos[1] < this.height;
    }

    is_room(pos) {
        let [x, y] = pos;
        return this.rooms.some((
            [room_x, room_y, room_radius]) =>
            (x >= room_x && y >= room_y && x <= room_x + 2 * room_radius && y <= room_y + 2 * room_radius)
        );
    }

    is_blocked(pos, direction = 4) {
        return this.tiles[pos[0] + DELTAS[direction][0]][pos[1] + DELTAS[direction][1]] === Tile.WALL;
    }

    to_graph() {
        let g = new Graph();
        tableIterator(this.width, this.height, (i, j) => {
            let u = [i, j];
            for(let dir = 0; dir < 4; dir++) {
                let v = math.add(u, DELTAS[dir]);
                if (!this.is_blocked(u) && !this.is_blocked(v)) {
                    g.add_edge(u, v);
                }
            }
        }, 1);
        return g;
    }
}

class Unit {
    constructor(id, x, y, textures, speed) {
        this.id = id;
        this.pos = [x, y];
        this.textures = textures;
        this.speed = speed;
        this.direction = Direction.NONE;
        this.next_direction = Direction.NONE;
    }

    tile_pos() {
        return math.round(this.pos);
    }

    next_tile_pos() {
        return math.round(math.add(this.pos, math.multiply(DELTAS[this.direction], 0.49)));
    }
}

class Player extends Unit {
    constructor(id, x, y, speed) {
        super(id, x, y, PACMAN, speed);
        this.score = 0;
    }
}

class Ghost extends Unit {
    constructor(id, x, y, speed) {
        super(id, x, y, GHOST, speed);
    }
}

class Game {
    constructor(map) {
        this.map = map;
        this.units = [];
    }

    addUnit(unit) {
        this.units.push(unit);
    }

    update(dt) {
        this.units.forEach(u => this.updateUnit(u, dt));
    }

    updateUnit(u, dt) {
        let tile_pos = math.round(u.pos);
        let center = math.floor(u.pos);
        u.pos = math.add(u.pos, math.multiply(DELTAS[u.direction], u.speed * dt));
        if (math.distance(math.floor(u.pos), center) > 0 ||
            math.distance(tile_pos, u.pos) < dt * u.speed * 1.1) {
            if (!this.map.is_blocked(tile_pos, u.next_direction)) {
                u.direction = u.next_direction;
                let delta = math.distance(math.round(u.pos), u.pos);
                u.pos = math.round(u.pos);
                u.pos = math.add(u.pos, math.multiply(DELTAS[u.direction], delta));
            }
        }
        let next_tile = math.floor(math.add(u.pos, math.multiply(math.add(DELTAS[u.direction], [1, 1]), 0.5)));
        if (this.map.is_blocked(next_tile)) {
            u.pos = math.round(u.pos);
            u.next_direction = Direction.NONE;
        }
    }
}
