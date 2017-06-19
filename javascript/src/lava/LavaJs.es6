/* jshint undef: true, unused: true */
/* globals window, document, console, google, module, require */

import _ from 'lodash'
import Chart from './Chart'
import Dashboard from './Dashboard'
import EventEmitter from 'events'
import {InvalidCallback} from "src/errors/InvalidCallback";
import {InvalidLabel} from "src/errors/InvalidLabel";

/**
 * LavaJs module
 *
 * @module    lava/Lava
 * @author    Kevin Hill <kevinkhill@gmail.com>
 * @copyright (c) 2017, KHill Designs
 * @license   MIT
 */
export const GOOGLE_LOADER_URL = 'https://www.gstatic.com/charts/loader.js';

export default class LavaJs extends EventEmitter
{
    constructor() {
        super();

        /**
         * JSON object of config items.
         *
         * @type {Array}
         * @private
         */
        this._config = (function() {
            if (typeof CONFIG_JSON === 'undefined') {
                return {};
            } else {
                return CONFIG_JSON;
            }
        }());

        /**
         * Array of charts stored in the module.
         *
         * @type {Array.<Chart>}
         * @private
         */
        this._charts = [];

        /**
         * Array of dashboards stored in the module.
         *
         * @type {Array.<Dashboard>}
         * @private
         */
        this._dashboards = [];

        /**
         * Ready callback to be called when the module is finished running.
         *
         * @callback _readyCallback
         * @private
         */
        this._readyCallback = _.noop();
    }

    /**
     * Create a new Chart.
     *
     * @public
     * @param  {String} type Type of chart to create
     * @param  {String} label Label for the chart
     * @return {Chart}
     */
    static createChart(type, label) {
        return new Chart(type, label);
    }

    /**
     * Create a new Dashboard with a given label.
     *
     * @public
     * @param  {String} label
     * @return {Dashboard}
     */
    static createDashboard(label) {
        return new Dashboard(label);
    }

    /**
     * Event wrapper for chart events.
     *
     *
     * Used internally when events are applied so the user event function has
     * access to the chart within the event callback.
     *
     * @param {Object} event
     * @param {Object} chart
     * @param {Function} callback
     * @return {Function}
     */
    static event (event, chart, callback) {
        if (typeof callback !== 'function') {
            throw new InvalidCallback(callback);
        }

        return callback(event, chart);
    }

    /**
     * Initialize the Lava.js module by attaching the event listeners
     * and calling the charts' and dashboards' init methods
     *
     * @public
     */
    init() {
        console.log('lava.js init');

        let readyCount = 0;

        this.on('ready', renderable => {
            console.log(renderable.uuid + ' ready');

            readyCount++;

            if (readyCount === this._getRenderables().length) {
                console.log('loading google');

                this._loadGoogle().then(() => {
                    return this._mapRenderables(renderable => {
                        console.log('configuring ' + renderable.uuid);

                        return renderable.configure();
                    });
                }).then(() => {
                    return this._mapRenderables(renderable => {
                        console.log('rendering ' + renderable.uuid);

                        return renderable.render();
                    });
                }).then(() => {
                    console.log('lava.js ready');

                    this._readyCallback();
                });
            }
        });

        this.emit('initialized');
    }


    /**
     * Runs the Lava.js module by calling all the renderables' init methods
     *
     * @public
     */
    run() {
        console.log('lava.js running');

        this._forEachRenderable(renderable => {
            console.log('init ' + renderable.uuid);

            renderable.init();
        });
    }

    /**
     * Assigns a callback for when the charts are ready to be interacted with.
     *
     * This is used to wrap calls to lava.loadData() or lava.loadOptions()
     * to protect against accessing charts that aren't loaded yet
     *
     * @public
     * @param {Function} callback
     */
    ready (callback) {
        if (typeof callback !== 'function') {
            throw new InvalidCallback(callback);
        }

        this._readyCallback = callback;
    }

    /**
     * Stores a renderable lava object within the module.
     *
     * @param {Chart|Dashboard} renderable
     */
    store (renderable) {
        if (renderable instanceof Chart) {
            this._storeChart(renderable);
        }

        if (renderable instanceof Dashboard) {
            this.storeDashboard(renderable);
        }
    }

    /**
     * Loads new data into the chart and redraws.
     *
     *
     * Used with an AJAX call to a PHP method returning DataTable->toJson(),
     * a chart can be dynamically update in page, without reloads.
     *
     * @public
     * @param {String} label
     * @param {String} json
     * @param {Function} callback
     */
    loadData (label, json, callback) {
        if (typeof callback === 'undefined') {
            callback = _.noop;
        }

        if (typeof callback !== 'function') {
            throw new InvalidCallback(callback);
        }

        this.getChart(label, chart => {
            if (typeof json.data === 'undefined') {
                chart.setData(json);
            } else {
                chart.setData(json.data);
            }

            if (typeof json.formats === 'undefined') {
                chart.applyFormats(json.formats);
            }

            chart.redraw();

            callback(chart);
        });
    }

    /**
     * Loads new options into a chart and redraws.
     *
     *
     * Used with an AJAX call, or javascript events, to load a new array of options into a chart.
     * This can be used to update a chart dynamically, without reloads.
     *
     * @public
     * @param {String} label
     * @param {String} json
     * @param {Function} callback
     */
    loadOptions(label, json, callback) {
        if (typeof callback === 'undefined') {
            callback = _.noop;
        }

        if (typeof callback !== 'function') {
            throw new InvalidCallback(callback);
        }

        this.getChart(label, chart => {
            chart.options = json;

            chart.redraw();

            callback(chart);
        });
    }

    /**
     * Redraws all of the registered charts on screen.
     *
     * This method is attached to the window resize event with a 300ms debounce
     * to make the charts responsive to the browser resizing.
     */
    redrawAll() {
        _.debounce(_.bind(() => {
            this._forEachRenderable(renderable => {
                renderable.redraw();
            });
        }, this), 300);
    }

    /**
     * Returns the LavaChart javascript objects
     *
     *
     * The LavaChart object holds all the user defined properties such as data, options, formats,
     * the GoogleChart object, and relative methods for internal use.
     *
     * The GoogleChart object is available as ".chart" from the returned LavaChart.
     * It can be used to access any of the available methods such as
     * getImageURI() or getChartLayoutInterface().
     * See https://google-developers.appspot.com/chart/interactive/docs/gallery/linechart#methods
     * for some examples relative to LineCharts.
     *
     * @public
     * @param  {String}   label
     * @param  {Function} callback
     * @return {Chart}
     * @throws InvalidLabel
     * @throws InvalidCallback
     * @throws ChartNotFound
     */
    getChart(label, callback) {
        if (typeof label !== 'string') {
            throw new InvalidLabel(label);
        }

        if (typeof callback !== 'function') {
            throw new InvalidCallback(callback);
        }

        const chart = _.find(this._charts, {label: label});

        if ( ! hart instanceof Chart) {
            throw new ChartNotFound(label);
        }

        callback(chart);
    }

    /**
     * Stores a chart within the module.
     *
     * @private
     * @param {Chart} chart
     */
    _storeChart(chart) {
        this._charts.push(chart);
    }

    /**
     * Stores a dashboard within the module.
     *
     * @public
     * @param {Dashboard} dash
     */
    _storeDashboard(dash) {
        this._dashboards.push(dash);
    }

    /**
     * Retrieve a Dashboard from Lava.js
     *
     * @public
     * @param  {String}   label    Dashboard label.
     * @param  {Function} callback Callback function
     * @return {Dashboard}
     * @throws InvalidLabel
     * @throws InvalidCallback
     * @throws DashboardNotFound
     */
    getDashboard(label, callback) {
        if (typeof label !== 'string') {
            throw new InvalidLabel(label);
        }

        if (typeof callback !== 'function') {
            throw new InvalidCallback(callback);
        }

        const dash = _.find(this._dashboards, {label: label});

        if ( ! dash instanceof Dashboard) {
            throw new DashboardNotFound(label);
        }

        callback(dash);
    }

    /**
     * Returns an array with the charts and dashboards.
     *
     * @private
     * @return {Array}
     */
    _getRenderables() {
        return _.concat(this._charts, this._dashboards);
    }

    /**
     * Applies the callback to each of the charts and dashboards.
     *
     * @private
     * @param {Function} callback
     */
    _forEachRenderable(callback) {
        _.forEach(this._getRenderables(), callback);
    }

    /**
     * Applies the callback and builds an array of return values
     * for each of the charts and dashboards.
     *
     * @private
     * @param {Function} callback
     * @return {Array}
     */
    _mapRenderables(callback) {
        return _.map(this._getRenderables(), callback);
    }

    /**
     * Returns the defined locale of the charts.
     *
     * @private
     * @return {String}
     */
    _getLocale() {
        return this._config.locale;
    }

    /**
     * Returns an array of the google packages to load.
     *
     * @private
     * @return {Array}
     */
    _getPackages() {
        return _.union(
            _.map(this._charts, 'package'),
            _.flatten(_.map(this._dashboards, 'packages'))
        );
    }

    /**
     * Load Google's apis and resolve the promise when ready.
     */
    _loadGoogle() {
        const s = document.createElement('script');

        let $lava = this;
        let deferred = defer();

        s.type = 'text/javascript';
        s.async = true;
        s.src = GOOGLE_LOADER_URL;
        s.onload = s.onreadystatechange = function (event) {
            event = event || window.event;

            if (event.type === "load" || (/loaded|complete/.test(this.readyState))) {
                this.onload = this.onreadystatechange = null;

                let packages = $lava._getPackages();
                let locale   = $lava._getLocale();

                console.log('google loaded');
                console.log(packages);

                google.charts.load('current', {
                    packages: packages,
                    language: locale
                });

                google.charts.setOnLoadCallback(deferred.resolve);
            }
        };

        document.head.appendChild(s);

        return deferred.promise;
    }

}
