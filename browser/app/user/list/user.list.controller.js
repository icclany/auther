'use strict';

app.controller('UserListCtrl', function ($scope, users, User, authFactory) {
	$scope.users = users;

	$scope.canEdit = function(){
		console.log("in user list controller")
		console.log(authFactory.getUser())
		return authFactory.getUser().isAdmin;
	};
	$scope.addUser = function () {
		$scope.userAdd.save()
		.then(function (user) {
			$scope.userAdd = new User();
			$scope.users.unshift(user);
		});
	};
	
	$scope.userSearch = new User();

	$scope.userAdd = new User();
});