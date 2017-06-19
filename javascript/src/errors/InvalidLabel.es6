import 'src/errors/LavaJsError';

/**
 * InvalidLabel Error Class
 *
 * @module    lava/errors
 * @author    Kevin Hill <kevinkhill@gmail.com>
 * @copyright (c) 2017, KHill Designs
 * @license   MIT
 */
export class InvalidLabel extends LavaJsError
{
    constructor (label)
    {
        super('InvalidLabel', typeof label + ' is not a valid label.');
    }
}
