function rebuildMapTable(map) {
    let html_buffer = [];
    for (let j = -PADDING_Y; j < map.height + PADDING_Y; j++) {
        html_buffer.push('<tr>');
        for (let i = -PADDING_X; i < map.width + PADDING_X; i++) {
            let img_src = '';
            if (i >= 0 && j >= 0 && i < map.width && j < map.height)
                img_src = COLORING.get_tile_texture(i, j, map.tiles[i][j]);
            else
                img_src = COLORING.get_background_texture(i, j);
            html_buffer.push('<td>');
            html_buffer.push(`<image src="${img_src}" width="${TILE_SIZE}px" height="${TILE_SIZE}px">`);
            html_buffer.push('</td>');
        }
        html_buffer.push('</tr>');
    }
    $('#map').html(html_buffer.join(''));
    $('image').css('height', TILE_SIZE + 'px');
    $('tr').css('height', TILE_SIZE + 'px');
}

function drawPathFindingController(controller) {
    let [from, to] = [controller.pathfinder.from, controller.pathfinder.to];
    let dist = controller.pathfinder.dist;
    let map = controller.game.map;

    if (!from) return;

    let max_dist = dist[to];
    let f = (1.0 - (controller.countdown / (time_to_display * max_dist)));
    if (f < 1.0) {
        let dist_limit = f * max_dist;
        tableIterator(map.width, map.height, (i, j) => {
            let d = dist[[i, j]];
            if (d && d <= dist_limit) {
                ctx.globalAlpha = 0.3 + 0.7 * d / dist_limit;
                drawColor((d === Math.floor(dist_limit) ? '#0005da' : '#00da05'), i, j);
                ctx.globalAlpha = 1.0;
            }
        });
    } else {
        draw_path(controller.path_to_follow);
    }
    drawTexture(IMAGE_CROSS, to[0], to[1]);

}

function drawGameState(game) {
    tableIterator(game.width, game.height, (i, j) => {
        if (game.coin[i][j] === 1) {
            drawTexture(IMAGE_COIN, i, j);
        }
        if (game.coin[i][j] === 2) {
            drawTexture(IMAGE_DIAMOND, i, j);
        }
    });
    let alpha = game.tick_bank / game.tick_base;
    let beta = 1 - alpha;
    game.units.forEach(u => {
        if (!u.dead)
            drawTexture(
                u.textures[u.direction],
                u.pos[0] * beta + u.prev_pos[0] * alpha,
                u.pos[1] * beta + u.prev_pos[1] * alpha
            );
    });
    game.coin_animations.forEach(a => {
        let fraction = 1 - a.time_bank / COIN_ANIMATION_TIME;
        ctx.globalAlpha = 1 - fraction * fraction;
        drawTexture(a.texture, a.pos[0], a.pos[1]);
        ctx.globalAlpha = 1.0;
    });
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