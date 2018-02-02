$(function () {
	var login_div = document.getElementById('login');
	var message_div = document.getElementById('message-view');
	var content_div = document.getElementById('content');
	var socket = io("/private");
	var user = "";

	$('#login-form').submit(function(e){
		e.preventDefault();
		user = $('#name').val();
		socket.emit("useradded",user);
		login_div.style.display = "none";
		message_div.style.display = "grid";
		$('#m').focus();
		return false;
	});

	$('#message-form').submit(function(e) {
		e.preventDefault();
		msg = $('#m').val();
		socket.emit('send-message', {user, msg});
		$('#m').val('');
		$('#m').focus();
		return false;
	});
	
	socket.on('useradded',function(user){
		$('#messages').append('<li class="info">'+user+' connected</li>');
	});
	socket.on("userleft",function(user){
		$('#messages').append('<li class="info">'+user+' left</li>');
	});
	socket.on('receive-message', function(received_data) {
		if (received_data['user'] == user) {
			$('#messages').append('<li><h3 class="message-span to">'+received_data['msg']+'</h3></li>');
		}else{
			$('#messages').append('<li><div class="message-span from"><p>'+received_data['user']+'</p><h3>'+received_data['msg']+'</h3></div></li>');
		}
		content_div.scrollTop = content_div.scrollHeight;
	});

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
