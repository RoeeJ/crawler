Router.map(function () {
  this.route('stream', {
    path: '/stream/:id',
    where: 'server',
    action: function() {
      try {
        if(this.params.id) {
          var doc = Links.findOne(this.params.id);
          if(doc) {
            if(!doc.used) {
              var now = new Date();
              Links.update(doc._id,{$set:{used: true, usedAt:now}});
              doc.usedAt = now;
            }
            if(doc.requestingIP !== this.request.connection.remoteAddress) {
              this.response.writeHead(403);
              this.response.end(JSON.stringify({
                error:"UNAUTHORIZED_ACCESS"
              }));
              return;
            }
            if(Math.round((new Date() - new Date(doc.usedAt))/60000) > 15) {
              this.response.writeHead(403);
              this.response.end(stringify({
                error: "LINK_EXPIRED"
              }));
            } else {
              var fs = require('fs');
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
              this.response.writeHead(200, {
                'Content-Type': ctype,
                'Content-Length': fs.statSync(doc.path).size,
                'Content-Disposition': 'attachment; filename="'+doc.path.match('[^\/]+$')+'"'
              });
                var Throttle = require('throttle');
                fs.createReadStream(doc.path).pipe(new Throttle((doc.premium ? 5 : 1)*1024*1024)).pipe(this.response);
            }
          }
        } else {
          this.response.writeHead(500);
          this.response.end({
            error:"PARAMETER_MISSING"
          });
        }
      }catch(err) {
        this.response.writeHead(500);
        this.response.end(stringify({
          error:"SERVER_ERROR",
          extra:stringify(err)
        }));
      }
    }
  });
  //this.route("stream/:id", function(){this.response.end(JSON.stringify(Links.findOne({terofId: this.params.id})) || 'nope');});
});
function stringify(json) {return JSON.stringify(json);}
