import Renderable from './Renderable'
import defer from 'es6-defer';

/**
 * Dashboard module
 *
 * @class     Dashboard
 * @module    lava/Dashboard
 * @author    Kevin Hill <kevinkhill@gmail.com>
 * @copyright (c) 2015, KHill Designs
 * @license   MIT
 */

/**
 * Dashboard Class
 *
 * This is the javascript version of a dashboard with methods for interacting with
 * the google chart and the PHP lavachart output.
 *
 * @param {String} label
 * @constructor
 */
export default class Dashboard extends Renderable
{
    constructor(label) {
        super('Dashboard', label);

        this._bindings  = [];
        this._dashboard = null;

        this.promises   = {
            rendered: defer(),
            configure: defer()
        };
    }

    getBindings() {
        return this._bindings;
    }

    setBindings(value) {
        this._bindings = value;
    }

    getDashboard() {
        return this._dashboard;
    }

    setDashboard(value) {
        this._dashboard = value;
    }
}