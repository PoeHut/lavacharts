/**
 * Slightly modified event attachment handler.
 *
 * Credit to Alex V.
 *
 * @link https://stackoverflow.com/users/327934/alex-v
 * @link http://stackoverflow.com/a/3150139
 * @param {Function} callback
 */
export default function addResizeEvent (callback) {
    if (window === null || typeof(window) === 'undefined') return;
    if (window.addEventListener) {
        window.addEventListener('resize', callback, false);
    } else if (window.attachEvent) {
        window.attachEvent('onresize', callback);
    } else {
        window['onresize'] = callback;
    }
}