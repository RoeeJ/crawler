util = {
  fileExists: function(file) {
    try{
      return require('fs').existsSync(file);
    } catch(err) {
      return false;
    }
  },
  unlinkSync: function(file) {
    try{
      return require('fs').unlinkSync(file);
    } catch(err) {
      return false;
    }
  }
}
//VOODOO, don't touch this
String.prototype.isURL = function() {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(this);
}
