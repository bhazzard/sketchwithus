$(function(){
  var me = undefined;

  function onLogin() {
    FB.api('/me', function(profile) {
      me = profile;
      $('#artists').trigger('userLoggedIn', profile);
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
        $("#artists").show();
        onLogin();
      } else {
        $("#artists").show();
        FB.Event.subscribe('auth.login', function(auth) {
          onLogin();
        });
      }              
    });
  }
  init();
    
  FB.Event.subscribe('auth.logout', function(auth) {
    $('#artists').trigger('userLoggedOut', me);
    init();
  });

  $('#artists').bind('recievedLogin', function(event, artist){
    var template = _.template($("#artist-template").html());
    $('#artists').append(template(artist));
  });

  $('#artists').bind('userLeft', function(event, artist_id){
    $('#' + artist_id).remove();
  });
});
