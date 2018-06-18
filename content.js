// content.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {

			bbplugin = window.location.href + '/wp-content/plugins/bb-plugin/changelog.txt'
			bbtheme = window.location.href + '/wp-content/themes/bb-theme/changelog.txt'
			themer = window.location.href + '/wp-content/plugins/bb-theme-builder/changelog.txt'
      free = window.location.href + '/wp-content/plugins/beaver-builder-lite-version/changelog.txt'
      
      url = window.location.href;
      urlParts = url.replace('http://','').replace('https://','').split(/[/?#]/);
      domain = urlParts[0];

			var bboutput = false;

			result = GetResult( bbplugin )
			version = ParseResult( result )
			if( version ) {
				bboutput = 'Beaver Builder version <strong>' + version + '</strong><br />'
			} else {
				bboutput = 'Beaver Builder not found.<br />'
			}

			result = GetResult( bbtheme )
			version = ParseResult( result )
			if( version ) {
				bboutput += 'Beaver Theme version <strong>' + version + '</strong><br />'
			} else {
				bboutput += 'Beaver Theme not found.<br />'
			}

			result = GetResult( themer )
			version = ParseResult( result )
			if( version ) {
				bboutput += 'Beaver Themer version <strong>' + version + '</strong><br />'
			} else {
				bboutput += 'Beaver Themer not found.<br />'
			}
      
      result = GetResult( free )
			version = ParseResult( result )
			if( version ) {
				bboutput += 'Beaver Lite version <strong>' + version + '</strong><br />'
			} else {
				bboutput += 'Beaver Lite not found.<br />'
			}
      
      lookup = 'https://api.hackertarget.com/reverseiplookup/?q=' + domain
      domains = GetResult(lookup)
      if( domains.length > 0 ) {
        count = domains.split(/\r\n|\r|\n/).length - 1
        bboutput += '<strong>' + count + '</strong> sites detected on this server.<br />'
        url = 'https://www.yougetsignal.com/tools/web-sites-on-web-server/?remoteAddress=' + domain
        bboutput += '<a target="_blank" href="' + url + '">List all domains.</a>'
      }

			if( bboutput ) {
        var myModal = new Modal({
          title: 'Test Results for ' + domain,
          content: bboutput
        }).show();
			}
    }
  }
);

function ParseResult( data ) {

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

function GetResult( url ) {
     var result = false;
     $.ajax({
        url: url,
        type: 'get',
        dataType: 'html',
        async: false,
        success: function(data) {
            result = data;
        }
     });
     return result;
}
