/*
Class: ItemView
Marionette ItemView with 'viewHelpers' added.
*/
/* global define */
define([
	'marionette'
	,'./viewHelpers'
], function(
	Marionette
	,viewHelpers
){
	return Marionette.ItemView.extend(viewHelpers);
});
