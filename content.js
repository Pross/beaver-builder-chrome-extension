// content.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {

			bbplugin = window.location.href + '/wp-content/plugins/bb-plugin/changelog.txt'
			bbtheme = window.location.href + '/wp-content/themes/bb-theme/changelog.txt'
			themer = window.location.href + '/wp-content/plugins/bb-theme-builder/changelog.txt'

			var bboutput = false;

			result = GetResult( bbplugin )
			version = ParseResult( result )
			if( version ) {
				bboutput = 'Beaver Builder version ' + version + ' detected!\n'
			}

			result = GetResult( bbtheme )
			version = ParseResult( result )
			if( version ) {
				bboutput += 'Beaver Theme version ' + version + ' detected!\n'
			}

			result = GetResult( themer )
			version = ParseResult( result )
			if( version ) {
				bboutput += 'Beaver Themer version ' + version + ' detected!\n'
			}

			if( bboutput ) {
				alert( bboutput )
			}
    }
  }
);

function ParseResult( data ) {
	if( data.length < 1 ) {
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
     var result = null;
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
