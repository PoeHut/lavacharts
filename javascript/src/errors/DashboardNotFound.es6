import 'src/errors/LavaJsError';

/**
 * DashboardNotFound Error Class
 *
 * @module    lava/errors
 * @author    Kevin Hill <kevinkhill@gmail.com>
 * @copyright (c) 2017, KHill Designs
 * @license   MIT
 */
export class DashboardNotFound extends LavaJsError
{
    constructor (label)
    {
        super('DashboardNotFound', `Chart with label "${label}" was not found.`);
    }
}