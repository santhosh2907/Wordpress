/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';

let isProFeature = applyFilters('isProFeature', true);



/**
 * Template option choices for predefined columns layouts.
 */
const variations = [

    {
        name: 'preset-1',
        title: __('preset-1'),
        description: __('preset-1'),

        isPro: false,
        atts: {
            wrapper: { "options": { "tag": "div", "class": "" }, "styles": { "backgroundColor": { "Desktop": "#9DD6DF" }, "position": { "Desktop": "fixed" }, "top": { "Desktop": "30px" }, "left": { "Desktop": "0px" }, "width": { "Desktop": "100% !important" }, "height": { "Desktop": "100% !important" }, "maxWidth": { "Desktop": "100% !important" }, "zIndex": { "Desktop": "99" }, "borderRadius": {}, "padding": { "Desktop": "20px 20px 20px 20px" } } },
            inner: { "options": { "tag": "div", "class": "" }, "styles": { "width": { "Desktop": "700px" }, "height": { "Desktop": "400px" }, "top": { "Desktop": "50%" }, "left": { "Desktop": "50%" }, "position": { "Desktop": "absolute" }, "transform": { "Desktop": "translateX(-50%) translateY(-50%) " }, "backgroundColor": { "Desktop": "#A084CF" }, "padding": { "Desktop": "15px 15px 15px 15px" }, "borderRadius": { "Desktop": "5px 5px 5px 5px" }, "overflow": {} } },
            closeWrap: { "options": { "tag": "span", "class": "", "library": "fontAwesome", "srcType": "class", "iconSrc": "fas fa-times", "animation": "zoomOutLeft" }, "styles": { "backgroundColor": { "Desktop": "#ff6565" }, "padding": { "Desktop": "8px 15px 7px 15px" }, "borderRadius": { "Desktop": "50px 50px 50px 50px" }, "color": { "Desktop": "#ffffff" }, "right": { "Desktop": "-21px" }, "top": { "Desktop": "-21px" }, "position": { "Desktop": "absolute" }, "cursor": { "Desktop": "pointer" } }, "hover": { "backgroundColor": { "Desktop": "#a82b2b" } } },

            blockId: "", customCss: "", blockCssY: { items: {} }
        },
        innerBlocks: [
            ['post-grid/text', {}],
        ],
        scope: ['block'],
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 236"><rect fill="#3c3c3b" width="360" height="42.15" /><path fill="#ffffff" d="M27.66,26.62a1.22,1.22,0,0,1-.93-.43l-7.39-8.63A1.23,1.23,0,0,1,21.21,16l6.45,7.54L34.12,16A1.23,1.23,0,0,1,36,17.56L28.6,26.19A1.24,1.24,0,0,1,27.66,26.62Z" /><rect fill="#ffffff" x="48.66" y="15.53" width="174.4" height="11.09" /><rect fill="#ffffff" y="99.56" width="360" height="86.66" /><rect fill="#ffffff" y="49.78" width="360" height="42.15" /><path fill="#3c3c3b" d="M27.66,65.31a1.26,1.26,0,0,1,.94.43L36,74.37A1.23,1.23,0,1,1,34.12,76l-6.46-7.53L21.21,76a1.23,1.23,0,1,1-1.87-1.6l7.39-8.63A1.22,1.22,0,0,1,27.66,65.31Z" /><rect fill="#3c3c3b" x="48.66" y="65.31" width="174.4" height="11.09" /><rect fill="#3c3c3b" y="193.85" width="360" height="42.15" /><path fill="#ffffff" d="M27.66,220.47a1.22,1.22,0,0,1-.93-.43l-7.39-8.63a1.23,1.23,0,1,1,1.87-1.6l6.45,7.53,6.46-7.53a1.23,1.23,0,1,1,1.87,1.6L28.6,220A1.24,1.24,0,0,1,27.66,220.47Z" /><rect fill="#ffffff" x="48.66" y="209.38" width="174.4" height="11.09" /></svg>
        ),

    },


    {
        name: 'preset-2',
        title: __('preset-2'),
        description: __('preset-2'),
        isPro: false,
        atts: {
            wrapper: { "options": { "tag": "div", "class": "" }, "styles": { "backgroundColor": { "Desktop": "#9DD6DF" }, "position": { "Desktop": "fixed" }, "top": { "Desktop": "30px" }, "left": { "Desktop": "0px" }, "width": { "Desktop": "100% !important" }, "height": { "Desktop": "100% !important" }, "maxWidth": { "Desktop": "100% !important" }, "zIndex": { "Desktop": "99" }, "borderRadius": {}, "padding": { "Desktop": "20px 20px 20px 20px" } } },
            inner: { "options": { "tag": "div", "class": "" }, "styles": { "width": { "Desktop": "700px" }, "height": { "Desktop": "400px" }, "top": { "Desktop": "50%" }, "left": { "Desktop": "50%" }, "position": { "Desktop": "absolute" }, "transform": { "Desktop": "translateX(-50%) translateY(-50%) " }, "backgroundColor": { "Desktop": "#A084CF" }, "padding": { "Desktop": "15px 15px 15px 15px" }, "borderRadius": { "Desktop": "5px 5px 5px 5px" }, "overflow": {} } },
            closeWrap: { "options": { "tag": "span", "class": "", "library": "fontAwesome", "srcType": "class", "iconSrc": "fas fa-times", "animation": "zoomOutLeft" }, "styles": { "backgroundColor": { "Desktop": "#ff6565" }, "padding": { "Desktop": "8px 15px 7px 15px" }, "borderRadius": { "Desktop": "50px 50px 50px 50px" }, "color": { "Desktop": "#ffffff" }, "left": { "Desktop": "-21px" }, "top": { "Desktop": "-21px" }, "position": { "Desktop": "absolute" }, "cursor": { "Desktop": "pointer" } }, "hover": { "backgroundColor": { "Desktop": "#a82b2b" } } },
            blockId: "", customCss: "", blockCssY: { items: {} }
        },
        innerBlocks: [
            ['post-grid/text', {}],
        ],
        scope: ['block'],
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 236"><rect fill="#3c3c3b" width="360" height="42.15" /><path fill="#ffffff" d="M27.66,26.62a1.22,1.22,0,0,1-.93-.43l-7.39-8.63A1.23,1.23,0,0,1,21.21,16l6.45,7.54L34.12,16A1.23,1.23,0,0,1,36,17.56L28.6,26.19A1.24,1.24,0,0,1,27.66,26.62Z" /><rect fill="#ffffff" x="48.66" y="15.53" width="174.4" height="11.09" /><rect fill="#ffffff" y="99.56" width="360" height="86.66" /><rect fill="#ffffff" y="49.78" width="360" height="42.15" /><path fill="#3c3c3b" d="M27.66,65.31a1.26,1.26,0,0,1,.94.43L36,74.37A1.23,1.23,0,1,1,34.12,76l-6.46-7.53L21.21,76a1.23,1.23,0,1,1-1.87-1.6l7.39-8.63A1.22,1.22,0,0,1,27.66,65.31Z" /><rect fill="#3c3c3b" x="48.66" y="65.31" width="174.4" height="11.09" /><rect fill="#3c3c3b" y="193.85" width="360" height="42.15" /><path fill="#ffffff" d="M27.66,220.47a1.22,1.22,0,0,1-.93-.43l-7.39-8.63a1.23,1.23,0,1,1,1.87-1.6l6.45,7.53,6.46-7.53a1.23,1.23,0,1,1,1.87,1.6L28.6,220A1.24,1.24,0,0,1,27.66,220.47Z" /><rect fill="#ffffff" x="48.66" y="209.38" width="174.4" height="11.09" /></svg>
        ),
    },


    {
        name: 'preset-3',
        title: __('preset-3'),
        description: __('preset-3'),
        isPro: false,
        atts: {
            wrapper: { "options": { "tag": "div", "class": "" }, "styles": { "backgroundColor": { "Desktop": "#9DD6DF" }, "position": { "Desktop": "fixed" }, "top": { "Desktop": "30px" }, "left": { "Desktop": "0px" }, "width": { "Desktop": "100% !important" }, "height": { "Desktop": "100% !important" }, "maxWidth": { "Desktop": "100% !important" }, "zIndex": { "Desktop": "99" }, "borderRadius": {}, "padding": { "Desktop": "20px 20px 20px 20px" } } },
            inner: { "options": { "tag": "div", "class": "" }, "styles": { "width": { "Desktop": "700px" }, "height": { "Desktop": "400px" }, "top": { "Desktop": "50%" }, "left": { "Desktop": "50%" }, "position": { "Desktop": "absolute" }, "transform": { "Desktop": "translateX(-50%) translateY(-50%) " }, "backgroundColor": { "Desktop": "#A084CF" }, "padding": { "Desktop": "15px 15px 15px 15px" }, "borderRadius": { "Desktop": "5px 5px 5px 5px" }, "overflow": {} } },
            closeWrap: { "options": { "tag": "span", "class": "", "library": "fontAwesome", "srcType": "class", "iconSrc": "fas fa-times", "animation": "zoomOutLeft" }, "styles": { "backgroundColor": { "Desktop": "#ff6565" }, "padding": { "Desktop": "8px 15px 7px 15px" }, "borderRadius": { "Desktop": "50px 50px 50px 50px" }, "color": { "Desktop": "#ffffff" }, "left": { "Desktop": "-21px" }, "bottom": { "Desktop": "-21px" }, "position": { "Desktop": "absolute" }, "cursor": { "Desktop": "pointer" } }, "hover": { "backgroundColor": { "Desktop": "#a82b2b" } } },
            blockId: "", customCss: "", blockCssY: { items: {} }
        },
        innerBlocks: [
            ['post-grid/text', {}],
        ],
        scope: ['block'],
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 236"><rect fill="#3c3c3b" width="360" height="42.15" /><path fill="#ffffff" d="M27.66,26.62a1.22,1.22,0,0,1-.93-.43l-7.39-8.63A1.23,1.23,0,0,1,21.21,16l6.45,7.54L34.12,16A1.23,1.23,0,0,1,36,17.56L28.6,26.19A1.24,1.24,0,0,1,27.66,26.62Z" /><rect fill="#ffffff" x="48.66" y="15.53" width="174.4" height="11.09" /><rect fill="#ffffff" y="99.56" width="360" height="86.66" /><rect fill="#ffffff" y="49.78" width="360" height="42.15" /><path fill="#3c3c3b" d="M27.66,65.31a1.26,1.26,0,0,1,.94.43L36,74.37A1.23,1.23,0,1,1,34.12,76l-6.46-7.53L21.21,76a1.23,1.23,0,1,1-1.87-1.6l7.39-8.63A1.22,1.22,0,0,1,27.66,65.31Z" /><rect fill="#3c3c3b" x="48.66" y="65.31" width="174.4" height="11.09" /><rect fill="#3c3c3b" y="193.85" width="360" height="42.15" /><path fill="#ffffff" d="M27.66,220.47a1.22,1.22,0,0,1-.93-.43l-7.39-8.63a1.23,1.23,0,1,1,1.87-1.6l6.45,7.53,6.46-7.53a1.23,1.23,0,1,1,1.87,1.6L28.6,220A1.24,1.24,0,0,1,27.66,220.47Z" /><rect fill="#ffffff" x="48.66" y="209.38" width="174.4" height="11.09" /></svg>
        ),
    },



    {
        name: 'preset-4',
        title: __('preset-4'),
        description: __('preset-4'),
        isPro: false,
        atts: {
            wrapper: { "options": { "tag": "div", "class": "" }, "styles": { "backgroundColor": { "Desktop": "#9DD6DF" }, "position": { "Desktop": "fixed" }, "top": { "Desktop": "30px" }, "left": { "Desktop": "0px" }, "width": { "Desktop": "100% !important" }, "height": { "Desktop": "100% !important" }, "maxWidth": { "Desktop": "100% !important" }, "zIndex": { "Desktop": "99" }, "borderRadius": {}, "padding": { "Desktop": "20px 20px 20px 20px" } } },
            inner: { "options": { "tag": "div", "class": "" }, "styles": { "width": { "Desktop": "700px" }, "height": { "Desktop": "400px" }, "top": { "Desktop": "50%" }, "left": { "Desktop": "50%" }, "position": { "Desktop": "absolute" }, "transform": { "Desktop": "translateX(-50%) translateY(-50%) " }, "backgroundColor": { "Desktop": "#A084CF" }, "padding": { "Desktop": "15px 15px 15px 15px" }, "borderRadius": { "Desktop": "5px 5px 5px 5px" }, "overflow": {} } },
            closeWrap: { "options": { "tag": "span", "class": "", "library": "fontAwesome", "srcType": "class", "iconSrc": "fas fa-times", "animation": "zoomOutLeft" }, "styles": { "backgroundColor": { "Desktop": "#ff6565" }, "padding": { "Desktop": "8px 15px 7px 15px" }, "borderRadius": { "Desktop": "50px 50px 50px 50px" }, "color": { "Desktop": "#ffffff" }, "right": { "Desktop": "-21px" }, "bottom": { "Desktop": "-21px" }, "position": { "Desktop": "absolute" }, "cursor": { "Desktop": "pointer" } }, "hover": { "backgroundColor": { "Desktop": "#a82b2b" } } },
            blockId: "", customCss: "", blockCssY: { items: {} }
        },
        innerBlocks: [
            ['post-grid/text', {}],
        ],
        scope: ['block'],
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 236"><rect fill="#3c3c3b" width="360" height="42.15" /><path fill="#ffffff" d="M27.66,26.62a1.22,1.22,0,0,1-.93-.43l-7.39-8.63A1.23,1.23,0,0,1,21.21,16l6.45,7.54L34.12,16A1.23,1.23,0,0,1,36,17.56L28.6,26.19A1.24,1.24,0,0,1,27.66,26.62Z" /><rect fill="#ffffff" x="48.66" y="15.53" width="174.4" height="11.09" /><rect fill="#ffffff" y="99.56" width="360" height="86.66" /><rect fill="#ffffff" y="49.78" width="360" height="42.15" /><path fill="#3c3c3b" d="M27.66,65.31a1.26,1.26,0,0,1,.94.43L36,74.37A1.23,1.23,0,1,1,34.12,76l-6.46-7.53L21.21,76a1.23,1.23,0,1,1-1.87-1.6l7.39-8.63A1.22,1.22,0,0,1,27.66,65.31Z" /><rect fill="#3c3c3b" x="48.66" y="65.31" width="174.4" height="11.09" /><rect fill="#3c3c3b" y="193.85" width="360" height="42.15" /><path fill="#ffffff" d="M27.66,220.47a1.22,1.22,0,0,1-.93-.43l-7.39-8.63a1.23,1.23,0,1,1,1.87-1.6l6.45,7.53,6.46-7.53a1.23,1.23,0,1,1,1.87,1.6L28.6,220A1.24,1.24,0,0,1,27.66,220.47Z" /><rect fill="#ffffff" x="48.66" y="209.38" width="174.4" height="11.09" /></svg>
        ),
    },







];

export default variations;