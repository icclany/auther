'use strict';

app.controller('StoryDetailCtrl', function ($scope, story, users, authFactory) {
	$scope.story = story;
	$scope.users = users;
	$scope.canEdit = function(){
		console.log("isAdmin just ran and gave us ", authFactory.getUser().isAdmin)
		console.log("author true or false?", story.author._id === authFactory.getUser()._id)
		var adminCheck = authFactory.getUser().isAdmin;
		var authorCheck = (story.author._id === authFactory.getUser()._id);
		return adminCheck || authorCheck;
	};
	$scope.$watch('story', function () {
		console.log("changed!!!!!!!!")
		$scope.story.save();
	}, true);
});