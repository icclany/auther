'use strict';

app.directive('navbar', function ($state, $location) {
	return {
		restrict: 'E',
		templateUrl: '/browser/components/navbar/navbar.html',
		link: function (scope) {
			scope.pathStartsWithStatePath = function (state) {
				var partial = $state.href(state);
				var path = $location.path();
				return path.startsWith(partial);
			};
		}
	}
});


app.controller('NavbarCtrl', function($scope, authFactory, $state) {
	$scope.logout = function() {
			console.log("LOGGING OUT!!!!!!")
			authFactory.logout()
			.then(function(success) {
				console.log("redirect?")
				$state.go('home')
			})
			.then(null, function(err) {
				console.log("Unsuccessful logout -- ", err)
			})
		}
})