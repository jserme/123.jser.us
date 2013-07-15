var fs = require('fs');
var count = 0;
var folder = './data/sites/';
fs.readdir(folder, function(err, files) {
    files.forEach(function(v, i) {
        fs.readFile(folder + v, 'utf8', function(err, j) {
            var o = JSON.parse(j);
            o.createAt = +new Date();
            o.id = count++;
            o.name = v;
            fs.writeFile(folder + o.id + '.json', JSON.stringify(o), 'utf-8', function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('转换数据成功');
                }
            });

            fs.unlink(folder + v);
        });
    });
});
