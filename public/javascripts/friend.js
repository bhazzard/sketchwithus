function getFriends(callback){
  var fql = "SELECT uid, name, online_presence FROM user WHERE uid IN ( SELECT uid2 FROM friend WHERE uid1 = me())";
  FB.api({method: 'fql.query', query: fql}, callback); 
}; 

$(function(){
  window.Friend = Backbone.Model.extend({
    defaults : {
      isInvited : false
    },
    toggleInviteStatus : function(){
      this.set({isInvited : !this.get("isInvited")});
    }
  });

  window.FriendList = Backbone.Collection.extend({ 
    model : Friend,
    sendInvites : function(){
      var uids = "";
      _(this.models).each(function(friend){
        if(friend.get("isInvited")){
          uids = uids + friend.get("uid") + ",";
        }
      });
      
      this._createEvent(this._sendInvites(uids));         
    },
    _createEvent : function(callback){
      FB.api({
        method: 'events.create',
        event_info : {
          name : "some event",
          start_time : "11:00pm"
        }
      }, callback);      
    },
    _sendInvites : function(uids){
      return function(eventId){
        FB.api({
          method: 'events.invite',
          eid : eventId,
          uids :uids,
          personal_message : 'test message2'
        }, function(response){
          console.log(response);
          alert("invites sent");
        });
      };
    }    
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
      this.model.toggleInviteStatus();
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
      this.collection.sendInvites();
    }
  });
});

