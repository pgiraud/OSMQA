# -*- coding: utf-8 -*-
import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
README = open(os.path.join(here, 'README.rst')).read()
CHANGES = open(os.path.join(here, 'CHANGES.rst')).read()

requires = [
    'pyramid',
    'pyramid_beaker',
    'WebError',
    'oauth2==1.2.0',
    'CouchDB==0.8'
    ]

setup(
    name                 = 'OSMQA',
    version              = '0.1',
    license              = 'GPLv3',
    zip_safe             = False,
    include_package_data = True,
    keywords             = 'OSM GIS',
    author               = 'François Van Der Biest',
    author_email         = 'francois.vanderbiest@gmail.com',
    url                  = 'http://www.qualitystreetmap.org/',
    description          = 'OSMQA is an OSM data quality assessment tool',
    long_description     = README + '\n\n' +  CHANGES,
    classifiers          = [
      'Development Status :: 1 - Planning',
      'Intended Audience :: Information Technology',
      'Intended Audience :: Science/Research',
      'License :: OSI Approved :: GNU General Public License (GPL)',
      'License :: OSI Approved :: Modified BSD License',
      'Operating System :: OS Independent',
      'Programming Language :: Python',
      'Framework :: Pylons',
      'Topic :: Scientific/Engineering :: GIS',
      'Topic :: Internet :: WWW/HTTP',
      'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
      'Topic :: Internet :: WWW/HTTP :: WSGI',
      ],
    packages=find_packages(),
    install_requires=requires,
    tests_require=requires,
    test_suite="osmqa",
    entry_points = """\
      [paste.app_factory]
      main = osmqa:main
      """,
    paster_plugins=['pyramid'],
)
