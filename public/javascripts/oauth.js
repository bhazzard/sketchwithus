function userImageTemplate(userId){
  return $("<img />")
    .attr("src", "http://graph.facebook.com/" + userId + "/picture")
    .attr("height", "36")
    .attr("width", "36")
    .addClass("profile-image");  
};

function userNameTemplate(userName){
  return $("<span />")
    .text(userName);
};

function logoutTemplate() {
  return $("<a />")
    .attr("href", "javascript:void(0)")
    .text("(logout)")
    .addClass("logout-link");
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

function inviteTemplate(friendId){
  return $("<a />")
    .attr("href", "javascript:void(0)")
    .attr("fb-id", friendId)
    .text("invite");
};

function friendTemplate(friend){
  var clear = $("<div />").css("clear:both");                  
  return $("<li />")
    .addClass("user")
    .addClass("important")
    .append(userImageTemplate(friend.uid))
    .append(userNameTemplate(friend.name))
    .append("<br />")
    .append(inviteTemplate(friend.uid))
    .append(clear);
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
  
  $(document).delegate(".logout-link", "click", function(){
    FB.logout(function(response) {
      window.location.reload();
    });          
  });
  
  FB.getLoginStatus(function(response) {
    if (response.status === "connected") {
      FB.api('/me', function(profile) {
        $("#authentication-panel")
          .empty()
          .append(userBoxTemplate(profile))
          .show();
      });

      var q = "SELECT uid, name FROM user WHERE " +
              "online_presence IN ('active', 'idle') " +
              "AND uid IN " +
              "( " +
              " SELECT uid2 FROM friend WHERE uid1 = me() " +
              ")";

      FB.api({method: 'fql.query', query: q}, function(friends){
        $("<div />")
          .text(friends.length + " friends")
          .addClass("important")
          .prependTo("#friends-panel");
          $.each(friends, function(i, friend){
              $("#friends").append(friendTemplate(friend));
          });
      });
    } else {
      $("#authentication-panel").show();
      FB.Event.subscribe('auth.login', function(auth) {
        window.location.reload();
      });              
    }
  });                  
});
