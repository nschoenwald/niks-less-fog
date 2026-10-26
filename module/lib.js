export const MODULE_ID = 'niks-less-fog';

/**
 * Output a message to the console, prefixed with the module id.
 * @param  {...any} args     Arguments to pass through to console.log().
 */
export function log(...args) {
    console.log(MODULE_ID, '|', ...args);
}
