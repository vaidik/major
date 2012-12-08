var tools = io.connect('http://localhost:8001/tools');

// joined in
tools.emit('join', { my: 'data' });

// when a tool is added
tools.on('create', function(data) {
    console.log('create', data);
    var dump = ds.dump();
    var dataKey = data.dataKey;
    delete data.dataKey;

    var found = 0;
    for (key in dump) {
        for (k in dump[key]) {
            if (dump[key][k].ID == data.ID) {
                found = 1;
                break;
            }
        }
    }

    if (!found) {
        var key = dataKey.toTitleCase().substr(0, dataKey.length-1);
        if (dataKey == 'objects') {
            var key = 'Obj';
        }
        var t = new planner[key](data);
        t.update({});
    }

    if ($('#editor-form > span').length) {
        $(this).remove();
        editor.wysiwyg_init();
    }
});

// when contents of a tool are updated
tools.on('update', function(data) {
    
    delete data.x;
    delete data.y;
    console.log('update', data);

    var obj = ds.getItem(data.ID);
    for (key in data) {
        obj.object[key] = data[key];
    }
    obj.update({});
    $('.item-name', obj.$dom).html(data.data.name);
});

// when a tool is removed
tools.on('remove', function(data) {
    console.log('remove', data);
    $('[data-id=' + data.ID + ']').remove();
    ds.deleteItem(data.ID);
    ds.save();
});

tools.on('move', function(data) {
    console.log('moved', data);
});
