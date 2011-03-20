<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>${self.title()}</title>
    <link rel="stylesheet" href="${request.application_url}/static/styles/style.css"
          type="text/css" />
    ${self.head()}
  </head>
  <%self:bodytag>
    <div id="feedback-button">
      <img src="${request.application_url}/static/img/feedback.png"></img>
    </div>
    <div id="global">
      <div id="header">
        <h1>OSMQA</h1>
      </div>
      <div id="right">
        ${self.right()}
      </div>
      <div id="content">
        <div class="ui-widget">
          <label for="citysearch">Search for a location: </label>
          <input type="text" id="citysearch" />
        </div>
        <div id="map"></div>
      </div>
    </div>
  </%self:bodytag>
</html>
