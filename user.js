// ==UserScript==
// @name            Beaver Detector
// @namespace       http://wpbeaverbuilder.com/
// @description     Context menu to execute UserScript
// @version         0.5
// @author          Simon
// @include         *
// @grant           GM_getResourceText
// @grant           GM_addStyle
// @run-at          context-menu
// @require         https://rawcdn.githack.com/robinparisi/tingle/master/dist/tingle.min.js
// @resource        tingleCSS https://rawcdn.githack.com/robinparisi/tingle/master/dist/tingle.min.css
// @updateURL       https://raw.githubusercontent.com/Pross/beaver-builder-chrome-extension/master/user.js
// @downloadURL     https://raw.githubusercontent.com/Pross/beaver-builder-chrome-extension/master/user.js
// @require         https://code.jquery.com/jquery-1.11.0.min.js
// ==/UserScript==]

(function() {
    'use strict';

    var url = window.location.href;
    var raw_url = url.split(/[/?#]/)[0];
    var page_content = GetResult( url )
    var urlParts = url.replace('http://','').replace('https://','').split(/[/?#]/);
    var domain = urlParts[0];

    // work out wp-content url
    var match = page_content.match( /src="(.*\/wp-content\/)/)

    if( typeof( match[1] ) != "undefined" ) {
        var wp_content = match[1].replace( /(https?:\/\/.*?)\//, raw_url + '/' )
        console.log('matched')
    } else {
        wp_content = window.location.href + 'wp-content'
        console.log('reverted to window')
    }

    console.log( 'Scanning using wp-content from ' + wp_content )

    var bbplugin = wp_content + 'plugins/bb-plugin/changelog.txt'
    var bbtheme = wp_content + 'themes/bb-theme/changelog.txt'
    var themer = wp_content + 'plugins/bb-theme-builder/changelog.txt'
    var free = wp_content + 'plugins/beaver-builder-lite-version/changelog.txt'
    var agency = wp_content + 'plugins/bb-plugin/extensions/fl-builder-white-label/css/fl-builder-white-label-settings.css'
    var pro = wp_content + 'plugins/bb-plugin/extensions/fl-builder-multisite/fl-builder-multisite.php'
    
    var bboutput = '<h4>Scan results for ' + domain + '</h4>';
    var result = GetResult( bbplugin )
    var sub = GetSub( agency, pro )
    var tingleCSS = GM_getResourceText ("tingleCSS");
    var version = ParseResult( result )



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

    result = GetResult( free )
    version = ParseResult( result )

    if( version ) {
        bboutput += 'Beaver Lite <strong>' + version + '</strong><br />'
    } else {
        bboutput += 'Beaver Lite not found.<br />'
    }

    result = page_content

    var cache = result.match(/<\/html>(.*)$/s)
    if( typeof( cache[1] ) !== "undefined" && cache[1] !== null && '' !== cache[1] && cache[1].length > 10 ) {
        bboutput += '<br /><strong><em>Possible Cache Plugin Detected</em></strong><br /><pre>' + escapeHtml(cache[1]) + '</pre>'
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
