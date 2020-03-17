function tileHash(x, y, seed = 37) {
    return 98741 + (x + 37) * 9631 + (y + 31) * 337 + x * y * 337 + x * x * seed + y * y * (seed + 3);
}

class BaseColoring {
    static get_pacman_texture(x, y, direction) {
        return PACMAN[direction];
    }

    static get_tile_texture(x, y, tile) {
        switch (tile) {
            case Tile.EMPTY:
                return IMAGE_EMPTY;
            case Tile.WALL:
                return IMAGE_OBSIDIAN;
        }
    }

    static get_tile_background() {
        return IMAGE_DIRT;
    }
}

class NorthPoleColoring extends BaseColoring {
    static get_tile_texture(x, y, tile) {
        switch (tile) {
            case Tile.EMPTY:
                return IMAGE_SNOW;
            case Tile.WALL:
                return IMAGE_OBSIDIAN;
        }
    }

    static get_background_texture(x, y) {
        let hash = tileHash(x, y) % 1000;
        if (hash < 200)
            return IMAGE_ICE;
        return IMAGE_SNOW;
    }
}

class NetherColoring extends BaseColoring {
    static get_tile_texture(x, y, tile) {
        switch (tile) {
            case Tile.EMPTY:
                let hash = tileHash(x, y) % 1000;
                if (hash < 300)
                    return IMAGE_SOUL_SAND;
                return IMAGE_NETHERRACK;
            case Tile.WALL:
                return IMAGE_OBSIDIAN;
        }
    }

    static get_background_texture(x, y) {
        let hash = tileHash(x, y) % 1000;
        if (hash < 100)
            return IMAGE_LAVA;
        if (hash < 200)
            return IMAGE_QUARTZ;
        if (hash < 400)
            return IMAGE_SOUL_SAND;
        return IMAGE_NETHERRACK;
    }
}

class OverworldColoring extends BaseColoring {
    static get_tile_texture(x, y, tile) {
        switch (tile) {
            case Tile.EMPTY:
                return IMAGE_PLANKS_BIRCH;
            case Tile.WALL:
                return IMAGE_OBSIDIAN;
        }
    }

    static get_background_texture(x, y) {
        let hash = tileHash(x, y) % 1000;
        if (hash < 100)
            return IMAGE_SAND;
        if (hash < 400)
            return IMAGE_STONE;
        return IMAGE_GRASS;
    }
}

class DesertColoring extends BaseColoring {
    static get_tile_texture(x, y, tile) {
        switch (tile) {
            case Tile.EMPTY:
                return IMAGE_SAND;
            case Tile.WALL:
                return IMAGE_CACTUS;
        }
    }

    static get_background_texture(x, y) {
        let hash = tileHash(x, y) % 1000;
        if (hash < 100)
            return IMAGE_CACTUS;
        if (hash < 400)
            return IMAGE_SANDSTONE;
        return IMAGE_SAND;
    }
}

class EndColoring extends BaseColoring {
    static get_tile_texture(x, y, tile) {
        switch (tile) {
            case Tile.EMPTY:
                return IMAGE_END_STONE;
            case Tile.WALL:
                return IMAGE_OBSIDIAN;
        }
    }

    static get_background_texture(x, y) {
        let hash = tileHash(x, y) % 1000;
        if (hash < 100)
            return IMAGE_END_FRAME;
        if (hash < 400)
            return IMAGE_OBSIDIAN;
        return IMAGE_END_STONE;
    }
}

class MineColoring extends BaseColoring {
    static get_tile_texture(x, y, tile) {
        switch (tile) {
            case Tile.EMPTY:
                return MineColoring.get_background_texture(x, y);
            case Tile.WALL:
                return IMAGE_OBSIDIAN;
        }
    }

    static get_background_texture(x, y) {
        let hash = tileHash(x, y) % 1000;
        if (hash < 10)
            return IMAGE_DIAMOND_ORE;
        if (hash < 30)
            return IMAGE_GOLD_ORE;
        if (hash < 50)
            return IMAGE_REDSTONE_ORE;
        if (hash < 150)
            return IMAGE_IRON_ORE;
        return IMAGE_STONE;
    }
}

let COLORING = EndColoring;