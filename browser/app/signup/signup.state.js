'use strict';

app.config(function ($stateProvider) {
	$stateProvider.state('signup', {
		url: '/signup',
		templateUrl: '/browser/app/signup/signup.html', 
		controller: 'SignupCtrl'
	});
});

app.controller('SignupCtrl', function($scope, $state, authFactory){
	$scope.signup = {
		email: "",
		password: ""
	};

	$scope.submitSignup = function(){
		authFactory.submitSignup($scope.signup)
		.then(function(userCreated){
			console.log("User Created! ", userCreated);
			$state.go('stories');
		}).then(null, function(err){
			console.log("User not created. Error: ", err)
		})
	}

})