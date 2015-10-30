var util = Npm.require('util');
var Horseman = Meteor.npmRequire('node-horseman');
var self = YouWatch;
var YouWatch = new _Crawler();
YouWatch.on('processURL',function(doc) {
	processOnce(doc.link);
});
YouWatch.matcher = function(url) {
    return url.toLowerCase().indexOf('youwatch.org') > -1 || url.toLowerCase().indexOf('thand.info') > -1;
}
YouWatch.id = 'youwatch';
Crawler.emit('addProvider', YouWatch);
function processOnce(url) {
	var horseman = Horseman({
		webSecurity: false
	});
	horseman
	.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11) AppleWebKit/601.1.56 (KHTML, like Gecko) Version/9.0 Safari/601.1.56')
	.open(url)
	.evaluate(function() {
		return document.documentElement.getElementsByTagName('iframe')[0].contentDocument.getElementsByTagName('script')[16].innerHTML;
		
	})
	.then(function(html) {
		if(!html){
			processTwice(url);
			return false;
		}
		var fnString = eval(html.replace('eval',''));
		var link = fnString.match('https{0,1}:\\/\\/fs\\d.+(mp4|mov)')[0];
		var filename = link.substring(link.lastIndexOf('/')+1)
		Crawler.emit('addDownload',{
			providerId: YouWatch.id,
			link: link,
			filename: filename
		});
		return true;
	})
	.close();
}

function processTwice(url) {
	var horseman = Horseman({
		webSecurity: false
	});
	horseman
	.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11) AppleWebKit/601.1.56 (KHTML, like Gecko) Version/9.0 Safari/601.1.56')
	.open(url)
	.evaluate(function() {
		document.location =  $('iframe').attr('src')
	})
	.waitForNextPage()
	.waitFor(function(){
		return !!document.documentElement.getElementsByTagName('iframe')[0].contentDocument.getElementsByTagName('script')
	}, true)
	.evaluate(function() {
		return document.documentElement.getElementsByTagName('iframe')[0].contentDocument.getElementsByTagName('script')[16].innerHTML;
		
	})
	.then(function(html) {
		if(!html){
			return false
		}
		var fnString = eval(html.replace('eval',''));
		var link = fnString.match('https{0,1}:\\/\\/fs\\d.+(mp4|mov)')[0];
		var filename = link.substring(link.lastIndexOf('/')+1)
		Crawler.emit('addDownload',{
			providerId: YouWatch.id,
			link: link,
			filename: filename
		});
		return true;
	})
	.close();
}

function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}