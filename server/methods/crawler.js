var fs = require('fs');
var disk = require('diskusage');
Meteor.methods({
  getDoomState:function(){
     return Doom.state;
  },
  addLink: function(doc) {
    if(doc.client){
      return Doom.emit('addLink',doc);
    }
  },
  abortDownload: function(id) {
    Doom.emit('abortDownload',id);
  },
  getDiskUsage: function() {
    try{
      return Async.runSync(function(done) {
        disk.check(fs.existsSync('/ext') ? '/ext' : '/', function(err, info) {
          if(err) return console.error(err);
          done(null,{
            free:info.free,
            total:info.total,
            freeH:bitsToHumanReadable(info.free),
            totalH:bitsToHumanReadable(info.total),
            used:info.total-info.free,
            usedH:bitsToHumanReadable(info.total-info.free)
          });
        });
      });
    }catch(err){
      console.error(err);
    }
  }
});
function bitsToHumanReadable(_bits) {
  var thresh = 1000;
  var bytes = Math.round(_bits);
  if(Math.abs(_bits) < thresh) {
    return bytes + 'B';
  }
  var units = ['kB', 'MB', 'GB','TB','PB','EB','ZB','YB'];
  var u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while(Math.abs(bytes) >= thresh && u < units.length -1);
  return bytes.toFixed(1)+''+units[u];
}
