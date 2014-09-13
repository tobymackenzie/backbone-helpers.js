/*
Class: Collection
Extends Backbone's 'Collection' class with a few extra niceties.
*/
/* global define */
define([
	'backbone'
	,'jquery'
	,'tmlib/core/Queue'
	,'underscore'
], function(
	Backbone
	,jQuery
	,Queue
	,_
){
	var Collection = Backbone.Collection.extend({
		initialize: function(_opts){
			if(_opts && _opts.collectionManager){
				this.collectionManager = _opts.collectionManager;
			}
			Backbone.Collection.prototype.initialize.apply(this, arguments);
		}
		,has: function(_id){
			return (this.get(_id)) ? true : false;
		}
		//==fetching
		/*
		Property: collectionManager
		Inject collection manager for getting collections by name to use for fetching dependencies.  You can pass it into the constructor options or attach it to this class.
		*/
		,collectionManager: undefined
		,getCollectionManager: function(){
			return this.collectionManager || Collection.collectionManager;
		}
		/*
		Property: dependencies
		Array of other collections that should be fetched before considering this collection fetched.  Important if you have relationships between items in the collections.
		*/
		,dependencies: undefined
		/*
		Method: fetch
		Calls parent `fetch()` method, but also loads dependencies and increments `fetchCount`.
		*/
		,fetch: function(){
			var _this = this;
			var _args = arguments;
			var _queue = new Queue();
			if(_this.proxyOf){
				return _this.proxyOf.fetch.apply(_this, arguments);
			}else{
				//--fetch dependencies
				if(_this.dependencies && _this.dependencies.length){
					_.each(_this.dependencies, function(_item){
						try{
							var _collection = (typeof _item === 'object')
								? _item
								: _this.getCollectionManager() && _this.getCollectionManager().get(_item)
							;

						}catch(_e){}
					});
				}
				_queue.add(function(){
					return Backbone.Collection.prototype.fetch.apply(_this, _args);
				});
				_queue.done(function(){
					++_this._fetchCount;
				});
				return _queue._current;
			}
		}
		/*
		Property: _fetchCount
		Number of times this Collection has been fetched.  Useful if you are fetching all data and want to prevent multiple fetches.
		*/
		,_fetchCount: 0
		/*
		Method: fetchIfUnfetched
		Fetch only if not already fetched.

		//-@ http://stackoverflow.com/a/13966198
		*/
		,fetchIfUnfetched: function(){
			var _promise;
			if(this._fetchCount > 0){
				_promise = new jQuery.Deferred();
				_promise.resolve();
				_promise = _promise.promise();
			}else{
				_promise = this.fetch.apply(this, arguments);
			}
			return _promise;
		}
		/*
		Method: fetchOne
		Get a single item or fetch if not already fetched.  Returns a promise.  Promise resolves with scope of this and first argument of the model.
		-@ http://blog.soom.la/2014/04/backbone-js-a-better-fetch-function.html
		*/
		,fetchOne: function(_idOrWhere, _reFetch){
			var _this = this;
			var _item = (typeof _idOrWhere === 'object')
				? undefined
				: _reFetch && _this.get(_idOrWhere)
			;
			var _promise = new jQuery.Deferred();
			if(_item){
				_promise.resolveWith(_this, _item);
			}else{
				var _where;
				if(typeof _where === 'object'){
					_where = _idOrWhere;
				}else{
					_where = {};
					_where[_this.model.prototype.idAttribute] = _idOrWhere;
				}
				_item = new _this.model(_where);
				_this.add(_item);
				_item.fetch().done(function(){
					_promise.resolveWith(_this, _item);
				}).reject(_promise.reject);
			}
			return _promise;
		}

		//==filtering
		/*
		Method: createFilteredProxy
		Create a proxy Collection with a filter applied.  Events will flow from this through proxy Collection.

		-@ http://jsfiddle.net/derickbailey/7tvzF/
		*/
		,createFilteredProxy: function(_criteria){
			var _this = this;
			var _proxy = new _this.constructor();
			_proxy.proxyOf = _this;
			_proxy.filterBy = function(_criteria){
				var _items;
				if(_criteria){
					switch(typeof _criteria){
						case 'function':
							_items = this.proxyOf.filter(_criteria);
						break;
						default:
							_items = this.proxyOf.where(_criteria);
						break;
					}
				}else{
					_items = this.proxyOf.models;
				}
				this._currentCriteria = _criteria;
				this.reset(_items);
			};
			_proxy.listenTo(_this, 'add change remove reset', function(){
				_proxy.filterBy(_proxy._currentCriteria);
			});
			if(_criteria){
				_proxy.filterBy(_criteria);
			}
			return _proxy;
		}
		/*
		Property: _currentCriteria
		Current filtered criteria for a proxy `Collection`
		*/
		,_currentCriteria: undefined
		/*
		Method: getFilteredProxy
		Alias of `createFilteredProxy()` unless a name is provided.  Name allows cacheing frequently used proxies.
		*/
		,getFilteredProxy: function(){
			var _args = arguments;
			var _criteria;
			var _name;
			var _proxy;
			if(_args.length === 1){
				_criteria = _args[0];
			}else if(_args.length > 1){
				_name = _args[0];
				_criteria = _args[1];
			}
			if(_name){
				if(!this._proxies){
					this._proxies = {};
				}
				if(!this._proxies[_name]){
					this._proxies[_name] = this.createFilteredProxy(_criteria);
				}else if(_criteria){
					this._proxies[_name].filterBy(_criteria);
				}
				_proxy = this._proxies[_name];
			}else{
				_proxy =  this.createFilteredProxy(_criteria);
			}
			return _proxy;
		}
		/*
		Method: getProxyWithIDs
		Get a filtered proxy with items matching a passed array of IDs.
		*/
		,getProxyWithIDs: function(_ids){
			return this.getFilteredProxy(function(_item){
				return (_.indexOf(_ids, _item.get('id')) !== -1);
			});
		}

		/*
		Property: proxyOf
		If this is a proxy, returns the collection this is a proxy of.
		*/
		,proxyOf: false
		/*
		Property: _proxies
		List of named proxies to be gotten by `getFilteredProxy()`.
		*/
		,_proxies: undefined
	});
	return Collection;
});
