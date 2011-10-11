$(document).ready(function(){
  FB.init({ 
    appId:'183470818398206', 
    cookie:true, 
    status:true, 
    xfbml:true,
    method: 'oauth',
    response_type: 'token'
  });
  
  $(document).delegate(".logout", "click", function(){
    FB.logout(function(response) {
      window.location.reload();
    });          
  });
  
  FB.getLoginStatus(function(response) {
    if (response.status === "connected") {
      FB.api('/me', function(profile) {
				var img = $("<img />")
					.attr("src", "http://graph.facebook.com/" + profile.id + "/picture")
					.attr("width", "36")
					.attr("width", "36")
					.addClass("profile-image");
				var n = $("<h3 />")
					.text(profile.name);
				var logout = $("<a />")
					.attr("href", "javascript:void(0)")
					.text("Logout?")
					.addClass("logout");
				$("<div />")
					.attr("id", "user")
					.append(img)
					.append(n)
					.append(logout)
					.prependTo("body");
      });
 
			FB.api('/me/friends?access_token=' + response.session.access_token, function(friends){
				$("<h2 />")
					.text(friends.data.length + " Friends")
					.appendTo("#friends");

				$.each(friends.data, function(i, friend){
					var img = $("<img />")
						.attr("src", "http://graph.facebook.com/" + friend.id + "/picture")
						.attr("width", "36")
						.attr("width", "36")
						.addClass("profile-image");
					var n = $("<h3 />")
						.text(friend.name);
					var clear = $("<div />").css("clear:both");
					$("<li />")
						.append(img)
						.append(n)
						.append(clear)
						.appendTo("#friends");
				});
			});
    } else {
      $("#fb-login-wrapper").show();
      FB.Event.subscribe('auth.login', function(auth) {
        window.location.reload();
      });              
    }
  });                  
});
