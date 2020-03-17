let time_to_display = 0.02;

class PathFinderController {
    constructor(game, player, pathfinder) {
        this.game = game;
        this.player = player;
        this.pathfinder = pathfinder;
        this.countdown = 0;
        this.player.controller = this;

        $(canvas).click(e => {
            this.player.next_direction = Direction.NONE;
            this.path_to_follow = [];
            let x = Math.floor(e.pageX / TILE_SIZE) - 2;
            let y = Math.floor(e.pageY / TILE_SIZE) - 2;
            if (this.game.map.is_valid([x, y])) {
                let to = null;
                if (!this.game.map.is_blocked([x, y])) {
                    to = [x, y];
                } else if (x >= 1 && y >= 1) {
                    to = [largestOdd(x), largestOdd(y)];
                }
                if (to) {
                    console.log(this.pathfinder);
                    this.pathfinder.run(player.next_tile_pos(), to);
                    this.path_to_follow = this.pathfinder.get_path();
                    this.countdown = time_to_display * this.pathfinder.dist[this.pathfinder.to];
                }
            }
        });

        this.path_to_follow = [];
    }

    get_direction() {
        if (this.countdown >= 0)
            return Direction.NONE;
        while (this.path_to_follow.length > 0 && eq(this.player.tile_pos(), this.path_to_follow[0])) {
            this.path_to_follow.shift();
        }
        if (this.path_to_follow.length > 0) {
            let next = this.path_to_follow[0];
            for (let dir = 0; dir < 4; dir++) {
                if (eq(math.add(this.player.tile_pos(), DELTAS[dir]), next)) {
                    return dir;
                }
            }
        } else {
            return Direction.NONE;
        }
    }

    update(dt) {
        this.countdown -= dt;
    }
}

class KeyboardController {
    constructor(player) {
        this.player = player;
        this.player.controller = this;
        this.next_direction = Direction.NONE;
        $(document).keydown(e => {
            switch (e.which) {
                case 37:
                case 65: // left
                    this.next_direction = Direction.LEFT;
                    break;

                case 38:
                case 87: // up
                    this.next_direction = Direction.UP;
                    break;

                case 39:
                case 68: // right
                    this.next_direction = Direction.RIGHT;
                    break;

                case 40:
                case 83:// down
                    this.next_direction = Direction.DOWN;
                    break;

                default:
                    return; // exit this handler for other keys
            }
            e.preventDefault(); // prevent the default action (scroll / move caret)
        });
    }

    get_direction() {
        return this.next_direction;
    }

    update(dt) {

    }
}

class AutoPlayerController {
    constructor(game, player) {
        this.player = player;
        this.player.controller = this;
        this.game = game;
        this.pathfinder = GetBFSPathFinder(game.map.to_graph());
    }

    get_direction() {
        this.best_path = [];
        this.best_score = -1e18;
        this.pathfinder.run(this.player.pos, [0, 0]);
        this.coin_map = generateArray([this.game.width, this.game.height], 0);
        tableIterator(this.game.width, this.game.height, (i, j) => {
            this.coin_map[i][j] = this.game.coin[i][j];
        });
        let path = [this.player.pos];
        this.recur(this.player.pos, path, 0);

        return get_direction_by_path(this.best_path, this.player.pos);
        /*


        let nearest_coin = undefined;
        tableIterator(this.game.width, this.game.height, (i, j) => {
            if (this.game.coin[i][j] === 1) {
                if (nearest_coin === undefined || this.pathfinder.dist[nearest_coin] > this.pathfinder.dist[[i, j]]) {
                    nearest_coin = [i, j];
                }
            }
        });
        this.pathfinder.to = nearest_coin;
        return get_direction_by_path(this.pathfinder.get_path(), this.player.pos);*/
    }

    recur(pos, path, score, depth = 0) {
        let max_depth = 10;
        if (score + max_depth - depth <= this.best_score) return;
        if (depth >= max_depth) {
            if (score > this.best_score) {
                this.best_score = score;
                this.best_path = [];
                path.forEach(p => this.best_path.push(p));
            }
            return;
        }
        let moves = [];
        for (let dir = 0; dir < 4; dir++) {
            let next_pos = math.add(pos, DELTAS[dir]);
            if (this.game.map.is_blocked(next_pos))
                continue;
            moves.push(next_pos);
        }
        moves.forEach(next_pos => {
            if (path.length >= 2 &&
                eq(next_pos, path[path.length - 2]) &&
                (next_pos[0] % 2 === 0 || next_pos[1] % 2 === 0) &&
                moves.length > 1)
                return;
            path.push(next_pos);
            let coin_present = this.coin_map[next_pos[0]][next_pos[1]];
            this.coin_map[next_pos[0]][next_pos[1]] = 0;
            let next_score = score;
            next_score += coin_present * Math.pow(0.6, depth);
            next_score += -this.game.visited[next_pos[0]][next_pos[1]] / 50;
            this.game.units.forEach(u => {
                if (!u.isPlayer()) {
                    let dist = math.norm(math.subtract(u.pos, next_pos), 1);

                    if (dist <= (depth/u.skip)) {
                        next_score -= 500 / (dist+1);
                        if (dist === 0) next_score -= 1000;
                    } else if (dist <= (depth/u.skip)+1 && (this.game.current_tick + depth + u.sh) % u.skip === 0) {
                        next_score -= 500 / (dist);
                        if (dist === 1) next_score -= 1000;
                    }
                }
            });
            this.recur(next_pos, path, next_score, depth + 1);
            this.coin_map[next_pos[0]][next_pos[1]] = coin_present;
            path.pop();
        });
    }

    update(dt) {

    }
}

class AutoGhostController {

    constructor(game, ghost, player) {
        this.player = player;
        this.ghost = ghost;
        this.ghost.controller = this;
        this.game = game;
        this.pathfinder = GetBFSPathFinder(game.map.to_graph());
    }

    get_direction() {
        this.pathfinder.blocked = [];
        this.game.units.forEach(u => {
            if (!u.isPlayer() && u !== this) {
                this.pathfinder.blocked.push(u.pos);
            }
        });
        this.pathfinder.run(this.ghost.pos, this.player.pos);
        return get_direction_by_path(this.pathfinder.get_path(), this.ghost.tile_pos());
    }

    update(dt) {

    }
}

function get_direction_by_path(path, pos) {
    while (path.length > 0 && eq(pos, path[0])) {
        path.shift();
    }
    if (path.length > 0) {
        let next = path[0];
        for (let dir = 0; dir < 4; dir++) {
            if (eq(math.add(pos, DELTAS[dir]), next)) {
                return dir;
            }
        }
    }
    return Direction.NONE;
}