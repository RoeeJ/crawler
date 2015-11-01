var request = Meteor.npmRequire('sync-request');
API = new Restivus({
  prettyJson: true
});
API.addRoute('addLink', {authRequired: false}, {
  post: function() {
    return {
      statusCode: 508,
      body:{
        params: this.bodyParams
      }
    }
  }
});
API.addRoute('addLinkByTerofId', {authRequired: false}, {
  post: function() {
    if(this.bodyParams.id) {
      var odoc = JSON.parse(request('GET','http://terof.net/api/video/'+this.bodyParams.id).getBody('utf8'));
      var ranking = [
        'vidspot',
        'youwatch',
        'thand',
        'vidto',
        'movshare',
  			'videoweed',
  			'videowood',
  			'nowvideo',
  			'novamov'
      ];
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
        })
      })
      if(pf){
        return {
          statusCode: 200,
          body: {
            result : "LINK_PROCESSING",
            extra : doc
          }
        }
      } else {
        return {
          statusCode: 404,
          body:{
            error : "PROVIDER_NOT_FOUND"
          }
        }
      }
    } else {
      return {
        statusCode: 500,
        body: {
          error : "MISSING_PARAMETER"
        }
      }
    }
  }
});
