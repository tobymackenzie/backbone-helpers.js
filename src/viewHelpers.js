/*
Object: viewHelpers
Helper methods to attach to views.
*/
define([
	'underscore'
], function(
	_
){
	return {
		/*
		Method: assign
		Assign a partial to one or more elements.

		-@ http://ianstormtaylor.com/assigning-backbone-subviews-made-even-cleaner/
		*/
		assign: function(_selector, _view){
			var _selectors;
			if(_.isObject(_selector)){
				_selectors = _selector;
			}else{
				_selectors = {};
				_selectors[_selector] = _view;
			}
			if(_selectors){
				_.each(_selectors, function(_view, _selector){
					_view.setElement(this.$(_selector)).render();
				}, this);
			}
			return this;
		}
		/*
		Property: services
		Service classes to make available to templates.
		*/
		,services: {}
		/*
		Method: templateHelpers
		Template helpers to attach to all Marionette views.
		*/
		,templateHelpers: function(){
			return {
				collection: this.collection
				,model: this.model
				,services: this.services
			};
		}
	};
});
