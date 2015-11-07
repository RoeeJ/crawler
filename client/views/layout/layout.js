Template.layout.rendered = function() {
	// scroll to anchor
	$('body').on('click', 'a', function(e) {
		var href = $(this).attr("href");
		if(!href) {
			return;
		}
		if(href.length > 1 && href.charAt(0) == "#") {
			var hash = href.substring(1);
			if(hash) {
				e.preventDefault();

				var offset = $('*[id="' + hash + '"]').offset();

				if (offset) {
					$('html,body').animate({ scrollTop: offset.top - 60 }, 400);
				}
			}
		} else {
			if(href.indexOf("http://") !== 0 && href.indexOf("https://") !== 0 && href.indexOf("#") !== 0) {
				$('html,body').scrollTop(0);
			}
		}
	});
	/*TEMPLATE_RENDERED_CODE*/
};



Template.PublicLayoutLeftMenu.rendered = function() {
	$(".dropdown-button").dropdown();

};

Template.PublicLayoutLeftMenu.events({
	"click .toggle-text": function(e, t) {
		e.preventDefault();
		$(e.target).closest("ul").toggleClass("menu-hide-text");
	}

});

Template.PublicLayoutLeftMenu.helpers({

});

Template.PublicLayoutRightMenu.rendered = function() {
	$(".dropdown-button").dropdown();

};

Template.PublicLayoutRightMenu.events({
	"click .toggle-text": function(e, t) {
		e.preventDefault();
		$(e.target).closest("ul").toggleClass("menu-hide-text");
	}

});

Template.PublicLayoutRightMenu.helpers({

});


Template.PrivateLayoutLeftMenu.rendered = function() {
	$(".dropdown-button").dropdown();

};

Template.PrivateLayoutLeftMenu.events({
	"click .toggle-text": function(e, t) {
		e.preventDefault();
		$(e.target).closest("ul").toggleClass("menu-hide-text");
	}

});

Template.PrivateLayoutLeftMenu.helpers({

});

Template.PrivateLayoutRightMenu.rendered = function() {
	$(".dropdown-button").dropdown();
};
Template.PrivateLayoutRightMenu.created = function() {
	window.duInterval = setInterval(function(){
		try{
			Meteor.call('getDiskUsage',function(err,res){
				try{
					if(res.error) return;
					var prog = res.result;
					var free = prog.free;
					var total = prog.total;
					var freeH = prog.freeH;
					var totalH = prog.totalH;
					Session.set('progressPercent', (free / total).toFixed(2));
					Session.set('progressText', prog.usedH+'/'+prog.totalH);
				}catch(_err){
					console.error(_err);
				}
			});
		}catch(err){}
	},5000);
};
Template.PrivateLayoutRightMenu.destroyed = function() {
	if(window.duInterval) {
		clearInterval(window.duInterval);
		window.duInterval = undefined;
	}
};
Template.PrivateLayoutRightMenu.events({
	"click .toggle-text": function(e, t) {
		e.preventDefault();
		$(e.target).closest("ul").toggleClass("menu-hide-text");
	}

});

Template.PrivateLayoutRightMenu.helpers({

});
