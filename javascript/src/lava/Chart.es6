/* jshint undef: true */
/* globals document, google, require, module */

/**
 * Chart module
 *
 * @class     Chart
 * @module    lava/Chart
 * @author    Kevin Hill <kevinkhill@gmail.com>
 * @copyright (c) 2017, KHill Designs
 * @license   MIT
 */
import Renderable from './Renderable';
import defer from 'es6-defer';

/**
 * Chart Class
 *
 * This is the javascript version of a lavachart with methods for interacting with
 * the google chart and the PHP lavachart output.
 *
 * @param {String} type
 * @param {String} label
 * @constructor
 */
export default class Chart extends Renderable
{
    constructor(type, label) {
        super(type, label);

        this._chart     = null;
        this._package   = null;
        this._pngOutput = false;
        this._formats   = [];
        this.promises   = {
            rendered: defer(),
            configure: defer()
        };
    }

    getChart() {
        return this._chart;
    }

    setChart(value) {
        this._chart = value;
    }

    getFormats() {
        return this._formats;
    }

    setFormats(value) {
        this._formats = value;
    }

    getPngOutput() {
        return this._pngOutput;
    }

    setPngOutput(value) {
        this._pngOutput = Boolean(typeof value === 'undefined' ? false : value);
    }

    getPackage() {
        return this._package;
    }

    setPackage(value) {
        this._package = value;
    }

    /**
     * Redraws the chart.
     *
     * @public
     */
    redraw() {
        this._chart.draw(this._data, this._options);
    }

    /**
     * Draws the chart as a PNG instead of the standard SVG
     *
     * @public
     * @external "chart.getImageURI"
     * @see {@link https://developers.google.com/chart/interactive/docs/printing|Printing PNG Charts}
     */
    drawPng() {
        let img = document.createElement('img');
            img.src = this._chart.getImageURI();

        this.element.innerHTML = '';
        this.element.appendChild(img);
    }

    /**
     * Formats columns of the DataTable.
     *
     * @public
     * @param {Array.<Object>} formats Array of format definitions
     */
    applyFormats (formats) {
        _.each(formats, function (format) {
            let formatter = new google.visualization[format.type](format.config);

            formatter.format(this._data, format.index);
        }.bind(this));
    }
}
