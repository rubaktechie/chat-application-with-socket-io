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
			$('#messages').append('<li><h3 class="message-span to">'+received_data['msg']+'</h3></li>');
		}else{
			$('#messages').append('<li><div class="message-span from"><p>'+received_data['user']+'</p><h3>'+received_data['msg']+'</h3></div></li>');
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
