import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
	var globalObject=Meteor.isClient?window:global;
	for(var property in globalObject){
		var object=globalObject[property];
		if(object instanceof Meteor.Collection){
			object.remove({});
		}
	}
});

Messages = new Mongo.Collection('messages');

if (Meteor.isServer) {
	Meteor.startup(function() {
		return Meteor.methods({
			removeAllMessages: function() {
				return messages.remove({});
			},
		});
	});
}