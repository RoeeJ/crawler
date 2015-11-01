Downloads.allow({
	insert: function (userId, doc) {
		return true;
	},

	update: function (userId, doc, fields, modifier) {
		return true;
	},

	remove: function (userId, doc) {
		return true;
	}
});
Downloads.after.remove(function(userId, doc){
	if(doc.path) {
		var fs = Meteor.npmRequire('fs');
		if(fs.existsSync(doc.path)){
			fs.unlinkSync(doc.path);
		}
		if(fs.existsSync(doc.path+'.mtd')){
			fs.unlinkSync(doc.path+'.mtd');
		}
	}
});
