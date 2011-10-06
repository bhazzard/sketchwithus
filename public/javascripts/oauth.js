$(document).ready(function(){
  FB.init({ 
    appId:'183470818398206', 
    cookie:true, 
    status:true, 
    xfbml:true,
    method: 'oauth',
    response_type: 'token'
  });
  
  $("#stage").delegate(".logout", "click", function(){
    FB.logout(function(response) {
      window.location.reload();
    });          
  });
  
  FB.getLoginStatus(function(response) {
    if (response.status === "connected") {
      FB.api('/me', function(profile) {
        $("#profile").tmpl(profile).appendTo("#stage");
      });
    } else {
      $("#fb-login-wrapper").show();
      FB.Event.subscribe('auth.login', function(auth) {
        window.location.reload();
      });              
    }
  });                  
});