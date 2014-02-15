App.Router.map(function() {
	this.resource('network', {path: '/t/:url'}, function() {
		this.resource('tab', {path: '/:tab'});
	});
});

App.NetworkRoute = AppRoute.extend({
	setupController: function(controller, model) {
		controller.set('model', model);
	},

	model: function(params) {
		return this.controllerFor('index').socket.findButWait('networks', {url: params.url}, true);
	},

	title: function(controller, model) {
		return model.get('name') + ' - ' + App.get('defaultTitle');
	},

	actions: {
		willTransition: function(transition) {
			var params = transition.params,
				parts = transition.providedModelsArray;

			if (parts.length === 0) {
				var url = (!params.tab) ? params.url : params.url + '/' + decodeURIComponent(params.tab).toLowerCase();
			} else if (parts.length === 1) {
				var url = parts[0];
			} else {
				var url = parts[0] + '/' + decodeURIComponent(parts[1]).toLowerCase();
			}
			// attempt to construct a url from resolves models or parameters

			var index = this.controllerFor('index'),
				socket = index.socket,
				tab = socket.tabs.findBy('url', url);

			if (!tab || tab && tab.selected) {
				return false;
			}

			//socket.get('users').setEach('selectedTab', url);
			// mark tab as selected

			index.set('tabId', tab._id);
			index.socket.update('users', {}, {selectedTab: tab.url});
			// send update to backend
		},

		markAsRead: function(id) {
			this.controller.markAllAsRead(id);
		},

		gotoUnread: function(id) {
			this.controller.gotoUnread(id);
		},

		gotoHighlight: function(id) {
			this.controller.gotoHighlight(id);
		}
	}
});