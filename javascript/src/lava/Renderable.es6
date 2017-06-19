/**
 * Chart module
 *
 * @class     Chart
 * @module    lava/Chart
 * @author    Kevin Hill <kevinkhill@gmail.com>
 * @copyright (c) 2015, KHill Designs
 * @license   MIT
 */
import _ from 'lodash';
import {ElementIdNotFound} from 'src/errors/ElementIdNotFound';

/**
 * Renderable Class
 *
 * This is the parent class to both Chart and Dashboard providing common properties and methods.
 *
 * @param {String} type
 * @param {String} label
 * @constructor
 */
export default class Renderable
{
    constructor(type, label) {
        /**
         * Renderable Options
         *
         * @type {Object}
         * @private
         */
        this._options = {};

        /**
         * Renderable Label
         *
         * @type {String}
         * @private
         */
        this._label = label;

        /**
         * Renderable Type
         *
         * @type {String}
         * @private
         */
        this._type = type;

        /**
         * DataTable for the Renderable
         *
         * @type {DataTable}
         * @private
         */
        this._data = null;

        /**
         * Placeholder for the init method to be defined by the template.
         *
         * @type {Function}
         */
        this.init = _.noop();

        /**
         * Placeholder for the configure method to be defined by the template.
         *
         * @type {Function}
         */
        this.configure = _.noop();

        /**
         * Placeholder for the configure method to be defined by the template.
         *
         * @type {Function}
         */
        this.render = _.noop();
    }

    /**
     * Returns the unique identifier for the renderable.
     *
     * @returns {string}
     */
    get uuid() {
        return this._type+'::'+this._label;
    }

    get options () {
        return this._options;
    }

    setOptions(options) {
        this._options = options;
    }

    getOption(key) {
        if ( ! key in this._options) {
            return null;
        }

        return this._options[key];
    }

    setOption(key, value) {
        this._options[key] = value;
    }

    /**
     * Returns the DataTable for the Renderable
     *
     * @return {DataTable}
     */
    getData() {
        return this._data;
    }

    /**
     * Sets the data for the chart by creating a new DataTable
     *
     * @public
     * @typedef {DataTable} google.visualization.DataTable
     * @external "google.visualization.DataTable"
     * @see   {@link https://developers.google.com/chart/interactive/docs/reference#DataTable|DataTable Class}

     */
    setData(value) {
        this._data = new google.visualization.DataTable(value);
    }

    getElement() {
        return this._element;
    }

    setElement(value) {
        this._element = document.getElementById(value);

        if (! this._element) {
            throw new ElementIdNotFound(value);
        }
    }

    getType() {
        return this._type;
    }

    setType(value) {
        this._type = value;
    }

    getLabel() {
        return this._label;
    }

    setLabel(value) {
        this._label = value;
    }
}
