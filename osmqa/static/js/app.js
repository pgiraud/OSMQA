
var osmqa = function() {

    /**
     * Property: map
     */
    var map = null;

    /**
     * Property: layer
     */
    var layer = null;

    /**
     * Property: usualTags
     * The list of most used tags
     */
    var usualTags = ['highway', 'cycleway', 'building'];

    /**
     * Property: sharedTags
     * The list of tags shared by all the tiles currently selected
     */
    var sharedTags = [];

    /**
     * Property: unsharedTags
     * The list of tags that is owned by at least one tile but not all.
     */
    var unsharedTags = [];

    /**
     * Property: currentMapTag
     * The currently chosen tag for map display.
     */
    var currentMapTag = 'all';

    /**
     * Method: createMap
     */
    function createMap() {
        map = new OpenLayers.Map('map');
        var osm = new OpenLayers.Layer.OSM('Simple OSM Map');
        osm.setOpacity(0.7);
        map.addLayer(osm);
        
        layer = new OpenLayers.Layer.Static('OSMQA Static Layer', window.tilesURL, {
            maxResolution: 76.43702827148438,
            buffer: 0
        });
        layer.events.on({
            'selectionchange': onSelectionChange
        });
        map.addLayer(layer);

        map.setCenter(
            new OpenLayers.LonLat(5.9, 45.6).transform(
                new OpenLayers.Projection('EPSG:4326'),
                map.getProjectionObject()
            ), 12
        );    
    };

    /**
     * Method: manageMapTag
     * Creates the currentMapTag manager (below the map)
     */
    function manageMapTag() {
        // map tag edit-in-place
        $('#currentMapTag')
            .click(function() {
                var element = $(this);
                element.hide();
                var edit = $('<input type="text" class="edit_in_place" />');
                edit.css({
                    'height': element.height()-2
                });
                edit.val(element.text());
                element.after(edit);
                var updateMapTagAdder = function() {
                    var value = edit.val() || 'any tag';
                    edit.hide();
                    element.show();
                    changeMapTag(value);
                    edit.remove();
                };
                edit.keydown(function(e){
                        if(e.which===27) {
                            edit.blur(); // blur on Esc
                        }
                        if(e.which===13 || e.which===9){ // Enter or Tab
                            e.preventDefault();
                            updateMapTagAdder();
                        }
                    })
                    .autocomplete({
                        source: usualTags,
                        select: function(event, ui) {
                            if (event.keyCode == 13) {
                                // the keypress event will do the job itself
                                return;
                            }
                            edit.val(ui.item.value);
                            updateMapTagAdder();
                        },
                        minLength: 0,
                        delay: 0
                    })
                    .blur(function(e) {
                        // add a delay to let the select happend
                        window.setTimeout(function() {
                            edit.remove();
                            element.show();
                        }, 200);
                    })
                    .val('')
                    .trigger('keydown.autocomplete')
                    .focus();
            });
    };

    var roundd = function(input, decimals) {
        var p = Math.pow(10, decimals);
        return Math.round(input*p)/p;
    };

    var getLink = function(options) {
        if (options.protocol === 'lbrt') {
            var bounds = options.bounds;
            return options.base + OpenLayers.Util.getParameterString({
                left: roundd(bounds.left,5),
                bottom: roundd(bounds.bottom,5),
                right: roundd(bounds.right,5),
                top: roundd(bounds.top,5)
            });
        } else if (options.protocol === 'llz') {
            var c = options.bounds.getCenterLonLat();
            return options.base + OpenLayers.Util.getParameterString({
                lon: roundd(c.lon,5),
                lat: roundd(c.lat,5),
                zoom: options.zoom || 15
            });
        }
    };

    var exportOpen = function() {  
        var tiles = layer.selectedTiles;
        var url, bounds = new OpenLayers.Bounds();
        for (var i=0,l=tiles.length; i<l; i++) {
            bounds.extend(tiles[i].bounds);
        }
        bounds.transform(
            new OpenLayers.Projection("EPSG:900913"), 
            new OpenLayers.Projection("EPSG:4326")
        );
        
        switch (this.id) {
        case "josm":
            url = getLink({
                base: 'http://127.0.0.1:8111/load_and_zoom?',
                bounds: bounds,
                protocol: 'lbrt'
            });
            window.open(url).close();
            break;
        case "potlatch":
            url = getLink({
                base: 'http://www.openstreetmap.org/edit?editor=potlatch&',
                bounds: bounds,
                zoom: 16,
                protocol: 'llz'
            });
            window.open(url);
            break;
        case "potlatch2":
            url = getLink({
                base: 'http://www.openstreetmap.org/edit?editor=potlatch2&',
                bounds: bounds,
                zoom: 16,
                protocol: 'llz'
            });
            window.open(url);
            break;
        case "wp":
            url = getLink({
                base: 'http://walking-papers.org/?',
                bounds: bounds,            
                protocol: 'llz'
            });
            window.open(url);
            break;
        default:
            break;
        }
    };
    
    /**
     * Method: onSelectionChange
     * Called when user selects tiles on the map
     */
    function onSelectionChange() {
        $('#results').empty();

        if (!layer.selectedTiles.length) {
            $('#tileconfighelp').show();
            return;
        }

        $('#tileconfighelp').hide();
        $('#results')
            .append($('<h2 />', {
                text: "Selected area"
            }));
        var text;
        if (layer.selectedTiles.length == 1) {
            var tile = layer.selectedTiles[0];
            text = tile.location[0] + ' ' + tile.location[1];
            if (tile.attributes.date) {
                text += ' Last modified : ';
                var date = new Date();
                date.setTime(Date.parse(tile.attributes.date));
                text += date.toLocaleDateString();
            }
        } else if (layer.selectedTiles.length > 1) {
            text = layer.selectedTiles.length;
        }
        $('<p>', {
            'class': 'important',
            text: text
        }).appendTo('#results');
        
        $('<p>', {
            'class': 'export',
            'html': ['Open with <a href="#" id="josm">JOSM<a>', 
                '<a href="#" id="potlatch">Potlatch<a>', 
                '<a href="#" id="potlatch2">Potlatch 2<a>', 
                '<a href="#" id="wp">Walking Papers<a>'].join(', ')
        }).appendTo('#results');
        $('#results p.export a').click(exportOpen);

        createTagsList();
    }

    function createTagsList(tiles) {
        // organize the tags list
        getSharedTags();
        sharedTags.sort();

        var h2 = $('<h2 />', {
            text: "Tags "
        });
        if (window.user) {
            
            var adderText = $('<small />')
                .append('(')
                .append($('<a />', {
                    text: 'add a tag',
                    click: function() {
                        addTagAdder();
                        adderText.remove();
                    }
                }))
                .append(')')
                .appendTo(h2);
        }

        $('#results')
            .append(h2);

        // create the shared ul
        var sharedList = $('<ul />', {
            "id": "sharedTags",
            "class": "tags",
            "html": "<h3>Shared tags</h3>"
        });
        $('#results').append(sharedList);

        // TODO don't display the 'shared tags' label if there's no need

        $.each(sharedTags, function(index, tag) {
            addTag(tag);
        });

        // create the unshared ul
        var unsharedList = $('<ul />', {
            "id": "unsharedTags",
            "class": "tags",
            "html": "<h3>Unshared tags</h3>"
        });
        $('#results').append(unsharedList);

        $.each(unsharedTags, function(j, tag) {
            addTag(tag, unsharedList);
        });
    };
    
    /**
     * Method: getSharedTags
     * Update the sharedTags and unsharedTags properties
     */
    function getSharedTags() {
        var tiles = layer.selectedTiles;
        if (tiles.length == 1) {
            sharedTags = tiles[0].tags;
        } else {
            // get the shared tags
            sharedTags = [];
            $.each(tiles[0].tags, function(index, tag) {
                var shared = true;
                for (var i = 1, len = tiles.length; i < len; i++) {
                    if (tiles[i].tags.indexOf(tag) == -1) {
                        shared = false;
                    }
                }
                if (shared) {
                    sharedTags.push(tag);
                }
            });
        }

        unsharedTags = [];
        if (layer.selectedTiles.length > 1 && sharedTags) {
            $.each(layer.selectedTiles, function(i, tile) {
                $.each(tile.tags, function(j, tag) {
                    if (sharedTags.indexOf(tag) == -1 &&
                        unsharedTags.indexOf(tag) == -1) {
                        unsharedTags.push(tag);
                    }
                });
            });
        }
    };

    /**
     * Method: addTag
     *
     * Parameters:
     * {String} tag to add
     * {Element} list to add the tag to, if not precised, the tag will be added to
     * the shared list
     */
    function addTag(tag, list) {
        var tiles = layer.selectedTiles;
        var li = $("<li />", {
            "class": "tag",
            html: '<span>' + tag + '</span>',
            title: 'Click to use this tag for the map',
            click: function() {
                changeMapTag(tag);
            },
            mouseover: function() {
                layer.changeTag(tag);
            },
            mouseout: function() {
                layer.changeTag(currentMapTag);
            }
        });

        if (window.user) {
            li.append($("<a>", {
                "class": "close",
                text: "x",
                title: "Remove this tag ?",
                click: function() {
                    layer.updateTile(tiles, tag, true, function() {
                        li.fadeOut(300, function() {
                            $(this).remove();
                        });
                        getSharedTags();
                    });
                    layer.changeTag(currentMapTag);
                    return false;
                }
            }));
        }

        if (unsharedTags.indexOf(tag) != -1 &&
            !list) {
            $("li.tag span:econtains('" + tag + "')").fadeOut(300, function() {
                $(this).parent("li").remove();
            });
        }

        list = list || $('#results ul#sharedTags.tags');
        li.appendTo(list);
    };

    /**
     * Method: addTagAdder
     * Creates the autocomplete tag adder
     */
    function addTagAdder() {
        var tiles = layer.selectedTiles;
        var tagInput = $('<input />')
            .appendTo('#results');

        function filter() {
            var r = [];
            $.each(usualTags, function(index, tag) {
                if (sharedTags.indexOf(tag) == -1) {
                    r.push(tag);
                }
            });
            return r;
        }

        function showList() {
            $(this).autocomplete('option', 'source', filter());
            if (this.value === "") {
                $(this).autocomplete('search', '');
            }
        }

        tagInput.autocomplete({
            source: filter(),
            select: function(event, ui) {
                if (event.keyCode == 13) {
                    // the keypress event will do the job itself
                    return;
                }
                var val = ui.item.value;
                layer.updateTile(tiles, val, false, function() {
                    addTag(val);
                    // FIXME the unshared tags may need to be updated
                    getSharedTags();
                });
                ui.item.value = '';
            },
            minLength: 0,
            delay: 0
        })
            .focus(showList)
            .click(showList);
        tagInput.focus();

        // checks the keypress event for enter or comma, and adds a new tag
        // when either of those keys are pressed
        tagInput.keypress(function(e) {
            if (e.which == 13 || e.which == 44) {
                e.preventDefault();
                var val = $(this).val();
                if (val !== "") {
                    // the user added a not previously defined tag,
                    // let's add it for future use
                    if (usualTags.indexOf(val) == -1) {
                        usualTags.push(val);
                        usualTags.sort();
                    }
                    layer.updateTile(tiles, val, false, function() {
                        addTag(val);
                        getSharedTags();
                    });
                } else {
                    $("li.tag span:econtains('" + val + "')").effect("highlight", {}, 3000);
                }

                $(this).val("");
            }
        });
    };

    /**
     * Method: changeMapTag
     * Update the map to display validated tiles for one specific tag
     */
    function changeMapTag(tag) {
        currentMapTag = tag;
        layer.changeTag(tag);
        $('#currentMapTag').html(tag);
    };

    return {
        init: function() {
            createMap();
            manageMapTag();

            if (window.user) {
                $('#results').addClass('isLogged');
            }
        }
    };
}();


// an equivalent to :contains() selector but with exact match
$.expr[":"].econtains = function(obj, index, meta, stack) {
    return (obj.textContent || obj.innerText || $(obj).text() || "").toLowerCase() == meta[3].toLowerCase();
};
