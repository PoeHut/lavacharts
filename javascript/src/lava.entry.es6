import LavaJs from './lava/LavaJs'
import addResizeEvent from './lava/Utils';
import ready from 'document-ready'
import bind from 'lodash'

/**
 * Lava.js entry point for Browserify
 */
(function(){
    "use strict";

    const window = this;
    const debounceTimeout = 250;

    let debounced = null;

    window.lava = LavaJs;

    /**
     * Once the window is ready...
     */
    ready(() => {
        /**
         * Adding the resize event listener for redrawing charts.
         */
        addResizeEvent(event => {
            const redraw = bind(event.target.lava.redrawAll, window.lava);

            console.log('[lava.js] Redrawing...');

            clearTimeout(debounced);

            debounced = setTimeout(redraw, debounceTimeout);
        });

        /**
         * Let's go!
         */
        window.lava.init();
        window.lava.run();
    });
}.apply(window));