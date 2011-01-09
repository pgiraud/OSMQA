<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>${self.title()}</title>
    <link rel="stylesheet" href="${request.application_url}/static/styles/style.css"
          type="text/css" />
    ${self.head()}
  </head>
  <%self:bodytag>
    <div id="global">
      <div id="header">
        <h1>OSMQA</h1>
      </div>
      <div id="right">
        ${self.right()}
      </div>
      <div id="content">
        <div id="map"></div>
        ${self.content()}
      </div>
    </div>
  </%self:bodytag>
</html>
