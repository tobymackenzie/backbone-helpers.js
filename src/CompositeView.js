/*
Class: CompositeView
Marionette CompositeView with 'viewHelpers' added.  Also, automatically fetch collection on render.
*/
define([
	'marionette'
	,'underscore'
	,'./viewHelpers'
], function(
	Marionette
	,_
	,viewHelpers
){
	var CompositeView = Marionette.CompositeView.extend({
		/*
		Method: onRender
		Fetch collection on render.
		*/
		onRender: function(){
			if(this.collection){
				if(this.collection.fetchIfUnfetched){
					this.collection.fetchIfUnfetched();
				}else{
					this.collection.fetch();
				}
			}
		}
	});
	_.extend(CompositeView.prototype, viewHelpers);
	return CompositeView;
});
