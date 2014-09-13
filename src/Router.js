define([
	'marionette'
], function(
	Marionette
){
	return Marionette.Router.extend({
		navigate: function(_route, _opts){
			if(!_opts){
				_opts = {};
			}
			if(typeof _opts.trigger === 'undefined'){
				_opts.trigger = true;
			}
			Marionette.Router.prototype.navigate.call(this, _route, _opts);
		}
		,redirect: function(_route, _opts){
			if(!_opts){
				_opts = {};
			}
			if(typeof _opts.replace === 'undefined'){
				_opts.replace = true;
			}
			this.navigate(_route, _opts);
		}
	});
});
