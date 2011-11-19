$(function(){
  var me = undefined;

  function onLogin() {
    FB.api('/me', function(profile) {
      me = profile;
      $('#login').trigger('userLoggedIn', profile);
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
        onLogin();
      } else {
        FB.Event.subscribe('auth.login', function(auth) {
          onLogin();
        });
      }              
    });
  }
  init();
    
  FB.Event.subscribe('auth.logout', function(auth) {
    $('#login').trigger('userLoggedOut', me);
    init();
  });

  $('#login').bind('recievedLogin', function(event, artist){
    var template = _.template($("#artist-template").html()),
      artists = $('<div />').addClass('artists').appendTo('#content');
    artists.append(template(artist));
  });

  $('#login').bind('userLeft', function(event, artist_id){
    $('#' + artist_id).remove();
  });
});
