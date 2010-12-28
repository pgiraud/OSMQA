import unittest

from pyramid.config import Configurator

class MyControllerTests(unittest.TestCase):
    def setUp(self):
        self.config = Configurator(autocommit=True)
        self.config.begin()

    def tearDown(self):
        self.config.end()

    def _makeOne(self, request):
        from osmqa.handlers import MyHandler
        return MyHandler(request)

    def test_index(self):
        request = DummyRequest()
        controller = self._makeOne(request)
        info = controller.index()
        self.assertEqual(info['project'], 'OSMQA')

class DummyRequest(object):
    pass
