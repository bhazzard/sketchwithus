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

var Friend = Backbone.Model.extend({
  sendInvitation : function(){
    alert("someday, this will work!");
  }
});

var FriendCollection = Backbone.Collection.extend({
  model : Friend
});

var FriendList = Backbone.View.extend({
  el : '#friends-panel',
  initialize : function(friends){
    this.friends = friends;
  },
  render : function(){
    $("<div />")
      .text(this.friends.models.length + " friends online")
      .addClass("important")
      .prependTo(this.el);
    _(this.friends.models).each(function(friend){
      var view = new FriendListItem(friend);
      view.render();
    });
    return this;    
  }
});

var FriendListItem = Backbone.View.extend({
  el : 'ul#friends',
  initialize : function(friend){
    this.friend = friend;
  },
  render : function(){
    var clear = $("<div />").css("clear:both");
    var checkbox = $("<input />")
      .attr("type", "checkbox")
      .attr("id", this.friend.get("uid"))
      .addClass("invite-checkbox");
    var label = $("<label />")
      .attr("for", this.friend.get("uid"))
      .append(userImageTemplate(this.friend.get("uid")))
      .append(userNameTemplate(this.friend.get("name")));    
    var div = $("<div />")
      .append(checkbox)
      .append(label);
    $("<li />")
      .addClass("user")
      .addClass("important")
      .append(div)
      .append(clear)
      .appendTo(this.el);
      return this;
  }
});
