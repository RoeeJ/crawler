var request = Meteor.npmRequire('sync-request');
API = new Restivus({
  prettyJson: true
});
API.addRoute('getOTL', {}, {
  post: function() {
    if(this.request.headers.host === 'crawler.slyke.net') {
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
          result: linkId,
          extra: getContentType(doc)
        } : {
          error: "LINK_NOT_FOUND"
        }
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
      var ranking = ['nitro', 'vidspot'];
      var pf;
      var doc;
      ranking.forEach(function(site){
        if(pf) return;
        odoc.links.filter(function(link){
          return link.host.indexOf(site) !== -1;
        }).forEach(function(link){
          if(pf) return;
          doc = {};
          doc.terofId = odoc.id;
          doc.title = odoc.title;
          doc.about = odoc.about;
          doc.link = link.url;
          doc.olink = link.url;
          pf = Crawler.processSync(doc);
        });
      });
      if(pf){
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
