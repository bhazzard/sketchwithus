function getFriends(callback){
  var fql = "SELECT uid, name, online_presence FROM user WHERE uid IN ( SELECT uid2 FROM friend WHERE uid1 = me())";
  FB.api({method: 'fql.query', query: fql}, callback); 
}; 

$(function(){
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

  window.FriendList = Backbone.Collection.extend({ 
    model : Friend
  });

  window.FriendView = Backbone.View.extend({
    tagName : "li",
    template: _.template($('#friend-template').html()),
    events : {
      "click .invite-checkbox" : "_inviteStatusChanged"
    },
    initialize : function(model){
      this.model = model;
    },
    render : function(){
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },
    _inviteStatusChanged : function(){
      this.model.set({isInvited : true});
    }
  });

  window.FriendsView = Backbone.View.extend({
    el : $("#friends-panel"),
    events : {
      "click #send-invitation" : "processInvitations"
    },
    initialize : function(collection){
      this.collection = collection;
    },
    render : function(){
      _(this.collection.models).each(function(friend){
        this.$("ul#friends").append(new FriendView(friend).render().el);
      });
      var template = _.template($("#friend-count-template").html());
      this.el.prepend(template({count : this.collection.length}));
      return this;    
    },
    processInvitations : function(){
      this.collection.each(function(friend){
        friend.sendInvitation();
      });
    }
  });
});

