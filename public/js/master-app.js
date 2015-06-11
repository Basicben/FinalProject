var suiteApp = angular.module('suiteApp',['ngRoute']);

var USER = {

        id: "10153356515014410",
        birthday: "05/25/1989",
        email: "benari_kutai@yahoo.com",
        first_name: "Ben Ari",
        gender: "male",
        hometown: {
            id: "102184499823699",
            name: "Montreal, Quebec"
        },
        last_name: "Kutai",
        link: "https://www.facebook.com/app_scoped_user_id/10153356515014410/",
        locale: "en_US",
        location: {
            id: "111853268841906",
            name: "Rehovot, Israel"
        },
        mediumProfilePicture: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/v/t1.0-1/p200x200/1610834_10152823206274410_2045878086116312477_n.jpg?oh=7a35a74f394b9695a57a2fb6beaca3ad&oe=55F08067&__gda__=1441648651_a2dc5d750e0df629db63895735809c66",
        name: "Ben Ari Kutai",
        relationship_status: "Single",
        smallProfilePicture: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/v/t1.0-1/p40x40/1610834_10152823206274410_2045878086116312477_n.jpg?oh=a4743f1ef762de4734ed3a7b2434a78e&oe=55E88EC0&__gda__=1442821295_ac942cc9712dc12de7d91f4e23ac7e8c",
        timezone: 3,
        updated_time: "2015-06-05T18:00:17+0000",
        verified: true

};

suiteApp .config(['$routeProvider','$locationProvider',
    function($routeProvider,$locationProvider) {
    
    $locationProvider.html5Mode(true);

    $routeProvider.
    when('/', {
            templateUrl: 'templates/signup.html',
            controller: 'signupCntrl'
    }).
    when('/signup', {
            templateUrl: 'templates/signup.html',
            controller: 'signupCntrl'
    }).
    when('/home', {
            templateUrl: 'templates/home.html',
            controller: 'homeCntrl'
    }).
    otherwise({
            redirectTo: '/'
    });
}]);

suiteApp.controller('masterCntrl', function($scope,$http) {
     
     // Connected user object.
    $scope.connectedUser = null;
    
    $(document).ready(function(){
        console.log('init');
        //$scope.connectedUser = checkLoginState();
    });

    $scope.angFacebookLogin = function(){

        console.log('add user from fb');

        $scope.connectedUser = USER;
        console.log('USER',USER);
        $http.post('http://localhost:3000/api/userInsert', { user:$scope.connectedUser } ).
              success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                console.log('Success : data',data);
              }).
              error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log('Error : status');
              });        


        /*$scope.connectedUser = facebookLogin(function(){
            $scope.connectedUser = USER;
            console.log('$scope.connectedUser',$scope.connectedUser);
            $http.post('https://localhost:3000/userInsert',{user:$scope.connectedUser}).
              success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                console.log('Success : data',data);
              }).
              error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log('Error : status',status,'headers',headers);
              });
        });*/
    }

});