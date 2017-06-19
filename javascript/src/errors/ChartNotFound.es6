import 'src/errors/LavaJsError';

/**
 * ChartNotFound Error Class
 *
 * @module    lava/errors
 * @author    Kevin Hill <kevinkhill@gmail.com>
 * @copyright (c) 2017, KHill Designs
 * @license   MIT
 */
export class ChartNotFound extends LavaJsError
{
    constructor (label)
    {
        super('ChartNotFound', `Chart with label "${label}" was not found.`);
    }
}