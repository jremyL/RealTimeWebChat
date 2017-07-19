/**
 * Created by Jeremy on 7/10/2017.
 */

$(document).ready(function () {
    var messages = [];
    var socket = io.connect('https://localhost:8443',{
        secure: true
    });
    var field = $('#btn-input');
    var sendButton = $('#btn-chat');
    var content = $('.chat');
    var user = null;

    var date = new Date();
    var dateString = date.getHours() + ':' + date.getUTCMinutes() + " " + date.getDate() + "/" + date.getUTCMonth() + "/" + date.getFullYear();

    if(!$.cookie('_username')){
        console.log('its here');
        $('#myModal').modal({backdrop: 'static', keyboard: false});
    } else {
        user = $.cookie('_username');
        getMessageJSON();
        $('#myModal').remove();
    }



    $('#myModal').on('hide.bs.modal', function () {

    })


    socket.on('message', function (data) {
        console.log(data);
        if (data.message) {
            messages.push(data.message);
            console.log(data);
            console.log(user);

            if (data.user.trim() == user.trim()) {
                var html = '<li class="right clearfix"><span class="chat-img pull-right"> ' +
                    '<img src="/images/spike.gif" alt="User Avatar" class="img-circle" /> ' +
                    '</span> ' +
                    '<div class="chat-body clearfix"> ' +
                    '<div class="header"> ' +
                    '<small class=" text-muted"><span class="glyphicon glyphicon-time"></span>' + dateString + '</small> ' +
                    '<strong class="pull-right primary-font">' + user + '</strong> ' +
                    '</div> ' +
                    '<p class="pull-right">' + data.message +
                    '</p> ' +
                    '</div> ' +
                    '</li>';
                $(content).append(html);
            } else {
                var html = ' <li class="left clearfix"><span class="chat-img pull-left"> ' +
                    '<img src="/images/spike.gif" alt="User Avatar" class="img-circle" /> ' +
                    '</span> ' +
                    '<div class="chat-body clearfix"> ' +
                    '<div class="header"> ' +
                    '<strong class="primary-font">' + data.user + '</strong> <small class="pull-right text-muted"> ' +
                    '<span class="glyphicon glyphicon-time"></span>'+dateString+'</small> ' +
                    '</div> ' +
                    '<p>' + data.message +
                    '</p> ' +
                    '</div> ' +
                    '</li>';
                $(content).append(html);
            }
        } else {
            console.log("There is a problem:", data);
        }
    });

    sendButton.click(function (e) {
        e.preventDefault();
        messageSubmit();
    });

    $('#submitUser').click(function (e) {
        e.preventDefault();
        saveUsername();
    });

    $('#username, #btn-input').keypress(function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            console.log($(this));
            if ($(this).attr('id') == 'btn-input') {
                messageSubmit();
            } else if ($(this).attr('id') == 'username') {
                saveUsername();
            }
        }
    });

    function saveUsername() {
        user = $('#username').val();

        if (user == null || user.trim() == "") {
            user = 'Anon' + new UniqueID().getID();
            user = user
        }

        user = user.replace(/[>]/g, '&gt');
        user = user.replace(/[<]/g, '&lt');

        $.cookie('_username', user);
        getMessageJSON();
        $('#myModal').remove();

    }

    function messageSubmit() {
        var text = $(field).val();
        text = text.replace(/[>]/g, '&gt');
        text = text.replace(/[<]/g, '&lt');
        socket.emit('send', {user: user, message: text});
        $(field).val('');
    }

    function UniqueID(){
        this.rand = Math.floor(Math.random() * 26) + Date.now();
        this.getID = function(){
            return this.rand++;
        }
    }

    function populateChat(data) {
        for(var i = 0; i<data.length; i++){
            if (data[i].username.trim() == user.trim()) {
                var html = '<li class="right clearfix"><span class="chat-img pull-right"> ' +
                    '<img src="/images/spike.gif" alt="User Avatar" class="img-circle" /> ' +
                    '</span> ' +
                    '<div class="chat-body clearfix"> ' +
                    '<div class="header"> ' +
                    '<small class=" text-muted"><span class="glyphicon glyphicon-time"></span>' + dateString + '</small> ' +
                    '<strong class="pull-right primary-font">' + user + '</strong> ' +
                    '</div> ' +
                    '<p class="pull-right">' + data[i].message +
                    '</p> ' +
                    '</div> ' +
                    '</li>';
                $(content).append(html);
            } else {
                var html = ' <li class="left clearfix"><span class="chat-img pull-left"> ' +
                    '<img src="/images/spike.gif" alt="User Avatar" class="img-circle" /> ' +
                    '</span> ' +
                    '<div class="chat-body clearfix"> ' +
                    '<div class="header"> ' +
                    '<strong class="primary-font">' + data[i].username + '</strong> <small class="pull-right text-muted"> ' +
                    '<span class="glyphicon glyphicon-time"></span>'+dateString+'</small> ' +
                    '</div> ' +
                    '<p>' + data[i].message +
                    '</p> ' +
                    '</div> ' +
                    '</li>';
                $(content).append(html);
            }
        }
    }

    function getMessageJSON(){
        $.get('/getJson',function (data) {
            console.log(data);
            populateChat(data);
        });
    }
});
    
