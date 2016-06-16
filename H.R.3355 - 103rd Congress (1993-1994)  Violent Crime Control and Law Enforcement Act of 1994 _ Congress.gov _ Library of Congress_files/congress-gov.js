(function (global, oDOC, handler) {

    var AUTO_CDN_URL = '//cdn.loc.gov';

    var CDN_URL = 		global.CDN_URL||AUTO_CDN_URL;
    var LAB_URL = 		global.LAB_URL||CDN_URL+'/js/LAB-2.0.3.min.js';
    var SHARE_URLS = 	global.SHARE_URLS||{
        JQUERY: 		global.JQUERY||CDN_URL+'/js/lib/jquery-1.7.2.min.js',
        JQUERY_UI: 		global.JQUERY_UI||CDN_URL+'/js/lib/jquery-ui-1.8.10.min.js',
        JQUERY_UI_CSS: 	global.JQUERY_UI_CSS||CDN_URL+'/css/plugins/jquery-ui-themes/base/jquery.ui.all-min.css',
        LIVEQUERY: 		global.LIVEQUERY||CDN_URL+'/js/lib/jquery.livequery-1.1.1.js',
        CLAYPOOL: 		global.CLAYPOOL||CDN_URL+'/js/lib/jquery.claypool-1.2.8-lite.min.js',
        JQUERY_UTILS: 	global.JQUERY_UTILS||CDN_URL+'/js/plugins/jquery.utils-1.0.js',
        SHARE: 			global.SHARE||CDN_URL+'/share/share-1.9.15.min.js',
        SHARE_CSS: 		global.SHARE_CSS||CDN_URL+'/share/share-1.9.15.min.css'
    };
    
    var head = oDOC.head || oDOC.getElementsByTagName("head");

    function LABjsLoaded() {
            $LAB.setGlobalDefaults({
                AllowDuplicates: false,
                AlwaysPreserveOrder: true
            })
            .script(function(){
                if(!global.jQuery){
                    return SHARE_URLS.JQUERY;
                }
            })
            .script(function(){
                if(!global.jQuery || !global.jQuery.ui){
                    loadCSS(SHARE_URLS.JQUERY_UI_CSS);
                    return SHARE_URLS.JQUERY_UI;
                }
            })
            .script(function(){
                if(!global.jQuery || !global.jQuery.livequery){
                    return SHARE_URLS.LIVEQUERY;
                }
            })
            .script(function(){
                if(!global.Claypool){
                    return SHARE_URLS.CLAYPOOL;
                }
            })
            .script(function(){
                if(!global.jQuery || !global.jQuery.json2js) {
                    return SHARE_URLS.JQUERY_UTILS;
                }
            })
            .script(function(){
                if(!global.LOCShare){
                    loadCSS(SHARE_URLS.SHARE_CSS);
                    return SHARE_URLS.SHARE;
                }
            })
            .script(function(){
                if(!global.LOCShare){
                    return SHARE_URLS.SITE;
                }
            }).wait(function(){
                global.jQuery(document).trigger('locshare-boot');
            });
        }
	
    //don't load css in wait callback!! Wont work in IE8
    //and you actually want the css for the widget 
    //to load early
    function loadCSS(url){
	 	var link = document.createElement("link");
		link.setAttribute("rel","stylesheet");
		link.setAttribute("type","text/css");
		link.setAttribute("href",url);
        if ("item" in head) {
            // reassign from live node list ref to pure node ref -- 
            // avoids nasty IE bug where changes to DOM invalidate live 
            // node lists
            head = head[0]; 
        }
		head.appendChild(link);
    }
    
	if (!global.$LAB) {
        // loading code borrowed directly from LABjs itself
        setTimeout(function(){
            if ("item" in head) { // check if ref is still a live node list
                if (!head[0]) { // append_to node not yet ready
                    setTimeout(arguments.callee, 25);
                    return;
                }
                // reassign from live node list ref to pure node ref -- 
                // avoids nasty IE bug where changes to DOM invalidate live 
                // node lists
                head = head[0]; 
            }
            var scriptElem = oDOC.createElement("script"), scriptdone = false;
            scriptElem.onload = scriptElem.onreadystatechange = function(){
                if ((scriptElem.readyState && 
                     scriptElem.readyState !== "complete" && 
                     scriptElem.readyState !== "loaded") || scriptdone) {
                    return false;
                }
                scriptElem.onload = scriptElem.onreadystatechange = null;
                scriptdone = true;
                LABjsLoaded();
            };
            scriptElem.src = LAB_URL;
            head.insertBefore(scriptElem, head.firstChild);
        }, 0);
        
        // required: shim for FF <= 3.5 not having document.readyState
        if (oDOC.readyState == null && oDOC.addEventListener) {
            oDOC.readyState = "loading";
            oDOC.addEventListener("DOMContentLoaded", handler = function(){
                oDOC.removeEventListener("DOMContentLoaded", handler, false);
                oDOC.readyState = "complete";
            }, false);
        }
    } else {
        LABjsLoaded();
    }
	
})(window, document);

Site = { Plugins: {
    share: function($){
        $.env({
            defaults:{ locshare:{
                root:'https://www.loc.gov/share/',
                imageroot:'https://cdn.loc.gov/share/images/',
                app_id:'congress-gov',
                site_name: 'Congress.gov',
                subscribe_url: 'https://www.loc.gov/share/sites/congress-gov/subscribe.php',
                request_type: 'GET',
                request_datatype: 'jsonp',
                survey_url: '/survey?sharetool=true'
            }}
        });

        // Hack to fix the issue short-term with overriding settings for 
        // apps and environments correctly - RG Oct 9, 2011
        try{
            Claypool.Configuration.env.prod.client.locshare.root = "https://www.loc.gov/share/";
            Claypool.Configuration.env.prod.client.locshare.imageroot = "https://cdn.loc.gov/share/images/";
        } catch(e){}
    },

    sc: {
        getAccount: function(){
            var hostname = window.location.hostname;
            if (hostname == 'beta.congress.gov' || hostname == 'www.congress.gov' || hostname == 'congress.gov'){
                return 'loclegislative';
            }else if (hostname == 'test.congress.gov' || hostname == 'dev.congress.gov'){
                return 'loclegislativedev';
            }
            return 'locunfiltered';
        },
        setProperties: function(s){
            // congress.gov has a separate tracking server
            if ("https:" == window.location.protocol) {
                s.trackingServer="smon.congress.gov";
            } else {
                s.trackingServer="cmon.congress.gov";
            }

            s.pageName=document.title
            s.channel="Congress.gov"
            s.server=window.location.hostname;

            s.charSet = "ISO-8859-1";
            s.currencyCode = "USD";
            s.prop1 = window.location.href;
            
            s.prop46 = 'none';
            
            s.linkInternalFilters = "javascript:,beta.congress.gov,test.congress.gov";
            s.linkLeaveQueryString = false;
            s.linkTrackVars = "None";

            /** WDL, PPOC, MetaSearch **/
            if(!s.prop24) s.prop24=s.getQueryParam('pageSize');

            // congress.gov querystring now uses JSON so need to parse here 
            if (JSON){
                var param=JSON.parse(s.getQueryParam('q')||"null")||{};
            } else {
                var param=$.parseJSON(s.getQueryParam('q'))||{};
            }
            s.prop2=param.search||"";
            if(!s.prop21) s.prop21=param['action-by'] || ""; 
            if(!s.prop22) s.prop22=param.sponsor || ""; 
            if(!s.prop23) s.prop23=param.cosponsor || "";
            if(!s.prop25) s.prop25=param.congress || "";
            if(!s.prop26) s.prop26=param.source || "";
            if(!s.prop27) s.prop27=param.chamber || "";
            if(!s.prop28) s.prop28=param.type || "";
            if(!s.prop29) s.prop29=param.party || "";
            if(!s.prop30) s.prop30=param.subject || "";
            if(!s.prop31) s.prop31=param['bill-status'] || "";
            if(!s.prop32) s.prop32=param['house-sponsor'] || "";
            if(!s.prop33) s.prop33=param['senate-sponsor'] || "";
            if(!s.prop34) s.prop34=param['house-cosponsor'] || "";
            if(!s.prop35) s.prop35=param['senate-cosponsor'] || "";
            if(!s.prop37) s.prop37=param['house-committee'] || "";
            if(!s.prop38) s.prop38=param['senate-committee'] || "";
            if(!s.prop39) s.prop39=param['member-state'] || "";
            if(!s.prop40) s.prop40=param['cosponsor-state'] || "";
            if(!s.prop41) s.prop41=param.status; 
            if(!s.prop51) s.prop51=param['conference-report'] || "";
            if(!s.prop52) s.prop52=param['report-type'] || "";
            if(!s.prop53) s.prop53=param.committee || "";
            if(!s.prop54) s.prop54=param.sponsorship || "";
            // This holds the entire adv. search json string 
            if(!s.prop55) s.prop55=s.getQueryParam('raw');

            if (this.isThisACongressBill(window.location.href)){
                s.prop50=this.stripOffTabInfo(window.location.href);
            }
            if(!s.prop65) s.prop65=s.getQueryParam('pageSort');
            if (this.isAdvancedSearch(window.location.href)){
                s.prop66="advanced";
            } else if (this.isSearch(window.location.href)){
                s.prop66="global";
            }
        },
        isThisACongressBill: function (url){
            var patt = /.+\.congress\.gov\/[a-z]+\/.+\/.+\/\d+[^\d]?/;
            return patt.exec(url);
        },
        isAdvancedSearch: function (url){
            var patt = /.+\.congress\.gov\/advanced-search/;
            return patt.test(url);
        },
        isSearch: function (url){
        var patt = /.+\.congress\.gov\/search/;
            return patt.test(url);
        },
        stripOffTabInfo: function(url){
            var patt = /.+\/\d+.*\/.+\/\d+/;
            var match = patt.exec(url);
            if (match && match.length > 0){
                url = url.substring(0, match[0].length);
            }
            return url;
        }
    }
} };
