import couchdb
import datetime
import logging

from pyramid.view import view_config

log = logging.getLogger(__name__)

VIEW = '_design/tile/_view/by_xy'

def get_db():
    server = couchdb.Server()
    return server['tiles']

@view_config(route_name='tiles', renderer='json')
def index(request):
    minx = int(request.params['minx'])
    maxx = int(request.params['maxx'])
    miny = int(request.params['miny'])
    maxy = int(request.params['maxy'])
    rows = []
    db = get_db()
    for i in range(minx, maxx):
        for row in db.view(VIEW, startkey=[i, miny], endkey=[i, maxy]):
            rows.append(row)
    return rows

def _update_tile(x, y, tag, user, remove=False):
    db = get_db()
    results = db.view(VIEW, key=[x,y])
    date = datetime.datetime.utcnow().replace(microsecond=0).isoformat() + 'Z'
    log.debug(date)
    if len(results) == 0:
        # FIXME use a model
        doc = couchdb.Document(type="tile", x=x, y=y, tags=[tag], user=user, 
                date=date)
        r = db.update([doc])
        return {"success": True} # FIXME REST
    else:
        r = db[results.rows[0].id]
        if (remove):
            r['tags'].remove(tag)
        else:
            r['tags'].append(tag);
        r['user'] = user
        r['date'] = date
        db.update([r])
    return {"success": True} # FIXME REST

@view_config(route_name='add_tag', renderer='json')
def add_tag(request):
    x = int(request.matchdict['x'])
    y = int(request.matchdict['y'])
    tag = request.matchdict['tag']
    user = request.session.get("user")
    return _update_tile(x, y, tag, user)

@view_config(route_name='rem_tag', renderer='json')
def rem_tag(request):
    x = int(request.matchdict['x'])
    y = int(request.matchdict['y'])
    tag = request.matchdict['tag']
    user = request.session.get("user")
    return _update_tile(x, y, tag, user, remove=True)

@view_config(route_name='tile', renderer='json')
def detail(request):
    db = get_db()
    revisions = [] 
    id = request.matchdict['id']
    for i in db.revisions(id):
        revisions.append(i)
    return revisions 
