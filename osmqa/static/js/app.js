var map, layer;
var frequentTags = ['highway', 'cycleway', 'building'];

function onSelectionChange() {
    $('#tileconfighelp').show();
    $('#results').empty();
    if (layer.selectedTiles.length == 1) {
        var tile = layer.selectedTiles[0];
        $('#tileconfighelp').hide();
        $('<p>', {
            'class': 'important',
            text: tile.location[0] + ' ' + tile.location[1]
        }).appendTo('#results');
        var currentTagsList = $('<ul>', {
            text: 'Currently validated tags: ',
            class: 'tags'
        }).appendTo('#results');

        var tags = $('<ul>', {
        }).appendTo('#results');
        $.each(tile.tags, function(index, tag) {
            $('<li>', {
                text: tag
            }).appendTo(tags);
        });
        
        tags.tagit({
            availableTags: frequentTags,
            onTagAdded: function(tag) {
                tag = tag.children("input").val();
                // prevent first load to send request
                if (tile.tags.indexOf(tag) == -1) {
                    layer.updateTile(tile, tag, false);
                }
            },
            onTagRemoved: function(tag) {
                tag = tag.children("input").val();
                layer.updateTile(tile, tag, true);
            }
        });
    }
}

function init(){
    map = new OpenLayers.Map('map');
    layer = new OpenLayers.Layer.OSM('Simple OSM Map');
    map.addLayer(layer);
    layer = new OpenLayers.Layer.Static('Simple OSM Map', window.tilesURL, {
        maxResolution: 76.43702827148438,
        buffer: 0
    });
    layer.events.on({
        'selectionchange': onSelectionChange
    });
    map.addLayer(layer);

//    var click = new OpenLayers.Control.Click({layer: layer});
//    map.addControls([click]);
    map.setCenter(
        new OpenLayers.LonLat(5.9, 45.6).transform(
            new OpenLayers.Projection('EPSG:4326'),
            map.getProjectionObject()
        ), 12
    );    

    // Map section
    $('#maptag').html('Any tag');
    var currentTagsList = $('<ul>', {
        text: 'Display validated tiles for the following tags:',
        'class': 'tags'
    }).appendTo('#maptags');
    $.each(frequentTags, function(index, tag) {
        var link = $("<a>", {
            href: "javascript:void(0);",
            click: function() {
                changeMapTag(tag);
            },
            text: tag
        });
        $('<li>')
        .append(link)
        .appendTo(currentTagsList);
    });
    $('<p>Or for one of your choice:</p>')
        .appendTo('#maptags');
    $("<input>", {
        type: "text",
        focusout: function() {
            changeMapTag(this.value);
        }
    }).appendTo('#maptags');
}

function changeMapTag(tag) {
    layer.changeTag(tag);
    $('#maptag').html(tag);
}
