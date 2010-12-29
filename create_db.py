import couchdb
from couchdb import Document

server = couchdb.Server()
try:
    db = server.create('tiles')
except:
    db = server['tiles']

from couchdb.design import ViewDefinition
rpt_view = ViewDefinition('tile', 'by_xy', '''function(doc) { if (doc.type == 'tile') { emit([doc.x, doc.y], doc); }}''')
rpt_view.sync(db)
