$(function(){
  FB.init({ 
    appId:'183470818398206', 
    cookie:true, 
    status:true, 
    xfbml:true,
    method: 'oauth',
    response_type: 'token'
  });
    
  FB.getLoginStatus(function(response) {
    if (response.status === "connected") {
      FB.api('/me', function(profile) {
        var template = _.template($("#user-template").html());
        $("#authentication-panel").html(template(profile)).show();
      });

      getFriends(function(data){
        var friends = new FriendList(data);
        new FriendsView(friends).render();
      });

    } else {
      $("#authentication-panel").show();
      FB.Event.subscribe('auth.login', function(auth) {
        window.location.reload();
      });
    }              
  });                  
});
