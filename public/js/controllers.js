suiteApp
/***************************
 *  SignUp Controller
 ***************************/
.controller('signupCntrl', function($scope,$rootScope) {

	$scope.facebookInsert = function(){
		$scope.$parent.angFacebookLogin();
	};

    console.log('signupCntrl');
     
})

/***************************
 *  Home Controller
 ***************************/
.controller('homeCntrl', function($scope,$rootScope) {
     
    console.log('homeCntrl');
     
})

/***************************
 *  Welcome Controller
 ***************************/
.controller('welcomeCntrl', function($scope,$rootScope,$location) {
     
    console.log('welcomeCntrl');

    $scope.enterApp = function(){
    	if($scope.$parent.connectedUser != null){
    		$location.path('home');
    	}
    }
     
})

/***************************
 *  myFriends Controller
 ***************************/
.controller('myFriendsCntrl', function($scope,$rootScope,$http) {

        console.log('myFriendsCntrl');

        $scope.friendList = [];
        $scope.categoryList = [];
        $scope.selectedCategoryList = [];

        $scope.addRemoveCategory = function(category,index){
            //push into a new array the ID of the category and the userFriendId
            category.IsSelected = !category.IsSelected;
            // if selected is true -> push to array.
            // if false, delete this category from array.
            if(category.IsSelected){
                console.log(category);
                $scope.selectedCategoryList.push(category._id);
            }
            else{
                // splice
                $scope.selectedCategoryList.splice($scope.selectedCategoryList.indexOf(category),1);
            }
        };

        //Sorting display of friends from categorized friends to uncategorized friends
        $scope.nullsCategoriesToBottom = function(obj) {
            //console.log("nullsCategoriesToBottom obj:",obj);
            if(obj.Categories.length != 0){
                return -1;
            }
            else{
                return 0;
            }
        };

        //Page reload for the first time
        $(document).ready(function(){
            // make api call to bring user's friends
            $http.post(window.location.origin + '/api/getMyFriends', { userId: $scope.$parent.connectedUser._id } ).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log('Success : data', data);
                    
                    // if user has signed up or not
                    if(data == null){
                        //$location.path('signup');
                        console.log('(data = null) in myFriendsCntrl:');
                    }else{
                        $scope.friendList = data;
                    }

                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log('Error : data', data);
                    console.log('Error : status', status);
                    console.log('Error : headers', headers);
                    console.log('Error : config', config);
                    // Redirect user back to login page
                    //$location.path('signup');
                });


                $http.post(window.location.origin + '/api/getCategories').
                    success(function(data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        //console.log('Success : data', data);
                        
                        // if user has signed up or not
                        if(data == null){
                            //$location.path('signup');
                            console.log('(data = null) in getCategories:');
                        }else{
                            $scope.categoryList = data;
                        }

                    }).
                    error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        console.log('Error : data', data);
                        console.log('Error : status', status);
                        console.log('Error : headers', headers);
                        console.log('Error : config', config);
                        // Redirect user back to login page
                        //$location.path('signup');
                    });

        });

})

/***************************
 *  suitMyFriends Controller
 ***************************/
.controller('suitmyfriendsCntrl', function($scope,$rootScope,$http) {

        console.log('suitmyfriendsCntrl');

        $scope.friendIndex = 0;
        $scope.friendList = [];
        $scope.categoryList = [];
        $scope.categoriazedFriend = {
            UserId:$scope.$parent.connectedUser._id,
            FriendId:0,
            Categories:[]
        };

        //Wipe function
        $("#friendPictureSection").wipetouch({
            tapToClick: true, // if user taps the screen, triggers a click event
            wipeLeft: function() {
                console.log("wipeRight");
                $scope.categoriazedFriend.FriendId = $scope.friendList[$scope.friendIndex]._id;

                if($scope.friendIndex < $scope.friendList.length - 1){
                    $scope.friendIndex++;
                }
                else{
                    $scope.friendIndex = 0;
                }
                $scope.disSelectAllCategories();
                if($scope.categoriazedFriend.Categories.length != 0) {
                    $scope.sendObjOfUserCategoryFriend($scope.categoriazedFriend);
                }
                else{
                    console.log("Nothing was insert!");
                }
                $scope.$apply();
                $scope.categoriazedFriend.Categories = [];


            },
            wipeRight: function() {
                console.log("wipeRight");
                $scope.categoriazedFriend.FriendId = $scope.friendList[$scope.friendIndex]._id;

                if($scope.friendIndex < $scope.friendList.length - 1){
                    $scope.friendIndex++;
                }
                else{
                    $scope.friendIndex = 0;
                }
                $scope.disSelectAllCategories();
                if($scope.categoriazedFriend.Categories.length != 0) {
                    $scope.sendObjOfUserCategoryFriend($scope.categoriazedFriend);
                }
                else{
                    console.log("Nothing was insert!");
                }
                $scope.$apply();
                $scope.categoriazedFriend.Categories = [];
            }
        });

        //Pushing selected categories to a new obj.array
        $scope.selectCategory = function(category,index){
            //push into a new array the ID of the category and the userFriendId
            category.IsSelected = !category.IsSelected;
            // if selected is true -> push to array.
            // if false, delete this category from array.
            if(category.IsSelected){
                $scope.categoriazedFriend.Categories.push(category);
            }
            else{
                $scope.categoriazedFriend.Categories.splice($scope.categoriazedFriend.Categories.indexOf(category),1);
            }
        };

        //Disselect all categories
        $scope.disSelectAllCategories = function(){
            angular.forEach($scope.categoryList, function(value){
                if(value.IsSelected){
                    value.IsSelected = false;
                }
            });
            $scope.$apply();
        };

        //Sending the new object(categoriazedFriends[userId,friendId,categories]) to server
        $scope.sendObjOfUserCategoryFriend = function(obj){
            $http.post(window.location.origin + '/api/userCategoryFriendInsert',{ categoriazedFriend: obj }).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log('Success at sendObjOfUserCategoryFriend : ', data);

                    // if user has signed up or not
                    if(data == null){
                        console.log('(data = null) in /api/userCategoryFriendInsert:');
                    }
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log('Error : data', data);
                    console.log('Error : status', status);
                    console.log('Error : headers', headers);
                    console.log('Error : config', config);
                    // Redirect user back to login page
                    //$location.path('signup');
                });
        };

/*************             First load of the page                ********/

        $(document).ready(function(){
            // make api call to bring user's friends
            $http.post(window.location.origin + '/api/getMyUncategorizedFriends', { userId: $scope.$parent.connectedUser._id } ).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log('Success getMyUncategorizedFriends: data', data);

                    // if user has signed up or not
                    if(data == null){
                        console.log('(data = null) in suitmyfriendsCntrl:');
                    }else{
                        $scope.friendList = data;

                        // this happens only in the first time --> receiving data of the user's friends and
                        // categoriazedFriends.friendId will get the first friend id
                        $scope.categoriazedFriend.FriendId = $scope.friendList[$scope.friendIndex]._id;
                        console.log("index: ",$scope.friendIndex);
                        console.log("$(documnebt).ready + $scope.friendList[friendIndex]: ",$scope.friendList[$scope.friendIndex]);
                        console.log("first friend id: ",$scope.categoriazedFriend.FriendId);
                    }

                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log('Error : data', data);
                    console.log('Error : status', status);
                    console.log('Error : headers', headers);
                    console.log('Error : config', config);
                    // Redirect user back to login page
                    //$location.path('signup');
                });


            $http.post(window.location.origin + '/api/getCategories').
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available

                    // if user has signed up or not
                    if(data == null){
                        //$location.path('signup');
                        console.log('(data = null) in getCategories:');
                    }else{
                        $scope.categoryList = data;
                    }

                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log('Error : data', data);
                    console.log('Error : status', status);
                    console.log('Error : headers', headers);
                    console.log('Error : config', config);
                    // Redirect user back to login page
                    //$location.path('signup');
                });

        });

})

/***************************
 *  inviteFriends Controller
 ***************************/

.controller('inviteFriendsCntrl', function($scope,$rootScope,$http) {



    $scope.invitation = {
        name: null,
        placeName: null,
        friends:null,
    }



    $scope.autoComplete = {
        value: null,
        details: {},
        options: {
            types: 'address'
            //,country: 'ca'
        }
    };

    $scope.autoCompleteTemplate = '';

    // Watch for Landmark input.
    $scope.$watch('autoComplete.details', function (n, o) {
        $scope.autoComplete.value = n;
        if(!jQuery.isEmptyObject(n)){
            var location = $scope.autoComplete.value.geometry.location;
            $scope.markers['marker1'] = {
                lat: location[Object.keys(location)[0]],
                lng: location[Object.keys(location)[1]],
                message: n.formatted_address,
                focus: true,
                draggable: false
            }

            $scope.center = {
                lat: location[Object.keys(location)[0]],
                lng: location[Object.keys(location)[1]],
                zoom: 12,
            }
        }
    });


    angular.extend($scope, {
        center: {
            lat: 59.91,
            lng: 10.75,
            zoom: 12
        },
        markers: {

        },
        defaults: {
            scrollWheelZoom: false
        }
    });

    $scope.sendInvitation = function(){
        if($scope.autoComplete.value == null){
            return;
        }
        placelocation.changeLocation($scope.autoComplete.value);
        $scope.$parent.changeURL('selectfriends');
    }
     
})

/***************************
 *  selectFriends Controller
 ***************************/
.controller('selectFriendsCntrl', function($scope,$rootScope,$http){


    // Array contains category types.
    $scope.circleList = [];
    // Array contains friend list.
    $scope.friendList = [];
    // Array contains selected friends we would like to send the invitation to.
    $scope.selectedFriends = [];

    $scope.selectedCircle = [];

    $scope.selectedUsers = [];

    $scope.isCircle = function(user){
        //return (user.circle.contains());

        return function( friend ) {
            if($scope.selectedCircle.length == 0 || $scope.selectedCircle == null){
                console.log('isCircle length == 0');
                return true;
            }

            angular.forEach($scope.selectedCircle, function(circle) {
                for(var i=0; i<friend.circles.length; i++){
                    console.log('friend.circles[i].Circleid',friend.circles[i].CircleId);
                    console.log('circle._id',circle._id);
                    console.log('friend.FirstName',friend.FirstName);
                    if(friend.circles[i].CircleId == circle._id){
                        
                        return true;
                    }
                }
            });

          };
    };

    //$scope.criteriaMatch = function( criteria ) {
    //  return function( item ) {
    //    return item.name === criteria.name;
    //  };
    //};

    $scope.selectFriend = function(friend){
        friend.IsSelected = !friend.IsSelected
        if(friend.IsSelected){
            // If here, Push object to array
            $scope.selectedFriends.push(friend);
        }else{
            // If here, Delete object from array
            $scope.selectedFriends.splice($scope.selectedFriends.indexOf(friend),1); 
        }
    }

    $scope.selectCircle = function(circle){
        circle.IsSelected = !circle.IsSelected
        if(circle.IsSelected){
            // If here, Push object to array
            $scope.selectedCircle.push(circle);
        }else{
            // If here, Delete object from array
            $scope.selectedCircle.splice($scope.selectedCircle.indexOf(circle),1); 
        }
    }

    $scope.selectAll = function(){
        console.log('selectAll');
        if($scope.selectedFriends.length == $scope.friendList.length)
            return;

        angular.forEach($scope.friendList, function(friend){
            if(friend.IsSelected == false){
                friend.IsSelected = true;
                $scope.selectedFriends.push(friend);    
            }            
        });
    }

    $scope.unsellectAll = function(){
        console.log('unsellectAll');
        angular.forEach($scope.friendList, function(friend){
            if(friend.IsSelected == true){
                friend.IsSelected = false;
                $scope.selectedFriends.splice($scope.selectedFriends.indexOf(friend),1);    
            }            
        });
    }

    $scope.sendAll = function(){
        if($scope.selectedFriends.length == 0){
            console.log('Cannot send');
            return;
        }

        // Add selected friend object to factory object so it would be reachable from all controllers
        friendselection.setFriends($scope.selectedFriends);
        // Transfer to Invitation Page
        $scope.$parent.changeURL('invitation');


    }

    $(document).ready(function(){

            // make api call to bring user's friends
            $http.post(window.location.origin + '/api/getMyFriends', { userId: $scope.$parent.connectedUser._id } ).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available

                    // if user has signed up or not
                    if(data == null){
                        console.log('(data = null) in suitmyfriendsCntrl:');
                    }else{
                        $scope.friendList = data;

                        console.log('$scope.friendList',$scope.friendList);
                    }

                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log('Error : data', data);
                    console.log('Error : status', status);
                    console.log('Error : headers', headers);
                    console.log('Error : config', config);
                    // Redirect user back to login page
                    //$location.path('signup');
                });


                $http.post(window.location.origin + '/api/getFriendsCircles', { userId: $scope.$parent.connectedUser._id } ).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available

                    // if user has signed up or not
                    if(data == null){
                        console.log('(data = null) in suitmyfriendsCntrl:');
                    }else{
                        console.log('data',data);
                        $scope.circleList = data;
                    }

                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log('Error : data', data);
                    console.log('Error : status', status);
                    console.log('Error : headers', headers);
                    console.log('Error : config', config);
                    // Redirect user back to login page
                    //$location.path('signup');
                });


    console.log('selectFriendsCntrl');
    });
})
.controller('invitationsCntrl', function($scope,$rootScope,$http,friendselection,placelocation){

    $scope.eventLocation = placelocation.getLocation();
    $scope.friendList = friendselection.getFriends();
    console.log('invitationsCntrl',$scope.eventLocation);

});


