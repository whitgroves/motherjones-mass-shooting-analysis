/*jslint vars: true, regexp: true*/
/*global jQuery, window, setOverviewCookie*/

/**
 * this is the Overview control
 *
 * Overviews are open by default. This ensures the overviews will be displayed
 * if javascript is disabled.
 *
 * This sets a cookie to maintain the open/closed state of the overview. The
 * cookie is checked and handled on the server side in _overviewOpen and
 * _overviewClose partial views
 */

(function ($) {
    'use strict';

    /**
     * if the overview wrapper is visible once the page loads, reset the cookie
     */
    $('.overview_wrapper').ready(function () {
        $('.overview_label a.toggle_button').click(function (event) {
            event.preventDefault();

            var collapsed = false;

            if ($('.overview_wrapper').css('display') === 'none') {
                //the overview is currently hidden, show it
                $('.overview_label').removeClass('off');
                $('.overview_label a.toggle_button').html('Hide Overview <i>icon-hide</i>');

            } else {
                //the overview is currently shown, hide it
                $('.overview_label').addClass('off');
                $('.overview_label a.toggle_button').html('Show Overview <i></i>');

                //set the collapsed value
                collapsed = true;
            }
            //animate
            $('.overview_wrapper.bill').slideToggle();

            previousNextPropagateOverviewState(collapsed);

            setOverviewCookie(window.location.pathname, collapsed);
        });
        //for landing pages
        $('.overview_toggle a').click(function (event) {
            event.preventDefault();

            var collapsed = false;

            if ($('.overview_wrapper').css('display') === 'none') {
                //the overview is currently hidden, show it
                $('.overview_toggle').removeClass('off');
                $('.overview_toggle a').text('Hide Overview');
            } else {
                //the overview is currently shown, hide it
                $('.overview_toggle').addClass('off');
                $('.overview_toggle a').text('Show Overview');

                //set the collapsed value
                collapsed = true;
            }

            //animate
            $('.overview_wrapper').slideToggle();

            setOverviewCookie(window.location.pathname, collapsed);
        });
    });
}(jQuery));
