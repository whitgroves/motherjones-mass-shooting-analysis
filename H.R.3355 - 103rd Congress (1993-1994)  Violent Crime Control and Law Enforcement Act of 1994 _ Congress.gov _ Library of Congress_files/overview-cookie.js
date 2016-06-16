/*jslint browser: true*/
/*global jQuery, $*/

//FOR IE
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj, start) {
        'use strict';
        var i, j;
        for (i = (start || 0), j = this.length; i < j; i += 1) {
            if (this[i] === obj) { return i; }
        }
        return -1;
    };
}

/**
 * stripPath - ensures that the cookie for bills/amendments/etc. does not
 *  include the selected tab if there is one
 *
 * @param string pathname
 *
 * @return string
 */
function stripOverviewCookiePath(pathname) {
    'use strict';
    var pieces = pathname.split('/'), i;

    for (i = pieces.length - 1; i >= 0; i -= 1) {
        if (i > 4 || !jQuery.isNumeric(pieces[i])) {
            delete pieces[i];
        } else {
            break;
        }
    }

    if (pieces.join('') !== '') {
        pathname = pieces.join('/');
        while (pathname.charAt(pathname.length - 1) === '/') {
            pathname = pathname.substr(0, pathname.length - 1);
        }
    }

    return pathname;
}

/**
 * setOverviewCookie
 *
 * @param url
 * @param collapsed
 *
 * @return null
 */
function setOverviewCookie(url, collapsed) {
    'use strict';
    var cookieKey = 'overview_hidden',
        cookieValue = $.cookie(cookieKey),
        urls = [],
        urlIndex = -1;

    url = stripOverviewCookiePath(url);

    if (cookieValue !== null) {
        urls = $.parseJSON(cookieValue);
    }

    urlIndex = urls.indexOf(url);

    if (urlIndex !== -1) {
        //overview was collapsed
        if (!collapsed) {
            //overview should not be collapsed anymore, remove it
            urls.splice(urlIndex, 1);
        }
    } else {
        //overview was not collapsed
        if (collapsed) {
            //over should be collapsed, add it
            urls.push(url);
        }
    }

    if (urls.length > 0) {
        cookieValue = JSON.stringify(urls);
    } else {
        cookieValue = null;
    }

    $.cookie(cookieKey, cookieValue, {path: '/'});
}

/**
 * previousNextPropagateOverviewState
 *
 * @param boolean closed
 *
 * @return null
 */
function previousNextPropagateOverviewState(closed) {
    var $previous = $('a.pn-previous'),
        $next = $('a.pn-next');

    if (closed) {
        //add overview=closed to the urls
        if ($previous.length !== 0) {
            $previous.attr('href', replaceUrlParam($previous.attr('href'), 'overview', 'closed'));
        }
        if ($next.length !== 0) {
            $next.attr('href', replaceUrlParam($next.attr('href'), 'overview', 'closed'));
        }
    } else {
        //add overview=open to the urls
        if ($previous.length !== 0) {
            $previous.attr('href', replaceUrlParam($previous.attr('href'), 'overview', 'open'));
        }
        if ($next.length !== 0) {
            $next.attr('href', replaceUrlParam($next.attr('href'), 'overview', 'open'));
        }
    }
}

/**
 * replaceUrlParam
 *
 * @param string url
 * @param string name
 * @param string value
 *
 * @return null
 */
function replaceUrlParam(url, name, value) {
    var qs = url.indexOf("?"),
        baseUrl = url.substr(0, qs),
        fr = url.indexOf("#"),
        q = (fr == -1) ? url.substr(qs + 1) : url.substr(qs + 1, fr - qs - 1),
        parts = q.split("&"),
        vars = {},
        p,
        out = new Array(),
        url = baseUrl;

    for (var i = 0; i < parts.length; i++) {
        p = parts[i].split("=");
        if (p[1]) {
            vars[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
        } else {
            vars[decodeURIComponent(p[0])] = "";
        }
    }

    vars[name] = value;

    for (key in vars) {
        out.push(key + '=' + encodeURIComponent(vars[key]));
    }

    if ($.isEmptyObject(vars) === false) {
        url += '?' + out.join('&');
    }

    return url;
}
