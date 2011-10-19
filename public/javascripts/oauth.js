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
        $('#authentication-panel').trigger('userLoggedIn', profile);
        var template = _.template($("#user-template").html());
        $("#authentication-panel").html(template(profile)).show();
      });

    } else {
      $("#authentication-panel").show();
      FB.Event.subscribe('auth.login', function(auth) {
        window.location.reload();
      });
    }              
  });

  $('#authentication-panel').bind('recievedLogin', function(event, artist){
    var template = _.template($("#artist-template").html());
    $(this).append(template(artist));
  });
});
