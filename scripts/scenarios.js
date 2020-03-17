const min_simulation_dt = 10; // milliseconds
const max_simulation_dt = 20;

function runPathFindingScenario(bundle) {
    TILE_SIZE = 24;
    $(window).ready(() => {
        let map = new GameMap(MAX_WIDTH, MAX_HEIGHT, 0.05);
        let game = new Game(map, 0.05);
        let me = new Player(0, 1, 1, 20);
        let pathfinder = GetManhattanAStarPathFinder(game.map.to_graph());
        let controller = new PathFinderController(game, me, pathfinder);

        game.addUnit(me);

        let updateTimer = new Timer();

        function drawLoop() {
            clear();
            drawPathFindingController(controller);
            drawGameState(game);
            setTimeout(drawLoop, 1);
        }

        function updateLoop() {
            if (bundle.pathfinder && controller.path_to_follow.length === 0) {
                controller.pathfinder = bundle.pathfinder(game.map.to_graph());
                bundle.pathfinder = undefined;
            }

            bundle.on_state_changed(controller.pathfinder.time || 0, controller.pathfinder.memory || 0);

            let delta = updateTimer.get_delta();
            let dt = Math.min(delta, max_simulation_dt) / 1000;
            game.update(dt);
            controller.update(dt);
            setTimeout(updateLoop, min_simulation_dt);
        }

        bundle.change_color_scheme = (c) => {
            COLORING = c;
            rebuildMapTable(map);
        };
        rebuildMapTable(map);
        setTimeout(drawLoop, 20);
        setTimeout(updateLoop, 20);
    });
}

/*
function runUserGameScenario(bundle) {
    TILE_SIZE = 32;
    $(window).ready(() => {

        let map = new GameMap(MAX_WIDTH, MAX_HEIGHT, 0.4);
        let game = new Game(map, 0.1);

        let me = new Player(0, 1, 1, 5);
        let ghosts = [
            new Ghost(1, 5, 9, 5)
        ];

        let controllers = [];
        controllers.push(new KeyboardController(me));

        game.addUnit(me);
        ghosts.forEach(g => game.addUnit(g));

        let updateTimer = new Timer();

        function drawLoop() {
            clear();
            drawGameState(game);
            setTimeout(drawLoop, 1);
        }

        function updateLoop() {
            let delta = updateTimer.get_delta();
            let dt = Math.min(delta, max_simulation_dt) / 1000;
            game.update(dt);
            controllers.forEach(controller => controller.update(dt));
            setTimeout(updateLoop, min_simulation_dt);
        }

        rebuildMapTable(map);
        setTimeout(drawLoop, 20);
        setTimeout(updateLoop, 20);
    });
}
*/
function runAiGameScenario(bundle) {
    TILE_SIZE = 32;
    PADDING_X = 8;
    $(window).ready(() => {

        let map = undefined;
        let game = undefined;
        let controllers = undefined;
        let me = undefined;

        let load_level = (level) => {
            bundle.level_loaded(level);
            map = new GameMap(MAX_WIDTH, MAX_HEIGHT, 0.1);
            game = new Game(map, 0.05);
            controllers = [];

            me = new Player(0, 1, 1, 5);
            let ghosts = [];
            let rand_x = () => Math.floor(Math.random() * 5 - 2) * 2 + largestOdd(Math.floor(MAX_WIDTH / 2));
            let rand_y = () => Math.floor(Math.random() * 5 - 2) * 2 + largestOdd(Math.floor(MAX_HEIGHT / 2));
            if (level === 1) {
                ghosts.push(new Ghost(1, rand_x(), rand_y(), 3));
                ghosts.push(new Ghost(2, rand_x(), rand_y(), 3));
                COLORING = OverworldColoring;
            } else if (level === 2) {
                ghosts.push(new Ghost(1, rand_x(), rand_y(), 3));
                ghosts.push(new Ghost(2, rand_x(), rand_y(), 3));
                ghosts.push(new Ghost(3, rand_x(), rand_y(), 3));
                COLORING = MineColoring;
            } else if (level === 3) {
                ghosts.push(new Ghost(1, rand_x(), rand_y(), 2));
                ghosts.push(new Ghost(2, rand_x(), rand_y(), 3));
                ghosts.push(new Ghost(3, rand_x(), rand_y(), 3));
                COLORING = NorthPoleColoring;
            } else if (level === 4) {
                ghosts.push(new Ghost(1, rand_x(), rand_y(), 2));
                ghosts.push(new Ghost(2, rand_x(), rand_y(), 2));
                ghosts.push(new Ghost(3, rand_x(), rand_y(), 3));
                COLORING = EndColoring;
            } else if (level === 5) {
                ghosts.push(new Ghost(1, rand_x(), rand_y(), 2));
                ghosts.push(new Ghost(2, rand_x(), rand_y(), 2));
                ghosts.push(new Ghost(3, rand_x(), rand_y(), 3));
                ghosts.push(new Ghost(4, rand_x(), rand_y(), 3));
                COLORING = DesertColoring;
            } else if (level === 6) {
                ghosts.push(new Ghost(1, rand_x(), rand_y(), 2));
                ghosts.push(new Ghost(2, rand_x(), rand_y(), 2));
                ghosts.push(new Ghost(3, rand_x(), rand_y(), 2));
                ghosts.push(new Ghost(4, rand_x(), rand_y(), 2));
                COLORING = NetherColoring;
            }

            controllers.push(new AutoPlayerController(game, me));
            ghosts.forEach(g => {
                controllers.push(new AutoGhostController(game, g, me));
            });

            game.addUnit(me);
            ghosts.forEach(g => game.addUnit(g));

            rebuildMapTable(map);
        };

        let cur_level = 1;
        load_level(cur_level);

        let updateTimer = new Timer();
        let level_ended = false;
        let level_passed = false;
        let level_transition_time = 1.5;

        function drawLoop() {
            clear();
            drawGameState(game);
            setTimeout(drawLoop, 1);
        }

        function updateLoop() {
            game.tick_base = bundle.speed;
            let delta = updateTimer.get_delta();
            let dt = Math.min(delta, max_simulation_dt) / 1000;
            if (level_ended) {
                bundle.level_result(cur_level, level_passed);
                level_transition_time -= dt;
                if (level_transition_time < 0) {
                    if (level_passed) {
                        if (cur_level === 6) return;
                        cur_level = cur_level + 1;
                    } else {
                        cur_level = 1;
                    }
                    load_level(cur_level);
                    level_ended = false;
                    level_passed = false;
                    level_transition_time = 1.5;
                }
            } else {
                game.update(dt);
                controllers.forEach(controller => controller.update(dt));
                if (me.dead) {
                    level_passed = false;
                    level_ended = true;
                } else {
                    let coins_found = 0;
                    tableIterator(game.width, game.height, (i, j) => coins_found += game.coin[i][j]);
                    if (coins_found === 0) {
                        level_passed = true;
                        level_ended = true;
                    }
                }
            }

            setTimeout(updateLoop, min_simulation_dt);
        }

        setTimeout(drawLoop, 20);
        setTimeout(updateLoop, 20);
    });
}