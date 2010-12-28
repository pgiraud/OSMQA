<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title></title>
  </head>
<body>
% if user is None:
  <a href="${request.route_url('login')}">login</a> (via OpenStreetMap oauth)
% else:
  Hello ${user}! <a href="${request.route_url('logout')}">logout</a>
% endif
</body>
</html>
