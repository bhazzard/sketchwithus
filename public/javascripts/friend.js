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

  window.SketchEvent = Backbone.Model.extend({
    initialize : function(invited){
      this.models = invited;
    },
    sendInvitations : function(){
      this._createEvent(this._buildInvitationsCallback());         
    },
    _createEvent : function(callback){
      FB.api({
        method: 'events.create',
        event_info : {
          name : "some event2",
          start_time : "11:00pm"
        }
      }, callback);      
    },
    _buildInvitationsCallback : function(){
      var uids = this._buildUidString();
      return function(eventId){
        FB.api({
          method: 'events.invite',
          eid : eventId,
          uids :uids,
          personal_message : 'test message.'
        }, function(successful){
          if(successful){
            alert("invites sent");
          } else {
            alert("unknown error");
          }
        });
      };
    },
    _buildUidString : function(){
      var uids = "";
      _(this.models).each(function(friend){
        uids = uids + friend.get("uid") + ",";
      });
      return uids;
    }
  });

  window.FriendList = Backbone.Collection.extend({ 
    model : Friend    
  });

  window.FriendView = Backbone.View.extend({
    tagName : "li",
    template: _.template($('#friend-template').html()),
    events : {
      "click input.invite-checkbox" : "_inviteStatusChanged"
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
      var sorted = _(this.collection.models).sortBy(function(friend){
        var online = friend.get("online_presence");
        return online === 'active' || online === 'idle';
      });
      return this;    
    },
    processInvitations : function(){
      var invitedFriends = this.collection.select(function(friend){ return friend.get("isInvited");});
      if(invitedFriends.length > 0) {
        var event = new SketchEvent(invitedFriends);
        event.sendInvitations();
      }
    }
  });
});

