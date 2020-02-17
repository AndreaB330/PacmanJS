

/**
 * Array of offsets on rectangular grid
 */
let DELTAS = [[0, -1], [1, 0], [0, 1], [-1, 0], [0, 0]];

const Direction = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
    NONE: 4
};

/**
 * Window dpi
 */
const dpi = window.devicePixelRatio;

/**
 * Width and Height of all tiles on the map
 */
let TILE_SIZE = 32;

/**
 * Enum of Tile types
 */
const Tile = {
    EMPTY: 0,
    WALL: 1,
    BRIDGE: 2
};

/**
 * Not constants, determines after window is loaded
 * @type {number}
 */
let TABLE_WIDTH = 12;
let TABLE_HEIGHT = 10;
let MAX_WIDTH = 8;
let MAX_HEIGHT = 6;
let PADDING = 2;