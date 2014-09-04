<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>${self.title()}</title>
    <link rel="stylesheet" href="${request.application_url}/static/styles/style.css"
          type="text/css" />
    ${self.head()}
  </head>
  <%self:bodytag>
    <div id="feedback-button">
      <a href="https://github.com/pgiraud/OSMQA/issues" target="_blank"><img src="${request.application_url}/static/img/feedback.png" /></a>
    </div>
    <div id="global">
      <div id="header">
        <img src="${request.application_url}/static/img/title.png" alt="OSM Quality Assurance"/>
        <div class="ui-widget" id="location">
          <label for="citysearch">Search for a location: </label>
          <input type="text" id="citysearch" />
        </div>
      </div>
      <div id="right">
        ${self.right()}
      </div>
      <div id="content">
        <div id="map"></div>
      </div>
    </div>
  </%self:bodytag>
</html>
