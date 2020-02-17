const min_simulation_dt = 10; // milliseconds
const max_simulation_dt = 20;

function runPathFindingScenario() {
    TILE_SIZE = 16;
    $(window).ready(() => {

        let map = new GameMap(MAX_WIDTH, MAX_HEIGHT, 0.6);
        let game = new Game(map);
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
            let delta = updateTimer.get_delta();
            let dt = Math.min(delta, max_simulation_dt) / 1000;
            game.update(dt);
            controller.update(dt);
            setTimeout(updateLoop, min_simulation_dt);
        }

        rebuildMapTable(map);
        setTimeout(drawLoop, 20);
        setTimeout(updateLoop, 20);
    });
}

function runUserGameScenario() {
    TILE_SIZE = 32;
    $(window).ready(() => {

        let map = new GameMap(MAX_WIDTH, MAX_HEIGHT, 0.4);
        let game = new Game(map);

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