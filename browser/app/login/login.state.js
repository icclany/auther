'use strict';

app.config(function ($stateProvider) {
	$stateProvider.state('login', {
		url: '/login',
		templateUrl: '/browser/app/login/login.html',
		controller: 'LoginCtrl'
	});

	// $stateProvider.state('logout', {
	// 	url: '/logout',
	// 	controller: 'LoginCtrl'
	// })
});

app.controller('LoginCtrl', function ($scope, $state, authFactory) {
	$scope.login = {
		email: "",
		password: ""
	}; // login info

	$scope.submit = function(){
		authFactory.submit($scope.login)
		.then(function() {
			console.log("Successful Login")
			$state.go('stories')
		}).then(null, function(err) {
			console.log("Unauthorized login -- ", err)
		})
	}

	

});