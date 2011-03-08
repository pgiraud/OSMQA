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

You can also run it under mod_wsgi in apache. To do that, modify the osmqa.wsgi
file to match the path where you installed OSMQA. Then modify and add the following
to your apache configuration ::

    WSGIPassAuthorization On
    WSGIDaemonProcess pyramid user=www-data group=www-data processes=1 \
       threads=4 \
       python-path=/path/to/OSMQA/env/lib/python2.6/site-packages
    WSGIScriptAlias /osmqa /path/to/OSMQA/osmqa.wsgi

    <Directory /path/to/OSMQA>
      WSGIProcessGroup pyramid
      Order allow,deny
      Allow from all
    </Directory>


Want to help?
-------------

See the TODO.txt.
