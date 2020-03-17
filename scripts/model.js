const COIN_ANIMATION_TIME = 0.6;

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
            for (let dir = 0; dir < 4; dir++) {
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
    constructor(id, x, y, textures) {
        this.id = id;
        this.pos = [x, y];
        this.prev_pos = [x, y];
        this.textures = textures;
        this.direction = Direction.NONE;
        this.dead = false;
    }

    tile_pos() {
        return math.round(this.pos);
    }

    next_tile_pos() {
        return math.round(math.add(this.pos, math.multiply(DELTAS[this.direction], 0.49)));
    }
}

class Player extends Unit {
    constructor(id, x, y) {
        super(id, x, y, PACMAN);
        this.score = 0;
    }

    isPlayer() {
        return true;
    }
}

class Ghost extends Unit {
    constructor(id, x, y, skip) {
        super(id, x, y, (skip === 3 ? GHOST : ENDER));
        this.skip = skip;
        this.sh = Math.floor(Math.random() * skip);
    }

    isPlayer() {
        return false;
    }
}

class Game {
    constructor(map, tick_base = 1) {
        this.map = map;
        this.units = [];
        this.tick_base = tick_base;
        this.tick_bank = 0;
        this.width = map.width;
        this.height = map.height;
        this.coin = generateArray([this.width, this.height], 0);
        this.visited = generateArray([this.width, this.height], 0);
        this.coin_animations = [];
        this.current_tick = 0;
        tableIterator(this.width, this.height, (i, j) => {
            if (!map.is_blocked([i, j])) {
                this.coin[i][j] = 1;
                if (Math.random() < 0.05) this.coin[i][j] += 1;
            }
        });
    }

    addUnit(unit) {
        this.units.push(unit);
    }

    update(dt) {
        this.tick_bank -= dt;
        if (this.tick_bank < 0) {
            this.tick();
            this.tick_bank += this.tick_base;
        }
        let alive_coin_animations = [];
        this.coin_animations.forEach(a => {
            a.time_bank -= dt;
            a.pos = math.add(a.pos, math.multiply(a.vel, dt));
            a.vel = math.add(a.vel, math.multiply([0, 30], dt));
            if (a.time_bank >= 0)
                alive_coin_animations.push(a);
        });
        this.coin_animations = alive_coin_animations;
    }

    tick() {
        this.current_tick += 1;
        tableIterator(this.width, this.height, (i, j) => {
            this.visited[i][j] *= 0.95;
        });
        this.units.forEach(u => {
            if (u.dead) return;
            if (!u.isPlayer() && (this.current_tick + u.sh) % u.skip !== 0) {
                u.prev_pos = u.pos;
                u.direction = Direction.NONE;
                return;
            }
            if (u.isPlayer()) {
                this.visited[u.pos[0]][u.pos[1]] += 1;
            }
            if (u.controller) {
                let tile_pos = math.round(u.pos);
                if (this.coin[tile_pos[0]][tile_pos[1]] && u.score !== undefined) {
                    let score = this.coin[tile_pos[0]][tile_pos[1]];
                    this.coin[tile_pos[0]][tile_pos[1]] = 0;
                    u.score += score;
                    this.coin_animations.push({
                        pos: tile_pos,
                        vel: [4 * (Math.random() - 0.5), -7],
                        time_bank: COIN_ANIMATION_TIME,
                        texture: (score === 1 ? IMAGE_COIN : IMAGE_DIAMOND)
                    });
                }
                u.prev_pos = tile_pos;
                let next_direction = u.controller.get_direction();
                if (!this.map.is_blocked(tile_pos, next_direction)) {
                    u.direction = next_direction;
                    u.pos = math.add(tile_pos, DELTAS[u.direction]);
                } else if (!this.map.is_blocked(tile_pos, u.direction)) {
                    u.pos = math.add(tile_pos, DELTAS[u.direction]);
                } else {
                    u.direction = Direction.NONE;
                }
            }
            this.units.forEach(v => {
                if (u.isPlayer() && !v.isPlayer() && eq(v.pos, u.pos)) {
                    u.dead = true;
                }
                if (!u.isPlayer() && v.isPlayer() && eq(v.pos, u.pos)) {
                    v.dead = true;
                }
            });
        });
    }
}
