var util = Npm.require('util');
var Horseman = Meteor.npmRequire('node-horseman');
var NitroBit = new _Crawler();
var self = NitroBit;
NitroBit.on('processURL',function(doc) {
	var url = doc.link;
  var fileid = url.substring(url.lastIndexOf('/')+1);
  //http://www.nitrobit.net/watch/aq7nt22Q4
	var horseman = Horseman({
		webSecurity: false
	});
  //http://www.nitrobit.net/ajax/unlock.php?password=$password&file=$fileid&keep=true
	horseman
	.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11) AppleWebKit/601.1.56 (KHTML, like Gecko) Version/9.0 Safari/601.1.56')
	.open('http://www.nitrobit.net/ajax/unlock.php?password='+Config.NITRO_PASSWORD+'&file='+fileid+'&keep=false')
	.evaluate(function(){
    return $('a#download[href]').attr('href');
  })
	.then(function(link) {
    Crawler.emit('addDownload',{
      providerId: MultiLazy.id,
      link: link,
      filename: link.substring(link.lastIndexOf('/')+1)
    });
	})
	.close();
});
NitroBit.matcher = function(url) {
    return url.toLowerCase().indexOf('nitrobit') > -1;
};
NitroBit.id = 'NitroBit';
Crawler.emit('addProvider', NitroBit);
