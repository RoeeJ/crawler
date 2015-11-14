var util = Npm.require('util');
var Horseman = require('node-horseman');
var Vidzi = new _Doom();
var self = Vidzi;
Vidzi.on('processURL',function(doc) {
	var url = doc.link;
	var horseman = Horseman({
		webSecurity: false
	});
	horseman
	.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11) AppleWebKit/601.1.56 (KHTML, like Gecko) Version/9.0 Safari/601.1.56')
	.open(url)
	.waitForNextPage()
	.html()
	.then(function(html) {
		if(html)
		{
			var sn = html.match(new RegExp('(eval.+\\)\\)\\))'))[0];
			var fnString = eval(sn.replace('eval',''));
	    //return console.log(fnString)
	    var link = fnString.match('file:[^"]*"([^"]+\\.(mp4|mov))"')[1];
			var filename = link.substring(link.lastIndexOf('/')+1);
			Doom.emit('addDownload',{
				providerId: Vidzi.id,
				link: link,
				filename: filename
			});
		} else {
			console.log(html);
		}
	})
	.close();
});
Vidzi.matcher = function(url) {
    return url.toLowerCase().indexOf('vidzi.tv') > -1;
}
Vidzi.id = 'vidzi';
Doom.emit('addProvider', Vidzi);
