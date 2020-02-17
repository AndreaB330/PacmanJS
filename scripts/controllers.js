let time_to_display = 0.02;

class PathFinderController {
    constructor(game, player, pathfinder) {
        this.game = game;
        this.player = player;
        this.pathfinder = pathfinder;
        this.countdown = 0;

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
                    this.pathfinder.run(player.next_tile_pos(), to);
                    this.path_to_follow = this.pathfinder.get_path();
                    this.countdown = time_to_display * this.pathfinder.dist[this.pathfinder.to];
                }
            }
        });

        this.path_to_follow = [];
    }

    update(dt) {
        this.countdown -= dt;
        if (this.countdown < 0) {
            while (this.path_to_follow.length > 0 && eq(this.player.tile_pos(), this.path_to_follow[0])) {
                this.path_to_follow.shift();
            }
            if (this.path_to_follow.length > 0) {
                let next = this.path_to_follow[0];
                for (let dir = 0; dir < 4; dir++) {
                    if (eq(math.add(this.player.tile_pos(), DELTAS[dir]), next)) {
                        this.player.next_direction = dir;
                    }
                }
            } else {
                this.player.next_direction = Direction.NONE;
            }
        }
    }
}

class KeyboardController {
    constructor(player) {
        this.player = player;
        $(document).keydown(e => {
            switch (e.which) {
                case 37:
                case 65: // left
                    this.player.next_direction = Direction.LEFT;
                    break;

                case 38:
                case 87: // up
                    this.player.next_direction = Direction.UP;
                    break;

                case 39:
                case 68: // right
                    this.player.next_direction = Direction.RIGHT;
                    break;

                case 40:
                case 83:// down
                    this.player.next_direction = Direction.DOWN;
                    break;

                default:
                    return; // exit this handler for other keys
            }
            e.preventDefault(); // prevent the default action (scroll / move caret)
        });
    }

    update(dt) {

    }
}

function get_mask(pos, neighbours) {
    let mask = 0;
    neighbours.forEach(next => {
        if (pos[1] > next[1]) mask |= 0b0001;
        if (pos[1] < next[1]) mask |= 0b0100;
        if (pos[0] < next[0]) mask |= 0b0010;
        if (pos[0] > next[0]) mask |= 0b1000;
    });
    return mask
}

function draw_path(path) {
    if (path && path.length > 1) {
        for (let i = 0; i < path.length; i++) {
            let cur = path[i];
            let neighbours = [];
            if (i > 0) neighbours.push(path[i - 1]);
            if (i + 1 < path.length) neighbours.push(path[i + 1]);
            drawTexture(IMAGE_REDSTONE[get_mask(cur, neighbours)], cur[0], cur[1]);
        }
    }
}