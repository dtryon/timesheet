(function (module) {


	var state = {
		person: {
			firstName: 'Happy',
			lastName: 'Gilmore'
		}
	};

	var handles = {};

	var register = function (entityName, fn) {

		if (handles[entityName]) {
			handles[entityName].push(fn);
		} else {
			handles[entityName] = [fn];
		}
	}

	var onAction = function (actionName, payload) {

		if (actionName === 'personChanged') {

			//update
			if (payload) {
				for (var key in payload) {
					if (state.person[key]) {
						state.person[key] = payload[key];
					}
				}
			}

			//call listeners
			if (handles['person']) {
				for (var i = handles['person'].length - 1; i >= 0; i--) {
					handles['person'][i](state.person);
				};
			}
		}
	}

	return module.exports = {
		register: register,
		onAction: onAction
	};

})(module);