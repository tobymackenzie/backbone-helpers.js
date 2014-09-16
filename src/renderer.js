/* global define */
define([
	'underscore'
	,'./viewHelpers'
], function(
	_
	,viewHelpers
){
	return {
		/*
		Property: _templates
		List of named templates to be rendered using `renderTemplate()`
		*/
		_templates: {}
		/*
		Method: renderTemplate
		Render a template using underscore's template "engine".  Passes in data with viewHelpers attached.
		Arguments:
			_template: Template to render.  Can be a compiled template function, a string template, or a name of a template in the '_templates' map.
			_data: Map of data to pass to template.  viewHelpers are added.
		*/
		,renderTemplate: function(_template, _data){
			if(_template){
				if(typeof _template !== 'function'){
					if(this._template[_template]){
						_template = this._template[_template];
					}else{
						_template = _.template(_template);
					}
				}
				_data = _.extend({}, viewHelpers.templateHelpers(_data), _data);
				return _template(_data);
			}
		}
	};
});
