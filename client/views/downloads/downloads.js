Meteor.subscribe("all_downloads");
Template.downloads.helpers({
  allDownloads: function(){
    return Downloads.find();
  },
  shortenLink: function(link){
    return '<p><abbr title='+link+'>'+link.substring(0,15)+'...</abbr>'
  },
  isDownloading: function(){
    return this.state == 1;
  },
  getProgress: function(prog){
    if(typeof prog === 'number') {
      Session.set('progressPercent', prog)
      Session.set('progressText', "we're "+prog+"% there")
    }
  },
  getState: function(state) {
    if(state == 2) {
      return '<a href="#!" class="secondary-content inactiveLink"><i class="material-icons">thumb_up</i></a>';
    } else if(state == 1) {
      return '<a href="#!" class="secondary-content inactiveLink"><i class="material-icons">dns</i></a>';
    } else if(state < 0) {
      return '<a href="#!" class="secondary-content inactiveLink"><i class="material-icons">thumb_down</i></a>';
    }
  },
  getStateColor: function(state) {
    switch (state) {
      case 1:
      return "yellow"
        break;
      case 2:
        return "green"
        break
      default:
        return "red"
        break;
    }
  }
});
Template.downloads.events({
  "click .delBtn": function(event, template){
    Materialize.modalize.display({
      template: "delModal",
      docId: this['_id']
    });
  },
  "click #addBtn": function(e,tmpl) {
    var link = $('#linkTxt').val();
    if(link){
      $('#linkTxt').fadeOut(100,function(){
        $('#linkTxt').val('');
        $('#linkTxt').fadeIn(100, function(){
          Meteor.call('addLink',link);
          Materialize.toast('link added!',2000);
        });
      })
    }
  }
});
Template.delModal.events({
  "click #delBtn": function(event, template){
    Downloads.remove(this.docId)
  }
});
