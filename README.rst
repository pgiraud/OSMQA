OSMQA
=====

An attempt to rewrite osmqa (http://qualitystreetmap.org/osmqa) with
a different User Interface and a different server implementation.

This implementation is based on `CouchDB <http://couchdb.apache.org/>`_,
`Pyramid <http://docs.pylonshq.com/pyramid/dev/>`_, `jQuery
<http://jquery.com/>`_, and `OpenLayers <http://openlayers.org>`_.

Install CouchDB
---------------

To install CouchDB the easiest is to rely on your operating system's package
management tool. Installing from source is also an option
(http://couchdb.apache.org/downloads.html).

Create Database
---------------

To create the database execute the ``create_db.py`` script::

    $ python create_db.py

Install OSMQA
-------------

Installing OSMQA in a Virtual Python environment is recommended.

To create a virtual Python environment::

    $ cd OSMQA
    $ wget http://pypi.python.org/packages/source/v/virtualenv/virtualenv-1.5.1.tar.gz
    $ tar xvzf virtualenv-1.5.1.tar.gz
    $ python virtualenv-1.5.1/virtualenv.py --distribute --no-site-packages env

To install OSMQA from source (the only option at this point) in the virtual
Python environment execute the ``setup.py`` script::

    $ env/bin/python setup.py install

Run OSMQA
---------

To run OSMQA the easiest is to use ``paster serve``::

    $ env/bin/paster serve development.ini

Want to help?
-------------

See the TODO.txt.
