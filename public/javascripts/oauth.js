$(function(){
  var me = undefined;
  $('#authentication-panel').html(_.template($("#login-template").html()));

  function onLogin() {
    FB.api('/me', function(profile) {
      me = profile;
      $('#authentication-panel').trigger('userLoggedIn', profile);
      var template = _.template($("#user-template").html());
      $("#authentication-panel").html(template(profile)).show();
    });
  }

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
      $("#authentication-panel").show();
      onLogin();
    } else {
      $("#authentication-panel").show();
      FB.Event.subscribe('auth.login', function(auth) {
        onLogin();
      });
    }              
  });

  $('#authentication-panel').delegate('.logout-link', 'click', function() {
    FB.logout(function(response) {
      $('#authentication-panel').trigger('userLoggedOut', me);
      $('#authentication-panel').html(_.template($("#login-template").html()));
    });
  });

  $('#authentication-panel').bind('recievedLogin', function(event, artist){
    var template = _.template($("#artist-template").html());
    $(this).append(template(artist));
  });

  $('#authentication-panel').bind('recievedLogout', function(event, artist){
    console.log('recievedLogout');
  });
});
