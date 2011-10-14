function logoutTemplate() {
  return $("<a />")
    .attr("href", "javascript:void(0)")
    .text("(logout)")
    .click(function(){
      FB.logout(function(response) {
        window.location.reload();
      });  
    });
};

function userBoxTemplate(profile){  
  return $("<div />")
    .attr("id", "user-box")
    .addClass("user")
    .addClass("important")
    .append(userImageTemplate(profile.id))
    .append(userNameTemplate(profile.name))
    .append(logoutTemplate());
};

function getOnlineFriends(callback){
  var fql = "SELECT uid, name FROM user WHERE " +
            "online_presence IN ('active', 'idle') " +
            "AND uid IN " +
            "( " +
            " SELECT uid2 FROM friend WHERE uid1 = me() " +
            ")";
  FB.api({method: 'fql.query', query: fql}, callback); 
}; 

$(document).ready(function(){
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
        $("#authentication-panel")
          .empty()
          .append(userBoxTemplate(profile))
          .show();
      });
      getOnlineFriends(function(friends){
        var view = new FriendList(new FriendCollection(friends));
        view.render();
      });
    } else {
      $("#authentication-panel").show();
      FB.Event.subscribe('auth.login', function(auth) {
        window.location.reload();
      });              
    }
  });                  
});
