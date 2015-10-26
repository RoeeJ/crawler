Downloads.allow({
	insert: function (userId, doc) {
		return Downloads.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Downloads.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Downloads.userCanRemove(userId, doc);
	}
});

Downloads.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.uploader) doc.uploader = userId;
});

Downloads.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Downloads.before.remove(function(userId, doc) {
	
});

Downloads.after.insert(function(userId, doc) {
	
});

Downloads.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Downloads.after.remove(function(userId, doc) {
	
});
