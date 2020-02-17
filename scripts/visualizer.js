function rebuildMapTable(map) {
    let html_buffer = [];
    for (let j = -PADDING; j < map.height + PADDING; j++) {
        html_buffer.push('<tr>');
        for (let i = -PADDING; i < map.width + PADDING; i++) {
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
    game.units.forEach(u => {
        drawTexture(
            u.textures[u.direction],
            u.pos[0],
            u.pos[1]
        );
    });
}