from pyramid_beaker import session_factory_from_settings
from pyramid.config import Configurator

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(settings=settings)

    session_factory = session_factory_from_settings(settings)
    config.set_session_factory(session_factory)

    config.add_static_view('static', 'osmqa:static/')

    config.add_route('index', '/')
    config.add_route('login', '/login')
    config.add_route('oauth_callback', '/oauth_callback')
    config.add_route('logout', '/logout')

    config.add_route('tiles', '/tiles')
    config.add_route('tile', '/tile/{id}')
    config.add_route('add_tag', '/tiles/{x},{y}/tags/{tag}', request_method='PUT')
    config.add_route('rem_tag', '/tiles/{x},{y}/tags/{tag}', request_method='DELETE')

    config.scan()

    return config.make_wsgi_app()

