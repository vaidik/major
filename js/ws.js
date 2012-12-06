var tools = io.connect('http://localhost:8001/tools');

// joined in
tools.emit('join', { my: 'data' });

// when a tool is added
tools.on('create', function(data) {
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
    }
});

// when a tool is removed
tools.on('remove', function(data) {
    console.log('remove', data);
    $('[data-id=' + data.ID + ']').remove();
    ds.deleteItem(data.ID);
    ds.save();
});
