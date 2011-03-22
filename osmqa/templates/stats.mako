<!doctype html>
<html>
  <head>
    <title>socket.io client test</title>
    <link rel="stylesheet" href="${request.application_url}/static/styles/style.css"
          type="text/css" />
    <script src="${request.application_url}/static/js/jquery-1.4.4.min.js"></script>
    <script src="${request.application_url}/static/js/jquery.timeago.js"></script>
</head>
<body>
    <script>
        $.getScript('http://cdn.socket.io/stable/socket.io.js', function(){
            socket = new io.Socket(null, {});
            socket.on('connect', function() {
                socket.send({type: "connect", userid: 123});
            });
            socket.on('message', function(obj) {
                var doc = obj.type.doc;
                if (doc) {
                    var time = $('<abbr />', {
                        title: doc.date
                    }).timeago();
                    var li = $("<li>" + doc.user + " </li>")
                        .append(time);
                    $('#changes').prepend(li
                        .hide().fadeIn(2000));
                }
            });
            socket.connect();
        });
            jQuery.timeago.settings.allowFuture = true;
    </script>
    <h1>OSM Quality Assurance - Stats</h1>
    <ul id="changes"></ul> 
</body>
</html>

