<%inherit file="/base.mako"/>

<%def name="title()">Main</%def>

<%def name="head()">
    <link rel="stylesheet"
          href="${request.application_url}/static/styles/jquery-ui/jquery.ui.autocomplete.custom.css"
          type="text/css" />
    <script src="${request.application_url}/static/js/jquery-1.4.4.min.js"></script>
    <script src="${request.application_url}/static/js/jquery-ui-1.8.7.custom.min.js"></script>
    <script src="${request.application_url}/static/js/ie-compat.js"></script>
    <script src="${request.application_url}/static/js/tag-it.js"></script>
    <script src="${request.application_url}/static/js/OpenLayers.js"></script>
    <script src="${request.application_url}/static/js/Div.js"></script>
    <script src="${request.application_url}/static/js/Static.js"></script>
    <script src="${request.application_url}/static/js/app.js"></script>
    <script type="text/javascript">
        OpenLayers.ImgPath = "${request.application_url}/static/img/";
        window.tilesURL = "${request.route_url('tiles')}";
    </script>
</%def>

<%def name="bodytag()">
  <body onload="init()">
    ${caller.body()}
  </body>
</%def>

<%def name="right()">
  % if user is None:
        <a href="${request.route_url('login')}">login</a> (via OpenStreetMap oauth)
  % else:
        Hello ${user}! <a href="${request.route_url('logout')}">logout</a>
  % endif
        <div id="mapconfig">
          <h2>Map:</h2>
          <p>Currently the map shows validated tiles for :</p>
          <p id="maptag" class="important"></p>
          <p id="showMapTags">You might want to show validated tiles for a a <a
          href="javascript:void(0);"
          onclick="$('#maptags').fadeIn();$('#showMapTags').hide();">specific
          tag</a>.</p>
          <p id="maptags"></p>
        </div>
        <div id="tileconfig">
          <h2>Selected tile</h2>
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
          Legend:&nbsp;
          <div class="legend olTile valid">
            <div>&nbsp;</div>
          </div>
          <div>Validated tiles (current tag)</div>
          <div class="legend olTile halfvalid">
            <div>&nbsp;</div>
          </div>
          <div>Validated tiles (other tag)</div>
        </div>
</%def>
