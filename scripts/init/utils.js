/**
 * Return largest odd number that is less than x
 * @param x
 * @returns {number}
 */
function largestOdd(x) {
    return (x % 2 === 1 ? x : x - 1);
}

/**
 * Shuffle one-dimensional array
 * @param array
 */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Create array(tensor) with given dimensions
 * @param dimensions - list of dimensions
 * @param value - value to fill the array
 */
function generateArray(dimensions, value) {
    let array = [];
    for (let i = 0; i < dimensions[0]; ++i)
        array.push(dimensions.length === 1 ? value : generateArray(dimensions.slice(1), value));
    return array;
}

/**
 * Get element from array at position
 * @param array
 * @param pos - two-element array with position
 */
function at(array, pos) {
    return array[pos[0]][pos[1]];
}

/**
 * Set element in array at position
 * @param array
 * @param pos - two-element array with position
 * @param val - value to set
 */
function setAt(array, pos, val) {
    array[pos[0]][pos[1]] = val;
}

/**
 * Check if two positions is equal
 * @param posFirst
 * @param posSecond
 * @returns {boolean}
 */
function eq(posFirst, posSecond) {
    return posFirst[0] === posSecond[0] && posFirst[1] === posSecond[1];
}

/**
 * Timer, allows to get elapsed time between frames
 * Use: Create class instance and call get_delta each time you need to get elapsed time from
 * previous call of get_delta or from creation of instance if get_delta called for the first time.
 */
class Timer {
    constructor() {
        this.last_time = Date.now();
    }

    get_delta() {
        let current_time = Date.now();
        let delta = current_time - this.last_time;
        this.last_time = current_time;
        return delta;
    }
}

/**
 * Calls function for each cell of the table of given size and given padding
 * Padding can be negative, which means that function will be called for outer cells
 * @param cols
 * @param rows
 * @param func
 * @param padding
 */
function tableIterator(cols, rows, func, padding = 0) {
    for (let i = padding; i < cols - padding; i++) {
        for (let j = padding; j < rows - padding; j++) {
            func(i, j);
        }
    }
}