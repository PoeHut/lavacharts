import 'src/errors/LavaJsError';

/**
 * ElementIdNotFound Error Class
 *
 * @module    lava/errors
 * @author    Kevin Hill <kevinkhill@gmail.com>
 * @copyright (c) 2017, KHill Designs
 * @license   MIT
 */
export class ElementIdNotFound extends LavaJsError
{
    constructor (elemId)
    {
        super('ElementIdNotFound', `DOM node # ${elemId} was not found.`);
    }
}
