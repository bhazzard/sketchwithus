$(function(){
  var me = undefined;
  $('#login').html(_.template($("#login-template").html()));

  function onLogin() {
    FB.api('/me', function(profile) {
      me = profile;
      $('#authentication-panel').trigger('userLoggedIn', profile);
      var template = _.template($("#loggedin-template").html());
      $("#authentication-panel").html(template).show();
    });
  }

  function init() {
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
  }
  init();
    
  FB.Event.subscribe('auth.logout', function(auth) {
    $('#authentication-panel').trigger('userLoggedOut', me);
    init();
  });

  $('#authentication-panel').bind('recievedLogin', function(event, artist){
    var template = _.template($("#artist-template").html());
    $('#artists').append(template(artist));
  });

  $('#authentication-panel').bind('userLeft', function(event, artist_id){
    $('#' + artist_id).remove();
  });
});
