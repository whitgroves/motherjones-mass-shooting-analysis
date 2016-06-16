/*jslint indent: 4, plusplus: false, browser: true, devel: true */
/*global jQuery: true */

(function ($) {
    'use strict';
    if (!$.congress) {
        $.congress = {};
    }

    $.congress.dropDownNavigation = function (el, options) {

        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        base.handleSelectorChange = function (e) {
            e.preventDefault();
            base.navigate();
        };

        base.navigate = function () {
            if (base.options.onNavigate) {
                base.options.onNavigate();
            } else {
                //disable the submit button on the form
                base.$el.find('input[type="submit"]').attr('disabled', 'disabled');
                base.$el.find('button[type="submit"]').attr('disabled', 'disabled');

                window.location.href = base.options.stubUrl +
                                       base.options.stubName +
                                       base.options.dropDownDelimiter +
                                       base.$el.find('select').val() +
                                       base.options.suffix;
            }
        };

        base.init = function () {
            base.options = $.extend({}, $.congress.dropDownNavigation.defaultOptions, options);
            base.$el.find('select').on('change', base.handleSelectorChange);

            $('#main').on('change', 'select', function () {
                window.location.href = base.options.stubUrl +
                                       base.options.stubName +
                                       base.options.dropDownDelimiter +
                                       $(this).val() +
                                       base.options.suffix;
            });
        };

        // Run initializer
        base.init();
    };

    $.congress.dropDownNavigation.defaultOptions = {
        //option a:
        stubUrl: '',
        stubName: '',
        dropDownDelimiter: '/',
        suffix: '',
        //end option a
        //option b:
        onNavigate: false,
        selectedValue: false
        //end option b
    };

    $.fn.congress_dropDownNavigation = function (options) {
        return this.each(function () {
            var ft = new $.congress.dropDownNavigation(this, options);
           //Add a reverse reference to the DOM object
            $(this).data("congress.dropDownNavigation", ft);
        });
    };

    // This function breaks the chain, but returns
    // the congress.dropDownNavigation if it has been attached to the object.
    $.fn.getcongress_dropDownNavigation = function () {
        return this.data("congress.dropDownNavigation");
    };

}(jQuery));
