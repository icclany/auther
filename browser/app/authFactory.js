app.factory('authFactory', function($http){
	var currentUser; // id = currentUser._id
	return {
		submit: function(loginData){
			return $http({
				method: 'POST',
				url: '/login',
				data: loginData
			})
			.then(function(response){
				console.log("login: ", response.data)
				currentUser = response.data // set currentUser
				return currentUser;
			})
		},

		submitSignup: function(loginData) {
			return $http({
				method: "POST",
				url: "/api/users",
				data: loginData
			})
			.then(function(response){
				console.log("signup: ", response.data)
				currentUser = response.data // set currentUser
				return currentUser;
			})
		},

		getUser: function(){
			return currentUser
		},

		logout: function() {
			return $http({
				method: "GET",
				url: "/logout"
			})
		}
	}
})