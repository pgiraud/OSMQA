<%inherit file="/base.mako"/>

<%def name="title()">Main</%def>

<%def name="head()">
    <link rel="stylesheet"
          href="${request.application_url}/static/styles/jquery-ui/ui-lightness/jquery-ui-1.8.8.custom.css"
          type="text/css" />
    <link rel="stylesheet"
          href="${request.application_url}/static/styles/tags.css"
          type="text/css" />
    <script src="${request.application_url}/static/js/jquery-1.4.4.min.js"></script>
    <script src="${request.application_url}/static/js/jquery-ui-1.8.8.custom.min.js"></script>
    <script src="${request.application_url}/static/js/OpenLayers.js"></script>
    <script src="${request.application_url}/static/js/Div.js"></script>
    <script src="${request.application_url}/static/js/Static.js"></script>
    <script src="${request.application_url}/static/js/app.js"></script>
    <script type="text/javascript">
        OpenLayers.ImgPath = "${request.application_url}/static/img/";
        window.tilesURL = "${request.route_url('tiles')}";
        % if user is not None:
            window.user = '${user}';
        % endif
    </script>
</%def>

<%def name="bodytag()">
  <body onload="osmqa.init()">
    <div id="auth">
      % if user is None:
            <a href="${request.route_url('login')}">login</a> (via OpenStreetMap oauth)
      % else:
            Hello ${user}! <a href="${request.route_url('logout')}">logout</a>
      % endif
    </div>
    ${caller.body()}
  </body>
</%def>

<%def name="right()">
        <div id="tileconfig">
          <div id="tileconfighelp">
             <p>Click on a tile in the map to select it and see its properties</p>
             <p><em>You may need to zoom up to level 15</em></p>
          </div>
          <div id="results"></div>
        </div>
        <div style="clear:both"></div>
</%def>

<%def name="content()">
        <div id="maplegend">
          <div class="label">Tiles validated for <span id="currentMapTag">any tag</span></div>
        </div>
</%def>
