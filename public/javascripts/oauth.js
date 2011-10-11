$(document).ready(function(){
  FB.init({ 
    appId:'183470818398206', 
    cookie:true, 
    status:true, 
    xfbml:true,
    method: 'oauth',
    response_type: 'token'
  });
  
  $(document).delegate(".logout", "click", function(){
    FB.logout(function(response) {
      window.location.reload();
    });          
  });
  
  FB.getLoginStatus(function(response) {
    if (response.status === "connected") {
      FB.api('/me', function(profile) {
        $("#profile").tmpl(profile).prependTo("body");
      });
 
			FB.api('/me/friends?access_token=' + response.session.access_token, function(friends){
				$("#title").tmpl({count : friends.data.length}).appendTo("#friends");
				$.each(friends.data, function(i, friend){
					$("#generic").tmpl(friend).appendTo("#friends");
				});
			});
    } else {
      $("#fb-login-wrapper").show();
      FB.Event.subscribe('auth.login', function(auth) {
        window.location.reload();
      });              
    }
  });                  
});
