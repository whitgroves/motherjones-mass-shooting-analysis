/*! Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version 2.1.3-pre
 */

(function($){

$.fn.bgiframe = ($.browser.msie && /msie 6\.0/i.test(navigator.userAgent) ? function(s) {
    s = $.extend({
        top     : 'auto', // auto == .currentStyle.borderTopWidth
        left    : 'auto', // auto == .currentStyle.borderLeftWidth
        width   : 'auto', // auto == offsetWidth
        height  : 'auto', // auto == offsetHeight
        opacity : true,
        src     : 'javascript:false;'
    }, s);
    var html = '<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+
                   'style="display:block;position:absolute;z-index:-1;'+
                       (s.opacity !== false?'filter:Alpha(Opacity=\'0\');':'')+
                       'top:'+(s.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':prop(s.top))+';'+
                       'left:'+(s.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':prop(s.left))+';'+
                       'width:'+(s.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':prop(s.width))+';'+
                       'height:'+(s.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':prop(s.height))+';'+
                '"/>';
    return this.each(function() {
        if ( $(this).children('iframe.bgiframe').length === 0 )
            this.insertBefore( document.createElement(html), this.firstChild );
    });
} : function() { return this; });

// old alias
$.fn.bgIframe = $.fn.bgiframe;

function prop(n) {
    return n && n.constructor === Number ? n + 'px' : n;
}

})(jQuery);
/**
 * <: jquery.json.1.0.rc0 :>
 * 
 * Copyright (c) 2008-2009 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 * jQuery.json  
 *
 */
(function($){

    
	/**
	 * @param {Object} js 
	 * @param {Object} filter
	 * @param {Object} indentValue
	 */ 
	$.json = $.js2json = function(js, filter, indentValue){
	    return __JSON__.stringify(js, filter, indentValue||'');
	};
    
    /**
     * @param {Object} filter
     * @param {Object} indentValue
     */
    $.fn.json = $.fn.js2json = function( filter, indentValue){
        var i, str='[';
        for(i=0;i<this.length;i++){
            str += __JSON__.stringify(this[i], filter, indentValue||'');
            if(!(i+1 == this.length)){
                str+=',\n'
            }
        }
	    return str + ']';
	};
    
	/**
	 * @param {Object} json
	 * @param {Object} filter
	 */
	$.eval = $.json2js = function(json, filter){
	    return JSON.parse(json, filter);
	};
    
    /** 
     * @param {Object} filter
     */
    $.fn.eval = $.fn.json2js = function(filter){
        var i,js = [];
	    for(i=0;i<this.length;i++){
            js[i] = JSON.parse(this[i], filter);
        }
        return js;
	};
	
    /**
     * @param {Object} js
     * @param {Object} filter
     */
	$.strip = $.stripjs = function(js, filter){
	    return $.eval($.js2json(js, filter, ''));
	};
    
    /**
     * @param {Object} filter
     */
    $.fn.strip = $.fn.stripjs = function(filter){
	    return $.eval(this.js2json(filter, ''));
	};
	
	
    /**
     * __json__ is used internally to store the selected
     * json parsing methodolgy
     * 
     * This method of optimization is from 
     * 
     * http://weblogs.asp.net/yuanjian/archive/2009/03/22/json-performance-comparison-of-eval-new-function-and-json.aspx
     */
	var __json__ = null;
	if ( typeof JSON !== "undefined" ) {
		__json__ = JSON;
	}
	var JSON = {
	    parse: function( text , safe) {
           if(__json__ !== null || safe){
    	       return ( __json__ !== null) ?
    	           __json__.parse( text ) :
        	       __JSON__.parse(text);
           }
           if ( browser.gecko ) {
                return new Function( "return " + text )();
           }
            return eval( "(" + text + ")" );
	    }
	};  
    
           
	/*
	    http://www.JSON.org/json2.js
	    2008-07-15
	
	    Public Domain.
	
	    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	
	    See http://www.JSON.org/js.html
	
	   
	    This code should be minified before deployment.
	    See http://javascript.crockford.com/jsmin.html
	
	    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
	    NOT CONTROL.
	*/
    var __JSON__ = function () {

        function f(n) {
            // Format integers to have at least two digits.
            return n < 10 ? '0' + n : n;
        }

        Date.prototype.toJSON = function (key) {

            return this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z';
        };

        String.prototype.toJSON = function (key) {
            return String(this);
        };
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };

        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapeable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap,
            indent,
            meta = {    // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"' : '\\"',
                '\\': '\\\\'
            },
            rep;


        function quote(string) {
        	
            escapeable.lastIndex = 0;
            return escapeable.test(string) ?
                '"' + string.replace(escapeable, function (a) {
                    var c = meta[a];
                    if (typeof c === 'string') {
                        return c;
                    }
                    return '\\u' + ('0000' +
                            (+(a.charCodeAt(0))).toString(16)).slice(-4);
                }) + '"' :
                '"' + string + '"';
        }


        function str(key, holder) {

            var i,          // The loop counter.
                k,          // The member key.
                v,          // The member value.
                length,
                mind = gap,
                partial,
                value = holder[key];

            if (value && typeof value === 'object' &&
                    typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }
            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }

            switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':
                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

                return String(value);
            
            case 'xml':

                return '"'+value.toXMLString().
                            replace('\n', '\\\n', 'g').
                            replace('"','\\"','g')+'"';    
            case 'object':

                if (!value) {
                    return 'null';
                }
                gap += indent;
                partial = [];

                if (typeof value.length === 'number' &&
                        !(value.propertyIsEnumerable('length'))) {

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }
                    
                    v = partial.length === 0 ? '[]' :
                        gap ? '[\n' + gap +
                                partial.join(',\n' + gap) + '\n' +
                                    mind + ']' :
                              '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                v = partial.length === 0 ? '{}' :
                    gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                            mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
            }
        }

        return {
            stringify: function (value, replacer, space) {

                var i;
                gap = '';
                indent = '';

                if (typeof space === 'number') {
                    for (i = 0; i < space; i += 1) {
                        indent += ' ';
                    }

                } else if (typeof space === 'string') {
                    indent = space;
                }

                rep = replacer;
                if (replacer && typeof replacer !== 'function' &&
                        (typeof replacer !== 'object' ||
                         typeof replacer.length !== 'number')) {
                    throw new Error('JSON.stringify');
                }

                return str('', {'': value});
            },


            parse: function (text, reviver) {
                var j;

                function walk(holder, key) {
                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }

                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx, function (a) {
                        return '\\u' + ('0000' +
                                (+(a.charCodeAt(0))).toString(16)).slice(-4);
                    });
                }

                if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
	
                    j = eval('(' + text + ')');

                    return typeof reviver === 'function' ?
                        walk({'': j}, '') : j;
                }

                throw new SyntaxError('JSON.parse');
            }
        };
    }();

    /**
	 * from yui we determine the browser
	 */
	//yui
	var Browser = function() {
	   var o = {
	       ie: 0,
	       opera: 0,
	       gecko: 0,
	       webkit: 0
	   };
	   var ua = navigator.userAgent, m;
	   if ( ( /KHTML/ ).test( ua ) ) {
	       o.webkit = 1;
	   }
	   // Modern WebKit browsers are at least X-Grade
	   m = ua.match(/AppleWebKit\/([^\s]*)/);
	   if (m&&m[1]) {
	       o.webkit=parseFloat(m[1]);
	   }
	   if (!o.webkit) { // not webkit
	       // @todo check Opera/8.01 (J2ME/MIDP; Opera Mini/2.0.4509/1316; fi; U; ssr)
	       m=ua.match(/Opera[\s\/]([^\s]*)/);
	       if (m&&m[1]) {
	           o.opera=parseFloat(m[1]);
	       } else { // not opera or webkit
	           m=ua.match(/MSIE\s([^;]*)/);
	           if (m&&m[1]) {
	               o.ie=parseFloat(m[1]);
	           } else { // not opera, webkit, or ie
	               m=ua.match(/Gecko\/([^\s]*)/);
	               if (m) {
	                   o.gecko=1; // Gecko detected, look for revision
	                   m=ua.match(/rv:([^\s\)]*)/);
	                   if (m&&m[1]) {
	                       o.gecko=parseFloat(m[1]);
	                   }
	               }
	           }
	       }
	   }
	   return o;
	};
	var browser = Browser();

})(jQuery);/**
 * jquery.objtree.1.0.rc0 
 * 
 * Copyright (c) 2008-2009 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 * jQuery.jsPath ObjTree 
 * 
 * 	Based on ObjTree.js from 
 *	Yusuke Kawasaki http://www.kawa.net/ 
 *
 *	NOTE: This plugin is primarily designed for javascript to xml.
 *        
 *        For client-side xml to javascript utilities see 
 *            - ( http://github.com/thatcher/jquery-xslt ) -
 *        for xml to js plugins that are MUCH faster
 *        
 *        For server-side xml to javascript utilities see 
 *            - ( http://github.com/thatcher/jquery-e4x ) -
 *        for xml to js plugins that are MUCH faster
 */

(function($){
    $.objtree = function(opts){
        ObjTree.prototype.xmlDecl = opts.xmlDecl||ObjTree.prototype.xmlDecl;
        ObjTree.prototype.attr_prefix = opts.attr_prefix||ObjTree.prototype.attr_prefix;
        ObjTree.prototype.ns_colon = opts.ns_colon||ObjTree.prototype.ns_colon;
        ObjTree.prototype.mixed_content_name = opts.ns_colon||ObjTree.prototype.mixed_content_name;
    };
    
    $.xml2js = function(xml, opts){
        var objtree = $.extend(new ObjTree(), opts||{});
        var obj = objtree.parseXML(xml);
    };
    
    $.dom2js = function(dom, opts){
        var objtree = $.extend(new ObjTree(), opts||{});
        return objtree.parseDOM(dom);
    };
    
    $.x = $.js2xml =  function(js, opts){
        var objtree = $.extend(new ObjTree(), opts||{});
        return objtree.writeXML(js);
    };
    
    $.fn.x = function(i){
        var xml = '';
        if(i && this[i]){
            xml = $.js2xml(this[i]);
        }else{
            for (i = 0; i < this.length; i++) {
                xml += $.js2xml(this[i]);
            }
        }
        return xml;
    };
    
    $.escape = function(xml){
        return ObjTree.prototype.xml_escape(xml);  
    };
    
    $.e3x = function(xml, model){
        var t = $(xml).clone();
        $('.e3x', t).each(function(){
            var result,
                e3x = $(this).text().replace('{','{__$__:');
            with(model||{}){
                eval('result = '+e3x);
            }
            $(this).html($.x(result.__$__));
        });
        return t;
    };
    // ========================================================================
    //  ObjTree -- XML source code from/to JavaScript object like E4X
    // ========================================================================
    // A thin jQuery-jsPath wrapper for Yusuke Kawasaki's ObjTree.
    
    //  constructor
    
    var  ObjTree = function () {
        return this;
    };
    
    //  class variables
    
    ObjTree.VERSION = "0.24";
    
    //  object prototype
    
    ObjTree.prototype.xmlDecl = '<?xml version="1.0" encoding="UTF-8" ?>\n';
    ObjTree.prototype.attr_prefix = '$';
    ObjTree.prototype.ns_colon = '$';
    ObjTree.prototype.mixed_content_name = '$';
    
    
    //  method: parseXML( xmlsource )
    ObjTree.prototype.parseXML = function ( xml ) {
        var root;
        if ( window.DOMParser ) {
            var xmldom = new DOMParser();
            // DOMParser is always sync-mode
            var dom = xmldom.parseFromString( xml, "application/xml" );
            if ( ! dom ) return;
            root = dom.documentElement;
        } else if ( window.ActiveXObject ) {
            xmldom = new ActiveXObject('Microsoft.XMLDOM');
            xmldom.async = false;
            xmldom.loadXML( xml );
            root = xmldom.documentElement;
        }
        if ( ! root ) return;
        return this.parseDOM( root );
    };
    
    //  method: parseDOM( documentroot )
    
    ObjTree.prototype.parseDOM = function ( root ) {
        if ( ! root ) return;
    
        this.__force_array = {};
        if ( this.force_array ) {
            for( var i=0; i<this.force_array.length; i++ ) {
                this.__force_array[this.force_array[i]] = 1;
            }
        }
    
        var json = this.parseElement( root );   // parse root node
        if ( this.__force_array[root.nodeName] ) {
            json = [ json ];
        }
        if ( root.nodeType != 11 ) {            // DOCUMENT_FRAGMENT_NODE
            var tmp = {};
            tmp[root.nodeName] = json;          // root nodeName
            json = tmp;
        }
        return json;
    };
    
    //  method: parseElement( element )
    
    ObjTree.prototype.parseElement = function ( elem ) {
        //  COMMENT_NODE
        if ( elem.nodeType == 7 ) {
            return;
        }
    
        //  TEXT_NODE CDATA_SECTION_NODE
        if ( elem.nodeType == 3 || elem.nodeType == 4 ) {
            var bool = elem.nodeValue.match( /[^\x00-\x20]/ );
            if ( bool == null ) return;     // ignore white spaces
            return elem.nodeValue;
        }
    
        var retval;
        var cnt = {};
    
        //  parse attributes
        if ( elem.attributes && elem.attributes.length ) {
            retval = {};
            for ( var i=0; i<elem.attributes.length; i++ ) {
                var key = elem.attributes[i].nodeName;
                if ( typeof(key) != "string" ) continue;
                var val = elem.attributes[i].nodeValue;
                if ( ! val ) continue;
                key = this.attr_prefix + key;
                if ( typeof(cnt[key]) == "undefined" ) cnt[key] = 0;
                cnt[key] ++;
                this.addNode( retval, key, cnt[key], val );
            }
        }
    
        //  parse child nodes (recursive)
        if ( elem.childNodes && elem.childNodes.length ) {
            var textonly = true;
            if ( retval ) textonly = false;        // some attributes exists
            for ( var i=0; i<elem.childNodes.length && textonly; i++ ) {
                var ntype = elem.childNodes[i].nodeType;
                if ( ntype == 3 || ntype == 4 ) continue;
                textonly = false;
            }
            if ( textonly ) {
                if ( ! retval ) retval = "";
                for ( var i=0; i<elem.childNodes.length; i++ ) {
                    retval += elem.childNodes[i].nodeValue;
                }
            } else {
                if ( ! retval ) retval = {};
                for ( var i=0; i<elem.childNodes.length; i++ ) {
                    var key = elem.childNodes[i].nodeName;
                    if ( typeof(key) != "string" ) continue;
                    var val = this.parseElement( elem.childNodes[i] );
                    if ( ! val ) continue;
                    if ( typeof(cnt[key]) == "undefined" ) cnt[key] = 0;
                    cnt[key] ++;
                    this.addNode( retval, key, cnt[key], val );
                }
            }
        }
        return retval;
    };
    
    //  method: addNode( hash, key, count, value )
    
    ObjTree.prototype.addNode = function ( hash, key, cnts, val ) {
        key = this.removeColon(key);
        if ( this.__force_array[key] ) {
            if ( cnts == 1 ) hash[key] = [];
            hash[key][hash[key].length] = val;      // push
        } else if ( cnts == 1 ) {                   // 1st sibling
            hash[key] = val;
        } else if ( cnts == 2 ) {                   // 2nd sibling
            hash[key] = [ hash[key], val ];
        } else {                                    // 3rd sibling and more
            hash[key][hash[key].length] = val;
        }
    };
    
    //  method: writeXML( tree )
    
    ObjTree.prototype.writeXML = function ( tree ) {
        var xml="", i;
        if ( typeof(tree) == "undefined" || tree == null ) {
            xml = '';
        } else if ( typeof(tree) == "object" &&  tree.length  ) {
            for(i=0;i<tree.length;i++){
                xml += '\n'+this.writeXML(tree[i]);
            }
        } else if ( typeof(tree) == "object" ) {
            xml = this.hash_to_xml( null, tree );
        } else {
            xml = tree
        } 
        return /*this.xmlDecl +*/ xml;
    };
    
    //  method: replaceColon( tagName, tree )
    ObjTree.prototype.replaceColon = function(name){
        return name ? (name.substring(0,1)+name.substring(1).replace(this.ns_colon,':')): name;
    };
    //  method: replaceColon( tagName, tree )
    ObjTree.prototype.removeColon = function(name){
        return name ? (name.replace(':',this.ns_colon)): name;
    };
    
    //  method: hash_to_xml( tagName, tree )
    ObjTree.prototype.hash_to_xml = function ( name, tree ) {
        var elem = [];
        var attr = [];
        name = this.replaceColon(name);
        for( var key in tree ) {
            if ( ! tree.hasOwnProperty(key) ) continue;
            var val = tree[key];
            if ( key.charAt(0) != this.attr_prefix ) {
                if ( typeof(val) == "undefined" || val == null ) {
                    elem[elem.length] = "<"+key+" />";
                } else if ( typeof(val) == "object" && val.length ) {
                    elem[elem.length] = this.array_to_xml( key, val );
                } else if ( typeof(val) == "object" ) {
                    elem[elem.length] = this.hash_to_xml( key, val );
                } else {
                    elem[elem.length] = this.scalar_to_xml( key, val );
                }
            } else {
                if (key == this.mixed_content_name) {
                    //text node
                    if ( typeof(val) == "undefined" || val == null ) {
                        elem[elem.length] = " ";
                    } else if ( typeof(val) == "object" && val.length ) {
                         elem[elem.length] = this.writeXML(val);
                    } else if ( typeof(val) == "object" ) {
                        elem[elem.length] = this.hash_to_xml( key, val );
                    } else {
                        elem[elem.length] = this.scalar_to_xml( key, val );
                    }
                } else {
                    attr[attr.length] = " " +
                        (this.replaceColon(key).substring(1)) + '="' +
                        (this.xml_escape(val)) + '"';
                }
            }
        }
        var jattr = attr.join("");
        var jelem = elem.join("");
        if ( typeof(name) == "undefined" || name == null ) {
            // no tag
        } else if ( elem.length > 0 ) {
            if ( jelem.match( /\n/ )) {
                jelem = "<"+name+jattr+">\n"+jelem+"</"+name+">\n";
            } else {
                jelem = "<"+name+jattr+">"  +jelem+"</"+name+">\n";
            }
        } else {
            jelem = "<"+name+jattr+" />\n";
        }
        return jelem;
    };

    //  method: array_to_xml( tagName, array )
    
    ObjTree.prototype.array_to_xml = function ( name, array ) {
        var out = [];
        if(!(name == this.mixed_content_name)){
            name = this.replaceColon(name);
        }
        for( var i=0; i<array.length; i++ ) {
            var val = array[i];
            if ( typeof(val) == "undefined" || val == null ) {
                out[out.length] = "<"+name+" />";
            } else if ( typeof(val) == "object" && val.constructor == Array 
                && name!=this.mixed_content_name) {
                out[out.length] = this.array_to_xml( name, val );
            } else if ( typeof(val) == "object" ) {
                out[out.length] = this.hash_to_xml( name, val );
            } else {
                out[out.length] = this.scalar_to_xml( name, val );
            }
        }    
        return out.join("");
    };
    
    //  method: scalar_to_xml( tagName, text )
    
    ObjTree.prototype.scalar_to_xml = function ( name, text ) {
        if ( name == "$" ) {
            return this.xml_escape(text);
        } else {
            name = this.replaceColon(name);
            return "<"+name+">"+this.xml_escape(text)+"</"+name+">\n";
        }
    };
    
    //  method: xml_escape( text )
    
    ObjTree.prototype.xml_escape = function ( text ) {
        return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    };


})(jQuery);/* ===========================================================================
 *
 * JQuery URL Parser
 * Version 1.0
 * Parses URLs and provides easy access to information within them.
 *
 * Author: Mark Perkins
 * Author email: mark@allmarkedup.com
 *
 * For full documentation and more go to http://projects.allmarkedup.com/jquery_url_parser/
 *
 * ---------------------------------------------------------------------------
 *
 * CREDITS:
 *
 * Parser based on the Regex-based URI parser by Stephen Levithian.
 * For more information (including a detailed explaination of the differences
 * between the 'loose' and 'strict' pasing modes) visit http://blog.stevenlevithan.com/archives/parseuri
 *
 * ---------------------------------------------------------------------------
 *
 * LICENCE:
 *
 * Released under a MIT Licence. See licence.txt that should have been supplied with this file,
 * or visit http://projects.allmarkedup.com/jquery_url_parser/licence.txt
 *
 * ---------------------------------------------------------------------------
 * 
 * EXAMPLES OF USE:
 *
 * Get the domain name (host) from the current page URL
 * jQuery.url.attr("host")
 *
 * Get the query string value for 'item' for the current page
 * jQuery.url.param("item") // null if it doesn't exist
 *
 * Get the second segment of the URI of the current page
 * jQuery.url.segment(2) // null if it doesn't exist
 *
 * Get the protocol of a manually passed in URL
 * jQuery.url.setUrl("http://allmarkedup.com/").attr("protocol") // returns 'http'
 *
 */

jQuery.url = function()
{
	var segments = {};
	
	var parsed = {};
	
	/**
    * Options object. Only the URI and strictMode values can be changed via the setters below.
    */
  	var options = {
	
		url : window.location, // default URI is the page in which the script is running
		
		strictMode: false, // 'loose' parsing by default
	
		key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"], // keys available to query 
		
		q: {
			name: "queryKey",
			parser: /(?:^|&)([^&=]*)=?([^&]*)/g
		},
		
		parser: {
			strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/, // more intuitive, fails on relative paths and deviates from specs
			loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ //less intuitive, more accurate to the specs
		}
		
	};
	
    /**
     * Deals with the parsing of the URI according to the regex above.
 	 * Written by Steven Levithan - see credits at top.
     */		
	var parseUri = function()
	{
		str = decodeURI( options.url );
		
		var m = options.parser[ options.strictMode ? "strict" : "loose" ].exec( str );
		var uri = {};
		var i = 14;

		while ( i-- ) {
			uri[ options.key[i] ] = m[i] || "";
		}

		uri[ options.q.name ] = {};
		uri[ options.key[12] ].replace( options.q.parser, function ( $0, $1, $2 ) {
			if ($1) {
				uri[options.q.name][$1] = $2;
			}
		});

		return uri;
	};

    /**
     * Returns the value of the passed in key from the parsed URI.
  	 * 
	 * @param string key The key whose value is required
     */		
	var key = function( key )
	{
		if ( ! parsed.length )
		{
			setUp(); // if the URI has not been parsed yet then do this first...	
		} 
		if ( key == "base" )
		{
			if ( parsed.port !== null && parsed.port !== "" )
			{
				return parsed.protocol+"://"+parsed.host+":"+parsed.port+"/";	
			}
			else
			{
				return parsed.protocol+"://"+parsed.host+"/";
			}
		}
	
		return ( parsed[key] === "" ) ? null : parsed[key];
	};
	
	/**
     * Returns the value of the required query string parameter.
  	 * 
	 * @param string item The parameter whose value is required
     */		
	var param = function( item )
	{
		if ( ! parsed.length )
		{
			setUp(); // if the URI has not been parsed yet then do this first...	
		}
		return ( parsed.queryKey[item] === null ) ? null : parsed.queryKey[item];
	};

    /**
     * 'Constructor' (not really!) function.
     *  Called whenever the URI changes to kick off re-parsing of the URI and splitting it up into segments. 
     */	
	var setUp = function()
	{
		parsed = parseUri();
		
		getSegments();	
	};
	
    /**
     * Splits up the body of the URI into segments (i.e. sections delimited by '/')
     */
	var getSegments = function()
	{
		var p = parsed.path;
		segments = []; // clear out segments array
		segments = parsed.path.length == 1 ? {} : ( p.charAt( p.length - 1 ) == "/" ? p.substring( 1, p.length - 1 ) : path = p.substring( 1 ) ).split("/");
	};
	
	return {
		
	    /**
	     * Sets the parsing mode - either strict or loose. Set to loose by default.
	     *
	     * @param string mode The mode to set the parser to. Anything apart from a value of 'strict' will set it to loose!
	     */
		setMode : function( mode )
		{
			strictMode = mode == "strict" ? true : false;
			return this;
		},
		
		/**
	     * Sets URI to parse if you don't want to to parse the current page's URI.
		 * Calling the function with no value for newUri resets it to the current page's URI.
	     *
	     * @param string newUri The URI to parse.
	     */		
		setUrl : function( newUri )
		{
			options.url = newUri === undefined ? window.location : newUri;
			setUp();
			return this;
		},		
		
		/**
	     * Returns the value of the specified URI segment. Segments are numbered from 1 to the number of segments.
		 * For example the URI http://test.com/about/company/ segment(1) would return 'about'.
		 *
		 * If no integer is passed into the function it returns the number of segments in the URI.
	     *
	     * @param int pos The position of the segment to return. Can be empty.
	     */	
		segment : function( pos )
		{
			if ( ! parsed.length )
			{
				setUp(); // if the URI has not been parsed yet then do this first...	
			} 
			if ( pos === undefined )
			{
				return segments.length;
			}
			return ( segments[pos] === "" || segments[pos] === undefined ) ? null : segments[pos];
		},
		
		attr : key, // provides public access to private 'key' function - see above
		
		param : param // provides public access to private 'param' function - see above
		
	};
	
}();