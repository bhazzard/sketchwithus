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

$(document).ready(function(){
  window.Friend = Backbone.Model.extend({
    defaults : {
      isInvited : false
    },
    sendInvitation : function(){
      var invited = this.get("isInvited");
      if(invited) { 
        var uid = this.get("uid");
        alert(uid);
      }
    }
  });

  window.Friends = Backbone.Collection.extend({ 
    model : Friend 
  });

  window.FriendView = Backbone.View.extend({
    tagName : "li",
    template: _.template($('#friend-template').html()),
    events : {
      "click .invite-checkbox" : "toggleInvitation"
    },
    initialize : function(model){
      this.model = model;
    },
    render : function(){
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },
    toggleInvitation : function(){
      this.model.set({isInvited : true});
    }
  });

  window.FriendsView = Backbone.View.extend({
    el : $("#friends-panel"),
    events : {
      "click #send-invitation" : "processInvitations"
    },
    initialize : function(friends){
      this.friends = friends;
    },
    render : function(){
      _(this.friends.models).each(function(friend){
        this.$("ul#friends").append(new FriendView(friend).render().el);
      });
      var template = _.template($("#friend-count-template").html());
      this.el.prepend(template({count : this.friends.length}));
      return this;    
    },
    processInvitations : function(){
      this.friends.each(function(friend){
        friend.sendInvitation();
      });
    }
  });
});

