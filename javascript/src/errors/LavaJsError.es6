/**
 * LavaJsError class
 *
 * @module    lava/errors
 * @author    Kevin Hill <kevinkhill@gmail.com>
 * @copyright (c) 2017, KHill Designs
 * @license   MIT
 */
export default class LavaJsError extends Error
{
    constructor (name, message) {
        super();

        this.name    = name;
        this.message = '[lava.js] ' + message;
    }
}
