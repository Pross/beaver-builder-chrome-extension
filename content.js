// content.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {

			bbplugin = window.location.href + 'wp-content/plugins/bb-plugin/changelog.txt'
      bbtheme = window.location.href + 'wp-content/themes/bb-theme/changelog.txt'
      themer = window.location.href + 'wp-content/plugins/bb-theme-builder/changelog.txt'
      free = window.location.href + 'wp-content/plugins/beaver-builder-lite-version/changelog.txt'
      
      agency = window.location.href + 'wp-content/plugins/bb-plugin/extensions/fl-builder-white-label/css/fl-builder-white-label-settings.css'
      pro = window.location.href + 'wp-content/plugins/bb-plugin/extensions/fl-builder-multisite/fl-builder-multisite.php'
      
      url = window.location.href;
      urlParts = url.replace('http://','').replace('https://','').split(/[/?#]/);
      domain = urlParts[0];

			var bboutput = '<h4>Scan results for ' + domain + '</h4>';

			result = GetResult( bbplugin )
      
      sub = GetSub( agency, pro )
      
			version = ParseResult( result )
	
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
      
      result = GetResult( url )
      
      cache = result.match(/<\/html>(.*)$/s)
      if( typeof( cache[1] ) !== "undefined" && cache[1] !== null ) {
    		bboutput += '<br /><strong><em>Possible Cache Plugin Detected</em></strong><br /><pre>' + escapeHtml(cache[1]) + '</pre>'
    	}
      
      
      

			if( bboutput ) {

        var modal = new tingle.modal({
          'footer': true,
          'closeMethods': ['overlay', 'escape']
        });

        url = 'https://www.yougetsignal.com/tools/web-sites-on-web-server/?remoteAddress=' + domain
        footer = '<a target="_blank" href="' + url + '">List all domains for this server.</a>'
        modal.setFooterContent(footer)
        modal.setContent(bboutput);
        modal.open();
			}
    }
  }
);

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
	line = lines[0]
	versions = line.match(/<h4>([a-z0-9\.-]+)/)
	if( typeof( versions[1] ) != "undefined" && versions[1] !== null ) {
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
