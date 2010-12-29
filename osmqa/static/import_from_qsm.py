# ensure that postgresql database only contains data with at least one validated tag
#delete from tags where highway = 'f' AND building = 'f' AND landuse = 'f' AND barrier = 'f' AND cycleway = 'f' AND tracktype = 'f' AND waterway = 'f' AND railway = 'f' AND aeroway = 'f' AND aerialway = 'f' AND power = 'f' AND man_made = 'f' AND leisure = 'f' AND amenity = 'f' AND office = 'f' AND shop = 'f' AND tourism = 'f' AND historic = 'f' AND military = 'f' AND "natural" = 'f' AND sport = 'f' AND abutters = 'f' AND name = 'f' AND ref = 'f' AND place = 'f' AND addr = 'f';

from sqlalchemy import *

db = create_engine('postgresql://www-data:www-data@localhost:5432/osmqa')

connection = db.connect()

results = connection.execute(
    """
    SELECT
        ROUND((xmin(geometry) - -20037508) / (4.777314266967774 * 256)) AS x,
        ROUND((20037508.34 - ymax(geometry)) / (4.777314266967774 * 256)) AS y,
        highway, building, landuse, barrier, cycleway, tracktype, waterway, railway, aeroway, aerialway, power, man_made, leisure, amenity, office, shop, tourism, historic, military, "natural", sport, abutters, name, ref, place, addr
    FROM tiles;
    """
)

docs = []
for row in results:
    tags = []
    for i in ['highway', 'building', 'landuse', 'barrier', 'cycleway', 'tracktype', 'waterway', 'railway', 'aeroway', 'aerialway', 'power', 'man_made', 'leisure', 'amenity', 'office', 'shop', 'tourism', 'historic', 'military', 'natural', 'sport', 'abutters', 'name', 'ref', 'place', 'addr']:
        if row[i]:
            tags.append(i)
    docs.append({'type': 'tile', 'x': row['x'], 'y': row['y'], 'tags': tags})

connection.close()

import couchdb
from couchdb import Document
db = server['tiles']

db.update(docs)
