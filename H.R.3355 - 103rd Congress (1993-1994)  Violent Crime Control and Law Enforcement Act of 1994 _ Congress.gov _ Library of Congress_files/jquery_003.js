/*jslint browser: true*/
/*global jQuery*/
(function ($) {
    'use strict';
    if (!$.congress) {
        $.congress = {};
    }

    $.congress.searchBar = function (el, options) {
        var base = this;

        base.$el = $(el);
        base.q = {};

        /**
         * searchFormatChange - search format dropdown change handler
         *
         * @return null
         */
        base.searchFormatChange = function () {
            var searchFormat = $('#search-format').val();

            //set the search format placeholder
            if (base.options.hintsByDropDownValue[searchFormat]) {
                $('#search').attr('placeholder', base.options.hintsByDropDownValue[searchFormat]);
            } else {
                $('#search').attr('placeholder', base.options.hintsByDropDownValue.defaultTxt);
            }

            if (base.options.searchWithinOption !== null) {
                if (searchFormat === 'this') {
                    $('#search-within-results').attr('checked', 'checked');
                    $('#search-format').parent().css('border-color', '#98382a');
                } else {
                    $('#search-within-results').attr('checked', false);
                    $('#search-format').parent().css('border-color', '#1e476c');
                }
            }

            base.updateAdvancedSearchLink();

            return false;
        };

        /**
         * searchKeypress - text box keypress handler
         *
         * @return null
         */
        base.searchKeypress = function (event) {
            if (event.which === 13) {
                //the user hit the enter key
                event.preventDefault();
                base.searchClick();
            }
        };

        /**
         * searchClick - search button click handler
         *
         * @return null
         */
        base.searchClick = function () {
            base.searchFormatChange();

            //get the value of the text box
            var searchWithinResults = $('#search-within-results'),
                search = $('#search').val(),
                tmpSearch,
                searchFormat = $('#search-format').val(),
                congress = '',
                source = '',
                q = {},
                baseUrl = '/search';

            if ($('#search-within-results-container').css('display') !== 'none'
                    && searchWithinResults.attr('checked')
                    ) {

                base.q = $.parseJSON($('#search-within-results-inputs input[name="q"]').val());

                if (base.q === null) {
                    base.q = {};
                }

                //searching within results
                if (!(base.q.search instanceof Array)) {
                    tmpSearch = base.q.search;
                    if (tmpSearch !== undefined && tmpSearch !== '') {
                        base.q.search = [tmpSearch];
                    } else {
                        base.q.search = [];
                    }
                }

                if (search !== '' && $.inArray(search, base.q.search)) {
                    base.q.search.push(search);
                }

                if (base.options.searchWithinBaseUrl !== null) {
                    if (base.q.within instanceof Array) {
                        base.q.within.push(search);
                    } else {
                        base.q.within = [search];
                    }

                    baseUrl = base.options.searchWithinBaseUrl;
                }

            } else {
                //new search
                switch (searchFormat) {
                case 'current-legislation':
                    congress = base.options.currentCongress;
                    source = 'legislation';
                    break;
                case 'all-sources':
                    source = 'all';
                    congress = 'all';
                    break;
                default:
                    source = searchFormat;
                    break;
                }

                //include source, congress, and search in the q object
                if (congress !== '') {
                    q.congress = congress;
                }

                if (source !== '') {
                    q.source = source;
                }

                if (search !== '') {
                    q.search = search;
                }

                base.q = q;
            }

            if (base.q.search === '' || $.isEmptyObject(base.q.search)) {
                delete base.q.search;
            }

            //redirect the user
            if (!$.isEmptyObject(base.q)) {
                window.location.href = baseUrl + '?q=' + encodeURIComponent(JSON.stringify(base.q));
            } else {
                window.location.href = baseUrl;
            }
        };

        /**
         * searchWithinChange - search within checkbox change event handler
         *
         * @return null
         */
        base.searchWithinChange = function () {
            if (base.options.searchWithinOption !== null) {
                //the search within option exists
                if ($('#search-within-results').attr('checked') === 'checked') {
                    //search within is checked, the format option should be set to 'this'
                    $('#search-format').val('this');
                    base.searchFormatChange();
                } else if ($('#search-format').val() === 'this') {
                    //the format should be reset
                    $('#search-format').val(base.options.source);
                    base.searchFormatChange();
                }
            }
        };

        /**
         * getSource
         *
         * @return string
         */
        base.getSource = function () {
            var source = '';

            if (base.q.source instanceof Array) {
                if (base.q.source.length === 1) {
                    source = base.q.source[0];
                } else {
                    source = 'all';
                }
            } else if (base.q.source !== undefined) {
                source = base.q.source;
            }

            return source;
        };

        /**
         * getCongress
         *
         * @return string
         */
        base.getCongress = function () {
            var congress = '';

            if (base.q.congress instanceof Array) {
                if (base.q.congress.length === 1) {
                    congress = base.q.congress[0];
                }
            } else if (base.q.congress !== undefined) {
                congress = base.q.congress;
            }

            return congress;
        };

        /**
         * updateAdvancedSearchLink
         *
         * @return null
         */
        base.updateAdvancedSearchLink = function () {
            //update the advanced-search link
            $('li.advanced-search-link a').attr(
                'href',
                '/advanced-search?context=' + encodeURI($('#search-format').val())
            );
        };

        /**
         * init
         *
         * @return null
         */
        base.init = function () {
            base.options = $.extend({}, $.congress.searchBar.defaultOptions, options);

            base.q = $.parseJSON(base.options.q);
            if (!(base.q instanceof Object)) {
                base.q = {};
            }

            var topLevelSearch = window.location.pathname === '/search',
                source = base.getSource(),
                congress = base.getCongress(),
                currentCongress = congress === base.options.currentCongress,
                searchFormat = $('#search-format');

            document.getElementById('search-submit').setAttribute('type', 'button');

            if (base.options.searchWithinEnabled) {
                $('div.search_input').removeClass('noSearchWithin');
                $('#search-within-results-container').css('display', 'block');
            }

            if (topLevelSearch) {
                if (base.q.search instanceof Array) {
                    $('#search-within-results').attr('checked', 'checked');
                }
            } else if (base.options.searchWithinOption !== null) {
                //not the top level search page and the search within option exists
                //append it
                $('#search-format').append(
                    $('<option></option>')
                        .attr('value', 'this')
                        .text(base.options.searchWithinOption)
                        .attr('selected', true)
                );
            }

            if (typeof base.q.search === 'string') {
                $('#search').val(base.q.search);
            } else if (!$.isEmptyObject(base.q.search)) {
                $('#search').val(base.q.search[base.q.search.length - 1]);
            }

            //set the dropdown according to source and congress
            if (source === 'legislation' && currentCongress) {
                searchFormat.val('current-legislation');
            } else if (source === 'all') {
                searchFormat.val('all-sources');
            } else if (source !== '') {
                searchFormat.val(source);
            }

            base.searchFormatChange();
            searchFormat.change(base.searchFormatChange);

            $('#search').keypress(base.searchKeypress);
            $('#search-submit').click(base.searchClick);

            if (!$.isEmptyObject(base.q.within)) {
                $('#search-within-results').attr('checked', 'checked');
            }

            //set the search within change handler
            $('#search-within-results').change(base.searchWithinChange);
        };

        base.init();
    };

    $.congress.searchBar.defaultOptions = {
        source: '',
        hintsByDropDownValue: {
            'defaultTxt': 'Examples: hr5, sres9, "health care"'
        },
        currentCongress: 0,
        q: {},
        searchWithinEnabled: false,
        searchWithinOption: '',
        searchWithinHint: '',
        searchWithinBaseUrl: '/search'
    };

    $.fn.congress_searchBar = function (options) {
        return this.each(function () {
            var ft = new $.congress.searchBar(this, options);
            $(this).data('congress.searchBar', ft);
        });
    };

    $.fn.getcongress_searchBar = function () {
        this.data('congress.searchBar');
    };

}(jQuery));
