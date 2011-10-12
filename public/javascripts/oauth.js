function user(profile){
  var obj = {};
  obj.img = $("<img />")
    .attr("src", "http://graph.facebook.com/" + profile.id + "/picture")
    .attr("height", "36")
    .attr("width", "36")
    .addClass("profile-image");
  obj.name = $("<span />")
    .text(profile.name);
  return obj;
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
        var u = user(profile);
        var logout = $("<a />")
          .attr("href", "javascript:void(0)")
          .text("(logout)")
          .addClass("logout-link");
        var panel = $("#authentication-panel").empty();
        $("<div />")
          .attr("id", "user-box")
          .addClass("user")
          .addClass("important")
          .append(u.img)
          .append(u.name)
          .append(logout)
          .appendTo(panel);
        panel.show();
      });

      var q = "SELECT uid, name FROM user WHERE " +
              "online_presence IN ('active', 'idle') " +
              "AND uid IN " +
              "( " +
              " SELECT uid2 FROM friend WHERE uid1 = me() " +
              ")";

      FB.api({method: 'fql.query', query: q}, function(friends){
        $("<a />")
          .text(friends.length + " friends")
          .attr("href", "javascript:void(0)")
          .addClass("important")
          .addClass("hide-friends")
          .prependTo("#friends-panel")
          .click(function(){
            var node = $(this);
            if(node.hasClass("show-friends")){
              node.removeClass("show-friends").addClass("hide-friends");
              $("#friends").empty();
            } else {
              node.removeClass("hide-friends").addClass("show-friends");
              $.each(friends, function(i, friend){
                var u = user({id : friend.uid, name : friend.name});
                var clear = $("<div />").css("clear:both");
                $("<li />")
                  .addClass("user")
                  .addClass("important")
                  .append(u.img)
                  .append(u.name)
                  .append(clear)
                  .appendTo("#friends");
              });
            }
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
