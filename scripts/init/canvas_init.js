const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function drawTexture(texture, x, y, w = 1.0, h = 1.0) {
    ctx.drawImage(
        get_texture(texture),
        (x + PADDING) * TILE_SIZE * dpi,
        (y + PADDING) * TILE_SIZE * dpi,
        w * TILE_SIZE * dpi,
        h * TILE_SIZE * dpi
    );
}

function drawColor(color, x, y, w = 1.0, h = 1.0) {
    ctx.fillStyle = color;
    ctx.fillRect(
        (x + PADDING) * TILE_SIZE * dpi,
        (y + PADDING) * TILE_SIZE * dpi,
        w * TILE_SIZE * dpi,
        h * TILE_SIZE * dpi
    );
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function fix_dpi() {
    let style_height = getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    let style_width = getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    canvas.setAttribute('height', '' + style_height * dpi);
    canvas.setAttribute('width', '' + style_width * dpi);
}

function resized() {
    canvas.style.width = document.body.clientWidth + 'px';
    canvas.style.height = document.body.clientHeight + 'px';
    fix_dpi();
}

$(window).resize(resized);

$(window).ready(() => {
    resized();
    TABLE_WIDTH = Math.ceil(document.body.clientWidth / TILE_SIZE);
    TABLE_HEIGHT = Math.ceil(document.body.clientHeight / TILE_SIZE);
    MAX_WIDTH = largestOdd(TABLE_WIDTH - 2 * PADDING);
    MAX_HEIGHT = largestOdd(TABLE_HEIGHT - 2 * PADDING);
});