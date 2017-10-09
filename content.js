// content.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      //var firstHref = $("a[href^='http']").eq(0).attr("href");

			url = window.location.href + '/wp-content/plugins/bb-plugin/changelog.txt'
    //  console.log(url);

		$.get( url, function(data) {

			if( data.length < 1 ) {
				return false;
			}
			var lines = data.split("\n");
			line = lines[0]

			versions = line.match(/<h4>([0-9\.]+)/)

			if(typeof(versions[1]) != "undefined" && versions[1] !== null) {
				alert( 'BB version ' + versions[1] + ' detected!' )
			}


			//$("#dynamicdate").html(data);
		});
      // This line is new!
    //  chrome.runtime.sendMessage({"message": "open_new_tab", "url": url});
    }
  }
);
