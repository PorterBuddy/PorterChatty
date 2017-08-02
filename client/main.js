import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

import { Accounts } from 'meteor/accounts-base';

Messages = new Mongo.Collection('messages');


Template.register.events({
	'submit .register'(event) {
	    event.preventDefault();

	    const username = event.target.username.value;
	    const password = event.target.password.value;

	    Accounts.createUser({username: username, password: password}, function(error){
			if (error) {
	            event.target.username.classList.add("invalid");
	            event.target.password.classList.add("invalid");
	        }
		});
	},

	'submit .signIn'(event) {
	    event.preventDefault();

	    const username = event.target.username.value;
	    const password = event.target.password.value;

	    Meteor.loginWithPassword(username,password, function(error){
			if (error) {
	            event.target.username.classList.add("invalid");
	            event.target.password.classList.add("invalid");
	        }
		});
	},
});

Template.settings.events({
	'click .signOut'(event) {
	    event.preventDefault();
	    Meteor.logout();
	},
});

Template.chat.helpers({
	messages() {
    	return Messages.find({}, { sort: { timeStamp: 1 } });
	},
});

Template.message.helpers({
	is_it_me(name) {
    	if (name === Meteor.user().username)
			return "it-is-me";
	},
	user(name) {
    	let username = name.split("");
		let initial: any = username[0].toUpperCase();
		return initial;
	},
	time(stamp) {
    	let timeStamp = stamp.toLocaleTimeString();
		return timeStamp;
	},
});

Template.message.rendered = function(){
    this.autorun(function(event){
        let chat = document.getElementsByClassName("chat")[0];
        if (chat.scrollHeight > chat.offsetHeight)
        	chat.scrollTop = chat.scrollHeight - chat.offsetHeight;
    });
};

Template.addMessage.events({
	'submit .newMessage'(event) {
	    event.preventDefault();

	    if (!event.target.text.value)
	    	return;

	    const text = event.target.text.value;
	    const user = Meteor.user().username;

	    Messages.insert({
	      text,
	      timeStamp: new Date(),
	      username: user,
	    });

	    event.target.text.value = '';
	},
});