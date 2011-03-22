#
from pyramid_socketio.io import SocketIOContext, socketio_manage
import gevent
from pyramid.view import view_config
from couchdb import Server

class ConnectIOContext(SocketIOContext):
    # self.io is the Socket.IO socket
    # self.request is the request
    def msg_connect(self, msg):
        print "Connect message received", msg
        self.msg("connected", hello="world")
        def getchanges():
            server = Server()
            db = server['tiles']
            changes = db.changes(include_docs='true')
            # last - 5 revision
            r = changes['results']
            rev = r[len(r) - 5]['seq']
            print(rev)
            changes = db.changes(feed='continuous', heartbeat=60000, include_docs='true', since=rev)

            while True:
                doc = changes.next()
                self.msg(doc)
        self.spawn(getchanges)

# Socket.IO implementation
@view_config(route_name="socket_io")
def socketio_service(request):
    print "Socket.IO request running"
    retval = socketio_manage(ConnectIOContext(request))
    return Response(retval)
