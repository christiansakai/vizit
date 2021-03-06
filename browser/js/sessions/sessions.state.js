app.config(function ($stateProvider) {

    $stateProvider.state('sessions', {
        url: '/sessions',
        controller: 'SessionsController',
        templateUrl: 'js/sessions/sessions.html',
        resolve: {
            code: function(UserFactory, AuthService) {
                return AuthService.getLoggedInUser()
                .then(function (user) {
                    return UserFactory.getAllTheCodez(user._id);
                });
            }
        }

    });

});
