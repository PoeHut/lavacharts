import 'src/errors/LavaJsError';

/**
 * InvalidCallback Error Class
 *
 * @module    lava/errors
 * @author    Kevin Hill <kevinkhill@gmail.com>
 * @copyright (c) 2017, KHill Designs
 * @license   MIT
 */
export class InvalidCallback extends LavaJsError
{
    constructor (callback)
    {
        super('InvalidCallback', typeof callback + ' is not a valid callback.');
    }
}
