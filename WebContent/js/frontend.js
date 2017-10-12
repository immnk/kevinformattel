$(function() {
    "use strict";

    // for better performance - to avoid searching in DOM
    var content = $('#content');
    var input = $('#input');
    var status = $('#status');

    // my color assigned by the server
    var myColor = false;
    // my name sent to the server
    var myName = false;

    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        content.html($('<p>', {
            text: 'Sorry, but your browser doesn\'t ' + 'support WebSockets.'
        }));
        input.hide();
        $('span').hide();
        return;
    }

    // open connection
    var connection = new WebSocket('ws://127.0.0.1:1337');

    connection.onopen = function() {
        // first we want users to enter their names
        input.removeAttr('disabled');
        status.text('Enter data to send to server');
    };

    connection.onerror = function(error) {
        // just in there were some problems with conenction...
        content.html($('<p>', {
            text: 'Sorry, but there\'s some problem with your ' + 'connection or the server is down.'
        }));
    };

    // most important part - incoming messages
    connection.onmessage = function(message) {
        input.removeAttr('disabled');
        console.log(message);
        content.text(message.data);
    };

    /**
     * Send mesage when user presses Enter key
     */
    input.keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) {
                return;
            }
            // send the message as an ordinary text
            connection.send(msg);
            $(this).val('');
            // disable the input field to make the user wait until server
            // sends back response
            input.attr('disabled', 'disabled');

            // we know that the first message sent from a user their name
            if (myName === false) {
                myName = msg;
            }
        }
    });

    /**
     * This method is optional. If the server wasn't able to respond to the
     * in 3 seconds then show some error message to notify the user that
     * something is wrong.
     */
    setInterval(function() {
        if (connection.readyState !== 1) {
            status.text('Error');
            input.attr('disabled', 'disabled').val('Unable to comminucate ' + 'with the WebSocket server.');
        }
    }, 3000);
});
