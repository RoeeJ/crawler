Meteor.publish("all_downloads", function() {
	if(this.userId){
		//publish to logged in users only!
		return Downloads.find({}, {sort:{createdAt:-1}});
	}
});
