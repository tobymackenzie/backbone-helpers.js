/*
Class: ItemView
Marionette ItemView with 'viewHelpers' added.
*/
define([
	'marionette'
	,'./viewHelpers'
], function(
	Marionette
	,viewHelpers
){
	return Marionette.ItemView.extend(viewHelpers);
});
