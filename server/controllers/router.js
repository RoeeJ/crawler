var Horseman = require('node-horseman');
Router.map(function () {
  this.route('proxy', {
    path: '/proxy/:url',
    where: 'server',
    action: function() {
      var self = this;
      var url = self.params.url;
      var _horseman = Horseman({
    		webSecurity: false
    	});
      //http://www.nitrobit.net/ajax/unlock.php?password=$password&file=$fileid&keep=true
      _horseman
    	.userAgent('Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0')
    	.open(url.indexOf('http://') != -1 ? '' : 'http://' + url)
      .cookies()
    	.then(function(_cookies) {
        var horseman = Horseman({
      		webSecurity: false
      	});
        horseman
      	.userAgent('Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0')
      	.open(url.indexOf('http://') != -1 ? '' : 'http://' + url)
        .cookies(_cookies)
        .html()
      	.then(function(html) {
          self.response.writeHead(200);
          self.response.end(html);
      	})
      	.close();
    	})
    	.close();
    }
  });
  this.route('stream', {
    path: '/stream/:id',
    where: 'server',
    action: function() {
      try {
        var self = this;
        if(self.params.id) {
          var doc = Links.findOne(self.params.id.split('.')[0]);
          console.log(doc);
          if(doc) {
            if(!doc.used) {
              var now = new Date();
              Links.update(doc._id,{$set:{used: true, usedAt:now}});
              doc.usedAt = now;
            }
            if(doc.requestingIP !== self.request.connection.remoteAddress) {
              self.response.writeHead(403);
              self.response.end(stringify({
                error:"UNAUTHORIZED_ACCESS"
              }));
              return;
            }
            if(Math.round((new Date() - new Date(doc.usedAt))/60000) > 15) {
              self.response.writeHead(403);
              self.response.end(stringify({
                error: "LINK_EXPIRED"
              }));
            } else {
              var total = util.statSync(doc.path).size;
              var Throttle = require('throttle');
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
              if(self.request.headers.range) {
                var fs = require('fs');
                var range = self.request.headers.range;
                var parts = range.replace(/bytes=/, "").split("-");
                var partialstart = parts[0];
                var partialend = parts[1];

                var start = parseInt(partialstart, 10);
                var end = partialend ? parseInt(partialend, 10) : total-1;
                var chunksize = (end-start)+1;
                var file = fs.createReadStream(doc.path, {start: start, end: end});
                this.response.writeHead(206,
                  {
                  'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
                  'Accept-Ranges': 'bytes',
                  'Content-Length': chunksize,
                  'Content-Type': ctype
                });
                file.pipe(new Throttle((doc.premium ? 5 : 1)*1024*1024)).pipe(self.response);
              } else {
                this.response.writeHead(200, {
                  'Content-Type': ctype,
                  'Content-Length': total,
                  'Content-Disposition': 'attachment; filename="'+doc.title.substring(doc.title.indexOf('/')+2)+doc.path.substring(doc.path.lastIndexOf('.'))+'"'
                });
                  fs.createReadStream(doc.path).pipe(new Throttle((doc.premium ? 5 : 1)*1024*1024)).pipe(self.response);
              }
            }
          }
        } else {
          self.response.writeHead(500);
          self.response.end({
            error:"PARAMETER_MISSING"
          });
        }
      }catch(err) {
        console.log(err);
        this.response.writeHead(500);
        this.response.end(stringify({
          error:"SERVER_ERROR",
          extra:stringify(err)
        }));
      }
    }
  });
  //this.route("stream/:id", function(){this.response.end(stringify(Links.findOne({terofId: this.params.id})) || 'nope');});
});
function stringify(json) {return JSON.stringify(json);}
