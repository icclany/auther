'use strict';

app.controller('StoryDetailCtrl', function ($scope, story, users, authFactory) {
	$scope.story = story;
	$scope.users = users;
	$scope.isAdmin = function(){
		console.log("isAdmin just ran and gave us ", authFactory.getUser().isAdmin)
		return authFactory.getUser().isAdmin;
	};
	$scope.$watch('story', function () {
		console.log("changed!!!!!!!!")
		$scope.story.save();
	}, true);
});