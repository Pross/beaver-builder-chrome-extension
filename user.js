// ==UserScript==
// @name            Beaver Detector
// @namespace       http://wpbeaverbuilder.com/
// @description     Context menu to execute UserScript
// @version         0.9.8
// @author          Simon
// @match           *
// @include         *
// @grant           GM_getResourceText
// @grant           GM_addStyle
// @grant           GM_registerMenuCommand
// @require         https://rawcdn.githack.com/robinparisi/tingle/master/dist/tingle.min.js
// @resource        tingleCSS https://rawcdn.githack.com/robinparisi/tingle/master/dist/tingle.min.css
// @updateURL       https://raw.githubusercontent.com/Pross/beaver-builder-chrome-extension/master/user.js
// @downloadURL     https://raw.githubusercontent.com/Pross/beaver-builder-chrome-extension/master/user.js
// @require         https://code.jquery.com/jquery-1.11.0.min.js
// ==/UserScript==]



(function() {
    'use strict';

    GM_registerMenuCommand('Scan Site', function() {
        bb_detect();
    })

    function bb_detect() {
            var url = window.location.href;
    var raw_url_match = url.match( /(https?:\/\/.*?)\// );
    var raw_url = raw_url_match[1]
    var page_content = GetResult( url )
    var urlParts = url.replace('http://','').replace('https://','').split(/[/?#]/);
    var domain = urlParts[0];

    // work out wp-content url
    var match = page_content.match( /src="(.*?\/wp-content\/)/)


    if( match !== null && typeof( match[1] ) != "undefined" ) {
        var wp_content = match[1].replace( /(https?:\/\/.*?)\//, raw_url + '/' )
    } else {
        wp_content = window.location.href + 'wp-content/'
        console.log('reverted to window')
    }

    var bbplugin = wp_content + 'plugins/bb-plugin/changelog.txt'
    var bbtheme = wp_content + 'themes/bb-theme/changelog.txt'
    var themer = wp_content + 'plugins/bb-theme-builder/changelog.txt'
    var free = wp_content + 'plugins/beaver-builder-lite-version/changelog.txt'
    var agency = wp_content + 'plugins/bb-plugin/extensions/fl-builder-white-label/css/fl-builder-white-label-settings.css'
    var pro = wp_content + 'plugins/bb-plugin/extensions/fl-builder-multisite/fl-builder-multisite.php'
    var godaddy = wp_content.replace( 'wp-content', 'wp-includes' ) + 'js/tinymce/plugins/compat3x/plugin.min.js'
    var powerpack = wp_content + 'plugins/bbpowerpack/changelog.txt'
    var uabb = wp_content + 'plugins/bb-ultimate-addon/changelog.txt'
    var bboutput = '<h4>Scan results for ' + domain + '</h4>';
    var result = GetResult( bbplugin )
    var sub = GetSub( agency, pro )
    var tingleCSS = GM_getResourceText ("tingleCSS");
    var version = ParseResult( result )
    var gd_bug = fetchHeader( godaddy, 'Last-Modified' )
    var d = new Date(gd_bug);
    var gd_date = d.getFullYear();
    var generator = '';
    var headers = fetchAllHeaders( url )

    if( version ) {
        bboutput += 'Beaver Builder <strong>' + version + '</strong> ( ' + sub + ' )<br />'
    } else {
        bboutput += 'Beaver Builder not found.<br />'
    }

    result = GetResult( bbtheme )
    version = ParseResult( result )
    if( version ) {
        bboutput += 'Beaver Theme <strong>' + version + '</strong><br />'
    } else {
        bboutput += 'Beaver Theme not found.<br />'
    }

    result = GetResult( themer )
    version = ParseResult( result )

    if( version ) {
        bboutput += 'Beaver Themer <strong>' + version + '</strong><br />'
    } else {
        bboutput += 'Beaver Themer not found.<br />'
    }

    result = GetResult( powerpack )
    version = ParseResultPowerpack( result )

    if( version ) {
        bboutput += 'Power Pack <strong>' + version + '</strong><br />'
    }

    result = GetResult( uabb )
    version = ParseResultUabb( result )

    if( version ) {
        bboutput += 'UABB <strong>' + version + '</strong><br />'
    }


    result = GetResult( free )
    version = ParseResult( result )

    if( version ) {
        bboutput += 'Beaver Lite <strong>' + version + '</strong><br />'
    } else {
        bboutput += 'Beaver Lite not found.<br />'
    }

    $( 'meta[name=generator]' ).each(function( index ) {
        if( $( this ).attr('content').match( /^(WordPress|ClassicPress)/ ) ) {
            generator = $( this ).attr('content')
        }
    });

    if ( generator ) {
        bboutput += '<br />' + generator + '<br />'
    }
    result = page_content
    var cache = result.match(/<\/html>([\s\S]*)/)

    if( typeof( cache[1] ) !== "undefined" && cache[1] !== null && '' !== cache[1] && cache[1].length > 10 ) {
        bboutput += '<br /><strong><em>Possible Cache Plugin Detected</em></strong><br /><pre>' + escapeHtml(cache[1]) + '</pre>'
    }

    if( '2017' == gd_date ) {

        bboutput += '<br /><strong><em>GODADDY BUG DETECTED, Last-Modified: ' + gd_bug + '</em></strong>'
    }

    if( headers ) {
        bboutput += '<br><a href="#" class="reveal-headers">Click to see HTTP Headers</a>'
        bboutput += '<div class="headers-data" style="display:none"><pre>' + headers + '</pre></div>'
    }

    if( bboutput ) {

        var modal = new tingle.modal({
          'footer': true,
          'closeMethods': ['overlay', 'escape']
        });

        url = 'https://www.yougetsignal.com/tools/web-sites-on-web-server/?remoteAddress=' + domain
        var footer = '<a target="_blank" href="' + url + '">List all domains for this server.</a>'
        GM_addStyle (tingleCSS);
        modal.setFooterContent(footer)
        modal.setContent(bboutput);
        modal.open();
        $('.reveal-headers').on('click', function(){
            $('.headers-data').toggle()
        })
        var font = "system-ui, ---apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
        $('.tingle-modal-box').css('font-family', font);
        $('.tingle-modal-box').css('font-size', 'initial');
        $('.tingle-modal-box').css('font-weight', 'initial');
        $('.tingle-modal-box').css('line-height', '1.5');

        $('.tingle-modal-box__content a').css('color', 'blue');
        $('.tingle-modal-box__footer a').css('color', 'blue');
        $('.tingle-modal-box__content h4').css('font-family', font);
    }

    }


})();

function ParseResult( data ) {

    if($.isNumeric(data)) {
        return false;
    }

	if( data.length < 1 ) {
		return false;
	}
	if( ! data ) {
		return false;
	}
	var lines = data.split("\n");
	var line = lines[0]
	var versions = line.match(/<h4>([a-z0-9\.-]+)/)
	if( versions !== null && typeof( versions[1] ) != "undefined" ) {
		return versions[1];
	}
	return false;
}

function ParseResultPowerpack( data ) {

    if($.isNumeric(data)) {
        return false;
    }

	if( data.length < 1 ) {
		return false;
	}
	if( ! data ) {
		return false;
	}
	var lines = data.split("\n");
	var line = lines[0]
	var versions = line.match(/==\s?([a-z0-9\.-]+)/)
	if( versions !== null && typeof( versions[1] ) != "undefined" ) {
		return versions[1];
	}
	return false;
}

function ParseResultUabb( data ) {

    if($.isNumeric(data)) {
        return false;
    }

	if( data.length < 1 ) {
		return false;
	}
	if( ! data ) {
		return false;
	}
	var lines = data.split("\n");
	var line = lines[0]
	var versions = line.match(/Version\s?([0-9\.]+)/)
	if( versions !== null && typeof( versions[1] ) != "undefined" ) {
		return versions[1];
	}
	return false;
}

function GetSub( agency, pro ) {

    agency = GetResult( agency );
    pro = GetResult( pro )

    if( ! $.isNumeric(agency) && agency ) {
    return 'Agency';
    }

    if( 500 === pro ) {
        return 'Pro';
    }

    return 'Standard'
}

function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        var entityMap = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
          '/': '&#x2F;',
          '`': '&#x60;',
          '=': '&#x3D;'
        };
    return entityMap[s];
    });
}

function fetchHeader(url, wch) {
    try {
        var req=new XMLHttpRequest();
        req.open("HEAD", url, false);
        req.send(null);
        if(req.status== 200){
            headers = req.getAllResponseHeaders().toLowerCase();
            return req.getResponseHeader(wch);
        }
        else return false;
    } catch(er) {
        return er.message;
    }
}

function fetchAllHeaders(url) {
    try {
        var req=new XMLHttpRequest();
        req.open("HEAD", url, false);
        req.send(null);
        if(req.status== 200){
            return req.getAllResponseHeaders().toLowerCase();
        }
        else return false;
    } catch(er) {
        return er.message;
    }
}

function GetResult( url ) {
    var result = false;
    $.ajax({
        url: url,
        type: 'get',
        dataType: 'html',
        async: false,
        timeout: 3000,
        success: function(data) {
            result = data;
        },
        complete: function(xhr,status) {
          if( xhr.status === 500 || xhr.status === 404 ) {
              result = xhr.status
          }
        }
    });
    return result;
}
