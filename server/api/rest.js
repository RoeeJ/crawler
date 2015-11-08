var request = Meteor.npmRequire('sync-request');
API = new Restivus({
  prettyJson: true
});
API.addRoute('getOTL', {}, {
  post: function() {
    if(this.request.headers.host === 'doom.slyke.net') {
      return {
        statusCode: 406,
        body: {
          error: "INVALID_ENDPOINT"
        }
      };
    }
    if(this.bodyParams.terofId) {
      var doc = Downloads.findOne({terofId:this.bodyParams.terofId});
      var linkId;
      if(doc){
        linkId = Links.insert({
          terofId: doc.terofId,
          requestingIP:this.bodyParams.requestingIP || this.request.connection.remoteAddress,
          path:doc.path,
          premium: this.bodyParams.premium || false
        });
      }
      return {
        statusCode: doc ? 201 : 404,
        body : doc ? {
          result: linkId+'.'+doc.filename.substring(doc.filename.lastIndexOf('.')+1),
          extra: getContentType(doc)
        } : {
          error: "LINK_NOT_FOUND"
        }
      };
    } else {
      return {
        statusCode: 500,
        body: {
          error : "MISSING_PARAMETER"
        }
      };
    }
  }
});
API.addRoute('addTerofLink', {authRequired: false}, {
  post: function() {
    if(this.bodyParams.id) {
      if(Downloads.findOne({terofId : this.bodyParams.id})) {
        return {
          statusCode : 409,
          body : {
            error: "DUPLICATE_VIDEO"
          }
        };
      }
      var odoc = JSON.parse(request('GET','http://terof.net/api/video/'+this.bodyParams.id).getBody('utf8'));
      var ranking = ['nitro','sdarot'];
      var pf;
      var doc;
      ranking.forEach(function(site){
        if(pf) return;
        odoc.links.filter(function(link){
          return link.url.indexOf(site) !== -1;
        }).forEach(function(link){
          if(pf) return;
          doc = {};
          doc.terofId = odoc.id;
          doc.title = odoc.title;
          doc.about = odoc.about;
          doc.link = link.url;
          doc.olink = link.url;
          //45324
          if(link.url.indexOf('nitrobit') > -1){
            pf = processNitroBit(link.url,['NB1782AJKP95'],doc) ? -1 : -2;
          } else {
            pf = Doom.processSync(doc);
          }
        });
      });
      if(pf){
        if(pf === -2){
          return {
            statusCode: 429,
            body: {
              error : "OVER_QUOTA"
            }
          };
        }
        return {
          statusCode: 202,
          body: {
            result : "LINK_PROCESSING",
            extra : doc
          }
        };
      } else {
        return {
          statusCode: 404,
          body:{
            error : "PROVIDER_NOT_FOUND"
          }
        };
      }
    } else {
      return {
        statusCode: 500,
        body: {
          error : "MISSING_PARAMETER"
        }
      };
    }
  }
});
function getContentType(doc) {
  var ctype;
  var ext = doc.path.match('\\.(.+)$')[1];
  switch(ext) {
    case 'mp4':
      ctype = 'video/mp4';
      break;
    case 'flv':
      ctype = 'video/x-flv';
      break;
    case 'mov':
      ctype = 'video/quicktime';
      break;
    case 'avi':
      ctype = 'video/x-msvideo';
      break;
    case 'wmv':
      ctype = 'video/x-ms-wmv';
      break;
    default:
      ctype = 'application/force-download';
      break;
  }
  return ctype;
}
function processNitroBit(url,passwords,doc){
  var password = passwords.pop();
  if(!password) return false;
  var ret = Async.runSync(function(done){
    var pf;
    var fileid = url.substring(url.lastIndexOf('/')+1);
    //http://www.nitrobit.net/watch/aq7nt22Q4
  	var Horseman = Meteor.npmRequire('node-horseman');
  	var horseman = Horseman({
  		webSecurity: false,
      proxy: '120.195.197.165:80',
      proxyType: 'html'
  	});
    //http://www.nitrobit.net/ajax/unlock.php?password=$password&file=$fileid&keep=true
  	horseman
    .userAgent('Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0 like Mac OS X; en-us) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7A341 Safari/528.16')
		.headers({
      'X-Requested-With' : 'XMLHttpRequest'
    })
  	.open('http://www.nitrobit.net/ajax/unlock.php?password='+password+'&file='+fileid+'&keep=false')
    .html()
  	.evaluate(function(){
      return $('a#download[href]').attr('href');
    })
  	.then(function(link) {
      if(link){
        pf = true;
        doc.providerId = 'NitroBit';
    		doc.olink = doc.link;
    		doc.link = link;
    		doc.filename = link.substring(link.lastIndexOf('/')+1);
        Doom.emit('addDownload',doc);
      }
      if(pf){
        done(null,pf);
      } else {
        done("INVALID_PASSWORD",null);
      }
  	})
  	.close();
  });
  console.log(ret);
  if(ret.error) return processNitroBit(url,passwords);
  return true;
}
function getRandString(len){
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, len || 10);
}
