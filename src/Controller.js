/* global define, window */
define([
	'backbone'
	,'marionette'
], function(
	Backbone
	,Marionette
){
	return Marionette.Controller.extend({
		initialize: function(){
			this._routeScrollPositions = {};
		}
		/*
		Property: _currentRoute
		Stores the current route for working with scroll position.
		*/
		,_currentRoute: undefined
		/*
		Property: main
		Region representing main area of app, in which `renderView()` will render a view.
		*/
		,main: undefined
		/*
		Method: renderView
		Render a view in the 'main' area of the app.  Maintains scroll position for previous 'pages'.
		*/
		,renderView: function(_View, _opts){
			var _this = this;
			var _newRoute = Backbone.history.fragment;
			var _view = new _View(_opts);
			//--store old scroll position, scroll to old position if it exists
			if(_newRoute !== _this._currentRoute){
				var _position;
				_this._routeScrollPositions[_this._currentRoute] = window.pageYOffset;
				_this._currentRoute = _newRoute;
				_position = _this._routeScrollPositions[_newRoute] || 0;
				_view.once('show', function(){
					window.scrollTo(0, _position);
				});
			}
			_this.main.show(_view);
			this.trigger('renderView', _view);
		}
		/*
		Property: _routeScrollPositions
		Map of routes to their last scroll position to restore when rendering the view for that route.
		*/
		,_routeScrollPositions: undefined
	});
});
