function userImageTemplate(userId){
  return $("<img />")
    .attr("src", "http://graph.facebook.com/" + userId + "/picture")
    .attr("height", "36")
    .attr("width", "36")
    .addClass("profile-image");  
};

function userNameTemplate(userName){
  return $("<span />").text(userName);
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
  var checkbox = $("<input />")
    .attr("type", "checkbox")
    .attr("id", friendId)
    .addClass("invite-checkbox");
  var label = $("<label />")
    .attr("for", friendId)
    .text("invite");
  return $("<div />")
    .append(checkbox)
    .append(label);
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
  $(".invite-checkbox").button();
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
      getOnlineFriends(function(friends){
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
