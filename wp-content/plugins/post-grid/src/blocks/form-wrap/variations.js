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
        name: 'contact-form-1',
        title: __('Contact Form'),
        description: __('Contact Form'),

        isPro: false,
        atts: {
            wrapper: { "options": { "tag": "div", "class": "" }, "styles": { "gridTemplateColumns": { "Desktop": "1fr " }, "gap": { "Desktop": "1em" }, "display": { "Desktop": "grid" } } }, visible: {}, onSubmit: { "0": { "id": "validation", "messages": [] } }, onProcess: { "0": { "id": "sendMail", "mailTo": "", "bcc": "", "footer": "", "subject": "", "showOnResponse": true }, "3": { "id": "createEntry", "message": "", "showOnResponse": false } }, afterSubmit: { "0": { "id": "showMessage", "message": "" } }, blockCssY: { "items": { ".pg9d6a07354523": { "grid-template-columns": { "Desktop": "1fr " }, "gap": { "Desktop": "1em" }, "display": { "Desktop": "grid" } } } },


        },

        innerBlocks: [
            ['post-grid/form-field-input', {
                wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Your Name", "class": "pg-form-field-label" } }, input: { "options": { "type": "text", "placeholder": "Write your name", "value": "", "name": "full_name", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "Name should not empty", "position": "afterInput", "class": "" }, "styles": { "color": { "Desktop": "#c02121" }, "marginTop": { "Desktop": "10px" } } },
            }],
            ['post-grid/form-field-input', {
                wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Your Email", "class": "pg-form-field-label" } }, input: { "options": { "type": "text", "placeholder": "Write your mail address", "value": "", "name": "email", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "Email should not empty", "position": "afterInput", "class": "" }, "styles": { "color": { "Desktop": "#c02121" }, "marginTop": { "Desktop": "10px" } } },
            }],
            ['post-grid/form-field-input', {
                wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Mail Subject", "class": "pg-form-field-label" } }, input: { "options": { "type": "text", "placeholder": "Write your subject", "value": "", "name": "subject", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "Subject should not empty", "position": "afterInput", "class": "" }, "styles": { "color": { "Desktop": "#c02121" }, "marginTop": { "Desktop": "10px" } } },
            }],
            ['post-grid/form-field-textarea', {
                wrapper: { "options": { "tag": "div", "class": "" }, "styles": {} }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" }, "styles": {} }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Write Your Message", "class": "pg-form-field-label" }, "styles": {} }, input: { "options": { "type": "text", "placeholder": "Write your name", "value": "", "name": "message", "required": false, "disabled": false, "minLength": null, "maxLength": null, "readonly": false, "cols": null, "rows": 3, "autocomplete": false, "autofocus": false, "wrap": false, "spellcheck": false, "autocorrect": false, "id": "", "class": "", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "Message should not empty", "position": "afterInput", "class": "" }, "styles": { "color": { "Desktop": "#c02121" }, "marginTop": { "Desktop": "10px" } } },
            }],
            ['post-grid/form-field-input', {
                wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, label: { "options": { "tag": "label", "for": "label", "enable": false, "text": "Your Name", "class": "pg-form-field-label" } }, input: { "options": { "type": "submit", "placeholder": "Write your name", "value": "Submit", "name": "", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#51557E" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" }, "color": { "Desktop": "#ffffff" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "", "position": "afterInput", "class": "" } },
            }],

        ],
        scope: ['block'],
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80"><rect fill="#1d4ed8" x="41.67" y="13.33" width="76.67" height="23.34" /><rect fill="#1d4ed8" x="41.67" y="43.33" width="76.67" height="23.34" /></svg>
        ),

    },



    {
        name: 'login-form-1',
        title: __('Login Form'),
        description: __('Login Form'),
        atts: {
            wrapper: { "options": { "tag": "div", "class": "" }, "styles": { "gridTemplateColumns": { "Desktop": "1fr " }, "gap": { "Desktop": "1em" }, "display": { "Desktop": "grid" } } }, visible: {}, onSubmit: { "0": { "id": "validation", "messages": [] } }, onProcess: { "0": { "id": "loggedInUser", "message": "", "showOnResponse": true }, "1": { "id": "createEntry", "message": "" } }, afterSubmit: { "1": { "id": "hideForm", "message": "" }, "2": { "id": "redirectToURL", "value": "" } }, blockCssY: { "items": { ".pg9d6a07354523": { "grid-template-columns": { "Desktop": "1fr " }, "gap": { "Desktop": "1em" }, "display": { "Desktop": "grid" } } } },


        },
        isPro: false,

        innerBlocks: [
            ['post-grid/form-field-input', {
                wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" }, "styles": { "margin": { "Desktop": "0px 0px 10px 0px" } } }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Username/Email", "class": "pg-form-field-label" } }, input: { "options": { "type": "text", "placeholder": "", "value": "admin", "name": "username", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "Email should not empty", "position": "afterInput", "class": "" }, "styles": { "color": { "Desktop": "#c02121" }, "marginTop": { "Desktop": "10px" } } },
            }],
            ['post-grid/form-field-input', {
                wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" }, "styles": { "margin": { "Desktop": "0px 0px 10px 0px" } } }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Password", "class": "pg-form-field-label" } }, input: { "options": { "type": "password", "placeholder": "", "value": "123456", "name": "password", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "Name should not empty", "position": "afterInput", "class": "" }, "styles": { "color": { "Desktop": "#c02121" }, "marginTop": { "Desktop": "10px" } } },
            }],
            ['post-grid/form-field-input', {
                wrapper: { "options": { "tag": "div", "class": "" }, "styles": { "display": { "Desktop": "flex" } } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" }, "styles": { "order": { "Desktop": "10" }, "margin": { "Desktop": "0px 0px 0px 10px" } } }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Remember?", "class": "pg-form-field-label" } }, input: { "options": { "type": "checkbox", "placeholder": "Write your name", "value": "", "name": "remember", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "", "position": "afterInput", "class": "" } },
            }],
            ['post-grid/form-field-input', {
                wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, label: { "options": { "tag": "label", "for": "label", "enable": false, "text": "Your Name", "class": "pg-form-field-label" } }, input: { "options": { "type": "submit", "placeholder": "Write your name", "value": "Login", "name": "", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "", "position": "afterInput", "class": "" } },
            }],



        ],
        scope: ['block'],
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80"><rect fill="#1d4ed8" x="41.67" y="13.33" width="76.67" height="23.34" /><rect fill="#1d4ed8" x="41.67" y="43.33" width="76.67" height="23.34" /></svg>
        ),

    },


    {
        name: 'registration-form-1',
        title: __('Registration Form'),
        description: __('Registration Form'),
        atts: {
            wrapper: { "options": { "tag": "div", "class": "" }, "styles": { "gridTemplateColumns": { "Desktop": "1fr " }, "gap": { "Desktop": "1em" }, "display": { "Desktop": "grid" } } }, visible: {}, onSubmit: { "0": { "id": "validation", "messages": [] } }, onProcess: { "0": { "id": "registerUser", "message": "", "showOnResponse": true }, "1": { "id": "createEntry", "message": "", "showOnResponse": false } }, afterSubmit: { "0": { "id": "showMessage", "message": "" } }, blockCssY: { "items": { ".pg9d6a07354523": { "grid-template-columns": { "Desktop": "1fr " }, "gap": { "Desktop": "1em" }, "display": { "Desktop": "grid" } } } },

        },
        isPro: false,

        innerBlocks: [
            ['post-grid/form-field-input', {
                wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" }, "styles": { "margin": { "Desktop": "0px 0px 10px 0px" } } }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Email ", "class": "pg-form-field-label" } }, input: { "options": { "type": "text", "placeholder": "", "value": "", "name": "email", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "Email should not empty", "position": "afterInput", "class": "" }, "styles": { "color": { "Desktop": "#c02121" }, "marginTop": { "Desktop": "10px" } } },
            }],
            ['post-grid/form-field-input', {
                wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" }, "styles": { "margin": { "Desktop": "0px 0px 10px 0px" } } }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Password", "class": "pg-form-field-label" } }, input: { "options": { "type": "password", "placeholder": "", "value": "123456", "name": "password", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "Name should not empty", "position": "afterInput", "class": "" }, "styles": { "color": { "Desktop": "#c02121" }, "marginTop": { "Desktop": "10px" } } },
            }],
            ['post-grid/form-field-input', {
                wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" }, "styles": { "margin": { "Desktop": "0px 0px 10px 0px" } } }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Confirm Password", "class": "pg-form-field-label" } }, input: { "options": { "type": "password", "placeholder": "", "value": "", "name": "password_confirm", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "Name should not empty", "position": "afterInput", "class": "" }, "styles": { "color": { "Desktop": "#c02121" }, "marginTop": { "Desktop": "10px" } } },
            }],
            ['post-grid/form-field-input', {
                wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, label: { "options": { "tag": "label", "for": "label", "enable": false, "text": "Your Name", "class": "pg-form-field-label" } }, input: { "options": { "type": "submit", "placeholder": "", "value": "Register", "name": "", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "", "position": "afterInput", "class": "" } },
            }],

        ],
        scope: ['block'],
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80"><rect fill="#1d4ed8" x="41.67" y="13.33" width="76.67" height="23.34" /><rect fill="#1d4ed8" x="41.67" y="43.33" width="76.67" height="23.34" /></svg>
        ),

    },

    // {
    //     name: 'comment-form-1',
    //     title: __('Comment Form'),
    //     description: __('Comment Form'),
    //     atts: {
    //         wrapper: { "options": { "tag": "div", "class": "" }, "styles": { "gridTemplateColumns": { "Desktop": "1fr " }, "gap": { "Desktop": "1em" }, "display": { "Desktop": "grid" } } }, visible: {}, onSubmit: { "0": { "id": "validation", "messages": [] } }, onProcess: { "0": { "id": "commentSubmit", "postType": "", "showOnResponse": true } }, afterSubmit: { "0": { "id": "showMessage", "message": "" } }, blockCssY: { "items": { ".pg9d6a07354523": { "grid-template-columns": { "Desktop": "1fr " }, "gap": { "Desktop": "1em" }, "display": { "Desktop": "grid" } } } },

    //     },
    //     isPro: false,

    //     innerBlocks: [

    //         ['post-grid/form-field-input', {
    //             wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Your Name", "class": "pg-form-field-label" } }, input: { "options": { "type": "text", "placeholder": "Write your name", "value": "", "name": "full_name", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "", "position": "afterInput", "class": "" }, "styles": { "color": { "Desktop": "#c02121" }, "marginTop": { "Desktop": "10px" } } },
    //         }],
    //         ['post-grid/form-field-input', {
    //             wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Your Email", "class": "pg-form-field-label" }, "styles": {} }, input: { "options": { "type": "text", "placeholder": "Write your mail address", "value": "", "name": "email", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "Email should not empty", "position": "afterInput", "class": "" }, "styles": { "color": { "Desktop": "#c02121" }, "marginTop": { "Desktop": "10px" } } },
    //         }],
    //         ['post-grid/form-field-input', {
    //             wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Website URL", "class": "pg-form-field-label" } }, input: { "options": { "type": "text", "placeholder": "", "value": "", "name": "url", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "Website URL should not empty", "position": "afterInput", "class": "" }, "styles": { "color": { "Desktop": "#c02121" }, "marginTop": { "Desktop": "10px" } } },
    //         }],
    //         ['post-grid/form-field-input', {
    //             wrapper: { "options": { "tag": "div", "class": "" }, "styles": {} }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" }, "styles": {} }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Comment", "class": "pg-form-field-label" }, "styles": {} }, input: { "options": { "type": "text", "placeholder": "", "value": "", "name": "comment_text", "required": false, "disabled": false, "minLength": null, "maxLength": null, "readonly": false, "cols": null, "rows": 3, "autocomplete": false, "autofocus": false, "wrap": false, "spellcheck": false, "autocorrect": false, "id": "", "class": "", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "Comment should not empty", "position": "afterInput", "class": "" }, "styles": { "color": { "Desktop": "#c02121" }, "marginTop": { "Desktop": "10px" } } },
    //         }],
    //         ['post-grid/form-field-input', {
    //             wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, label: { "options": { "tag": "label", "for": "label", "enable": false, "text": "Your Name", "class": "pg-form-field-label" } }, input: { "options": { "type": "submit", "placeholder": "Write your name", "value": "Submit", "name": "", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#51557E" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" }, "color": { "Desktop": "#ffffff" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "", "position": "afterInput", "class": "" } },
    //         }],




    //     ],
    //     scope: ['block'],
    //     icon: (
    //         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80"><rect fill="#1d4ed8" x="41.67" y="13.33" width="76.67" height="23.34" /><rect fill="#1d4ed8" x="41.67" y="43.33" width="76.67" height="23.34" /></svg>
    //     ),

    // },
    // {
    //     name: 'term-submit-form-1',
    //     title: __('Term Submission Form'),
    //     description: __('Term Submission Form'),
    //     atts: {
    //         wrapper: { "options": { "tag": "div", "class": "" }, "styles": { "gridTemplateColumns": { "Desktop": "1fr " }, "gap": { "Desktop": "1em" }, "display": { "Desktop": "grid" } } }, visible: {}, onSubmit: { "0": { "id": "validation", "messages": [] } }, onProcess: { "0": { "id": "termSubmit", "postType": "", "showOnResponse": true } }, afterSubmit: { "0": { "id": "showMessage", "message": "" } }, blockCssY: { "items": { ".pg9d6a07354523": { "grid-template-columns": { "Desktop": "1fr " }, "gap": { "Desktop": "1em" }, "display": { "Desktop": "grid" } } } },
    //     },
    //     isPro: false,

    //     innerBlocks: [
    //         ['post-grid/form-field-input', {
    //             wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Term Title", "class": "pg-form-field-label" } }, input: { "options": { "type": "text", "placeholder": "", "value": "", "name": "term_title", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "Term title should not empty", "position": "afterInput", "class": "" }, "styles": { "color": { "Desktop": "#c02121" }, "marginTop": { "Desktop": "10px" } } },
    //         }],
    //         ['post-grid/form-field-input', {
    //             wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Term Slug", "class": "pg-form-field-label" } }, input: { "options": { "type": "text", "placeholder": "", "value": "", "name": "term_slug", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "", "position": "afterInput", "class": "" } },
    //         }],
    //         ['post-grid/form-field-input', {
    //             wrapper: { "options": { "tag": "div", "class": "" }, "styles": {} }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" }, "styles": {} }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Term Description", "class": "pg-form-field-label" }, "styles": {} }, input: { "options": { "type": "text", "placeholder": "", "value": "", "name": "term_description", "required": false, "disabled": false, "minLength": null, "maxLength": null, "readonly": false, "cols": null, "rows": 3, "autocomplete": false, "autofocus": false, "wrap": false, "spellcheck": false, "autocorrect": false, "id": "", "class": "", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "Term description should not empty", "position": "afterInput", "class": "" }, "styles": { "color": { "Desktop": "#c02121" }, "marginTop": { "Desktop": "10px" } } },
    //         }],
    //         ['post-grid/form-field-input', {
    //             wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Your Email", "class": "pg-form-field-label" }, "styles": {} }, input: { "options": { "type": "text", "placeholder": "Write your mail address", "value": "", "name": "email", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "Email should not empty", "position": "afterInput", "class": "" }, "styles": { "color": { "Desktop": "#c02121" }, "marginTop": { "Desktop": "10px" } } },
    //         }],
    //         ['post-grid/form-field-input', {
    //             wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, label: { "options": { "tag": "label", "for": "label", "enable": false, "text": "Your Name", "class": "pg-form-field-label" } }, input: { "options": { "type": "submit", "placeholder": "Write your name", "value": "Submit", "name": "", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#51557E" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" }, "color": { "Desktop": "#ffffff" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "", "position": "afterInput", "class": "" } },
    //         }],





    //     ],
    //     scope: ['block'],
    //     icon: (
    //         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80"><rect fill="#1d4ed8" x="41.67" y="13.33" width="76.67" height="23.34" /><rect fill="#1d4ed8" x="41.67" y="43.33" width="76.67" height="23.34" /></svg>
    //     ),

    // },

    // {
    //     name: 'post-submission-form',
    //     title: __('Post Submission Form'),
    //     description: __('Post Submission Form'),

    //     isPro: false,
    //     atts: {
    //         wrapper: { "options": { "tag": "div", "class": "" }, "styles": { "gridTemplateColumns": { "Desktop": "1fr " }, "gap": { "Desktop": "1em" }, "display": { "Desktop": "grid" } } }, visible: {}, onSubmit: { "0": { "id": "validation", "messages": [] } }, onProcess: { "0": { "id": "postSubmit", "postType": "", "showOnResponse": true } }, afterSubmit: { "0": { "id": "showMessage", "message": "" } }, blockCssY: { "items": { ".pg9d6a07354523": { "grid-template-columns": { "Desktop": "1fr " }, "gap": { "Desktop": "1em" }, "display": { "Desktop": "grid" } } } },

    //     },

    //     innerBlocks: [
    //         ['post-grid/form-field-input', {
    //             wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Post Title", "class": "pg-form-field-label" } }, input: { "options": { "type": "text", "placeholder": "", "value": "", "name": "post_title", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "Post title should not empty", "position": "afterInput", "class": "" }, "styles": { "color": { "Desktop": "#c02121" }, "marginTop": { "Desktop": "10px" } } },
    //         }],
    //         ['post-grid/form-field-input', {
    //             wrapper: { "options": { "tag": "div", "class": "" }, "styles": {} }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" }, "styles": {} }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Post Content", "class": "pg-form-field-label" }, "styles": {} }, input: { "options": { "type": "text", "placeholder": "", "value": "", "name": "post_content", "required": false, "disabled": false, "minLength": null, "maxLength": null, "readonly": false, "cols": null, "rows": 3, "autocomplete": false, "autofocus": false, "wrap": false, "spellcheck": false, "autocorrect": false, "id": "", "class": "", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "Post content should not empty", "position": "afterInput", "class": "" }, "styles": { "color": { "Desktop": "#c02121" }, "marginTop": { "Desktop": "10px" } } },
    //         }],
    //         ['post-grid/form-field-input', {
    //             wrapper: { "options": { "tag": "div", "class": "" }, "styles": {} }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Post Category", "class": "pg-form-field-label" }, "styles": {} }, input: { "options": { "value": null, "name": "post_categories", "required": false, "disabled": false, "multiple": false, "autofocus": null, "readonly": false, "args": { "0": { "label": "Category 1", "value": "category1", "readonly": false }, "1": { "label": "Category 2", "value": "category2", "readonly": false }, "2": { "label": "Category 3", "value": "category3", "readonly": false } }, "argsSrc": { "src": "taxonomy" }, "id": "", "class": "pg-form-field-checkbox", "postion": "afterLabel" }, "styles": {} }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" }, "styles": {} }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "", "position": "afterInput", "class": "" }, "styles": {} },
    //         }],
    //         ['post-grid/form-field-input', {
    //             wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Post Tags", "class": "pg-form-field-label" } }, input: { "options": { "type": "text", "placeholder": "comma separate, ex: Tag 1, Tag 2", "value": "", "name": "post_tags", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "", "position": "afterInput", "class": "" } },
    //         }],
    //         ['post-grid/form-field-input', {
    //             wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Your Email", "class": "pg-form-field-label" }, "styles": {} }, input: { "options": { "type": "text", "placeholder": "Write your mail address", "value": "", "name": "email", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "Email should not empty", "position": "afterInput", "class": "" }, "styles": { "color": { "Desktop": "#c02121" }, "marginTop": { "Desktop": "10px" } } },
    //         }],
    //         ['post-grid/form-field-input', {
    //             wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, label: { "options": { "tag": "label", "for": "label", "enable": false, "text": "Your Name", "class": "pg-form-field-label" } }, input: { "options": { "type": "submit", "placeholder": "Write your name", "value": "Submit", "name": "", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#51557E" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" }, "color": { "Desktop": "#ffffff" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "", "position": "afterInput", "class": "" } },
    //         }],


    //     ],
    //     scope: ['block'],
    //     icon: (
    //         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80"><rect fill="#1d4ed8" x="41.67" y="13.33" width="76.67" height="23.34" /><rect fill="#1d4ed8" x="41.67" y="43.33" width="76.67" height="23.34" /></svg>
    //     ),

    // },


    // {
    //     name: 'reviews-form-1',
    //     title: __('Request for Quote'),
    //     description: __('Request for Quote'),

    //     isPro: false,

    //     innerBlocks: [
    //         ['post-grid/form-field-input', {}],
    //         ['post-grid/form-field-input', {}],

    //     ],
    //     scope: ['block'],
    //     icon: (
    //         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80"><rect fill="#1d4ed8" x="41.67" y="13.33" width="76.67" height="23.34" /><rect fill="#1d4ed8" x="41.67" y="43.33" width="76.67" height="23.34" /></svg>
    //     ),

    // },



    // {
    //     name: 'form-10',
    //     title: __('Job Application Form'),
    //     description: __('Job Application Form'),

    //     isPro: false,

    //     innerBlocks: [
    //         ['post-grid/form-field-input', {}],
    //         ['post-grid/form-field-input', {}],

    //     ],
    //     scope: ['block'],
    //     icon: (
    //         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80"><rect fill="#1d4ed8" x="41.67" y="13.33" width="76.67" height="23.34" /><rect fill="#1d4ed8" x="41.67" y="43.33" width="76.67" height="23.34" /></svg>
    //     ),

    // },


    // {
    //     name: 'form-11',
    //     title: __('Newsletter form'),
    //     description: __('Newsletter form'),

    //     isPro: false,
    //     atts: {
    //         wrapper: { "options": { "tag": "div", "class": "" }, "styles": { "gridTemplateColumns": { "Desktop": "1fr " }, "gap": { "Desktop": "1em" }, "display": { "Desktop": "grid" } } }, visible: {}, onSubmit: { "0": { "id": "validation", "messages": [] } }, onProcess: { "2": { "id": "newsletterSubmit", "message": "", "showOnResponse": true } }, afterSubmit: { "0": { "id": "showMessage", "message": "" } }, blockCssY: { "items": { ".pg9d6a07354523": { "grid-template-columns": { "Desktop": "1fr " }, "gap": { "Desktop": "1em" }, "display": { "Desktop": "grid" } } } },
    //     },

    //     innerBlocks: [
    //         ['post-grid/form-field-input', {
    //             wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Your Email", "class": "pg-form-field-label" }, "styles": {} }, input: { "options": { "type": "text", "placeholder": "Write your mail address", "value": "", "name": "email", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "Email should not empty", "position": "afterInput", "class": "" }, "styles": { "color": { "Desktop": "#c02121" }, "marginTop": { "Desktop": "10px" } } },
    //         }],
    //         ['post-grid/form-field-input', {
    //             wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, label: { "options": { "tag": "label", "for": "label", "enable": true, "text": "Your Name", "class": "pg-form-field-label" } }, input: { "options": { "type": "text", "placeholder": "", "value": "", "name": "post_title", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#ececec" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "Name should not empty", "position": "afterInput", "class": "" }, "styles": { "color": { "Desktop": "#c02121" }, "marginTop": { "Desktop": "10px" } } },
    //         }],
    //         ['post-grid/form-field-input', {
    //             wrapper: { "options": { "tag": "div", "class": "" } }, labelWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, label: { "options": { "tag": "label", "for": "label", "enable": false, "text": "Your Name", "class": "pg-form-field-label" } }, input: { "options": { "type": "submit", "placeholder": "Write your name", "value": "Submit", "name": "", "required": false, "disabled": false, "size": false, "minLength": null, "maxLength": null, "readonly": false, "step": null, "pattern": null, "patternCustom": "", "max": null, "min": null, "checked": false, "autocomplete": false, "id": "", "class": "pg-form-field-input", "postion": "afterLabel" }, "styles": { "border": { "Desktop": "1px solid #b5b5b5" }, "borderRadius": { "Desktop": "0px 0px 0px 0px" }, "padding": { "Desktop": "5px 10px 5px 10px" }, "backgroundColor": { "Desktop": "#51557E" }, "width": { "Desktop": "100%" }, "maxWidth": { "Desktop": "100%" }, "color": { "Desktop": "#ffffff" } } }, inputWrap: { "options": { "tag": "div", "enable": true, "class": "" } }, errorWrap: { "options": { "tag": "div", "enable": true, "text": "", "position": "afterInput", "class": "" } },
    //         }],


    //     ],
    //     scope: ['block'],
    //     icon: (
    //         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80"><rect fill="#1d4ed8" x="41.67" y="13.33" width="76.67" height="23.34" /><rect fill="#1d4ed8" x="41.67" y="43.33" width="76.67" height="23.34" /></svg>
    //     ),

    // },







];

export default variations;