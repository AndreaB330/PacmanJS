
let CACHE = {};

function get_texture(image_path) {
    if (CACHE.hasOwnProperty(image_path)) {
        return CACHE[image_path];
    }
    let img = new Image();
    img.style['image-rendering'] = 'pixelated';
    img.height = TILE_SIZE;
    img.width = TILE_SIZE;
    img.src = image_path;
    return CACHE[image_path] = img;
}

let IMAGE_EMPTY = "resources/tiles/empty.png";
let IMAGE_DIRT = "resources/tiles/dirt.png";
let IMAGE_BRICK = "resources/tiles/brick.png";
let IMAGE_OBSIDIAN = "resources/tiles/obsidian.png";
let IMAGE_ICE = "resources/tiles/ice.png";
let IMAGE_SNOW = "resources/tiles/snow.png";
let IMAGE_LAMP = "resources/tiles/lamp.png";
let IMAGE_LAVA = "resources/tiles/lava.png";
let IMAGE_NETHERRACK = "resources/tiles/netherrack.png";
let IMAGE_SOUL_SAND = "resources/tiles/soul_sand.png";
let IMAGE_STONE = "resources/tiles/stone.png";
let IMAGE_GRASS = "resources/tiles/grass.png";
let IMAGE_PLANKS_OAK = "resources/tiles/planks_oak.png";
let IMAGE_PLANKS_SPRUCE = "resources/tiles/planks_spruce.png";
let IMAGE_PLANKS_BIRCH = "resources/tiles/planks_birch.png";
let IMAGE_LOG_OAK = "resources/tiles/log_oak.png";
let IMAGE_WATER = "resources/tiles/water.png";
let IMAGE_SAND = "resources/tiles/sand.png";
let IMAGE_SANDSTONE = "resources/tiles/sandstone.png";
let IMAGE_CACTUS = "resources/tiles/cactus.png";
let IMAGE_END_STONE = "resources/tiles/end_stone.png";
let IMAGE_END_FRAME = "resources/tiles/end_frame.png";
let IMAGE_QUARTZ = "resources/tiles/quartz.png";
let IMAGE_DIAMOND_ORE = "resources/tiles/diamond_ore.png";
let IMAGE_REDSTONE_ORE = "resources/tiles/redstone_ore.png";
let IMAGE_IRON_ORE = "resources/tiles/iron_ore.png";
let IMAGE_GOLD_ORE = "resources/tiles/gold_ore.png";

let IMAGE_CROSS = "resources/markers/cross.png";

let IMAGE_COIN = "resources/items/coin.png";
let IMAGE_DIAMOND = "resources/items/diamond.png";

let PACMAN = [
    "resources/pacman/pacman-up.png",
    "resources/pacman/pacman-right.png",
    "resources/pacman/pacman-down.png",
    "resources/pacman/pacman-left.png",
    "resources/pacman/pacman-idle.png"
];

let GHOST = [
    "resources/mobs/creep-idle.png",
    "resources/mobs/creep-idle.png",
    "resources/mobs/creep-idle.png",
    "resources/mobs/creep-idle.png",
    "resources/mobs/creep-idle.png"
];

let ENDER = [
    "resources/mobs/ender-idle.png",
    "resources/mobs/ender-idle.png",
    "resources/mobs/ender-idle.png",
    "resources/mobs/ender-idle.png",
    "resources/mobs/ender-idle.png"
];

let IMAGE_REDSTONE = new Array(16).fill(null);

for(let i = 0; i < 16; i++) {
    let name = 'resources/markers/';
    for(let j = 0; j < 4; j++) {
        name += (i >> j) & 1;
    }
    name += '.png';
    IMAGE_REDSTONE[i] = name;
    get_texture(name);
}
IMAGE_REDSTONE[0] = IMAGE_CROSS;