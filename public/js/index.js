$(function () {
	var login_div = document.getElementById('login');
	var message_div = document.getElementById('message-view');
	var content_div = document.getElementById('content');
	var socket = io("/private");
	var user = "";
	$('.login-btn').on("click touchstart",function(){
		login_validate();	
	});
	$('.login-input').on("keydown",function(e){
		if (e.keyCode == 13) {
			login_validate();
		}
	});

	$('.message-input').on("keydown",function(e){
		if (e.keyCode == 13) {
			send_message();
		}
	});
	$('.message-send').on("click touchstart",function(){
		send_message();	
	});
	
	socket.on('useradded',function(user){
		$('#messages').append('<li class="info">'+user+' connected</li>');
	});
	socket.on("userleft",function(user){
		$('#messages').append('<li class="info">'+user+' left</li>');
	});
	socket.on('receive-message', function(received_data) {
		if (received_data['user'] == user) {
			$('#messages').append('<li><p class="message-span to">'+received_data['msg']+'</p></li>');
		}else{
			showNotification("New Message from", received_data['user']);
			$('#messages').append('<li><div class="message-span from"><p style="font-size:x-small">'+received_data['user']+'</p><p>'+received_data['msg']+'</p></div></li>');
		}
		content_div.scrollTop = content_div.scrollHeight;
	});

	/*Functions*/
	function login_validate(){
		user = $('#name').val().trim();
		if(user){
			socket.emit("useradded",user);
			login_div.style.display = "none";
			message_div.style.display = "grid";
			showNotification("Login Successfull", "lets's chat");
			$('#m').focus();
		}else{
			$('#name')[0].setCustomValidity('Enter valid name');
		}		
	}
	function send_message(){
		msg = $('#m').val().trim();
		if (msg) {
			socket.emit('send-message', {user, msg});
			$('#m').val('');
			$('#m').focus();		
		}else{
			$('#m')[0].setCustomValidity('Enter valid name');
		}
	}
	function showNotification(title, message) {
		if (!("serviceWorker" in window)) {
			var notification = new Notification("Hello",{
				body : "Login Successfull",
				icon : "https://cdn0.iconfinder.com/data/icons/getsoci-2/1460/getsoci1.png"});
		}else{
			if (Notification.permission === 'granted') {
				navigator.serviceWorker.ready.then(function(registration) {
					console.log("hello")
					registration.showNotification(title, {
						body: message,
						icon: 'https://cdn0.iconfinder.com/data/icons/getsoci-2/1460/getsoci1.png',
					});
				});
			}
		}
	}
/*Developer tools shortcut and right click disable*/
	$(document).keydown(function (event) {
		if (event.keyCode == 123) {
			return false;
		} else if (event.ctrlKey && event.shiftKey && (event.keyCode == 73)) {
			return false;
		}
		$('#m').focus();
	});
	$(document).on("contextmenu", function (e) {        
		e.preventDefault();
	});
});
