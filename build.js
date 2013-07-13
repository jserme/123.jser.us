#!/usr/bin/env node

var jade = require('jade');
var fs = require('fs');
var path = require('path');
var df = require('dateformat');
var uglifyJS = require('uglify-js');

var fileCount;

var DATAFOLDER = "./data/sites/";
var TEMPLATE_INDEX = "./src/index.jade";
var DSTFILE = "./index.html";

var SRCJS = "./src/app.js";
var DSTJS = "./app-min.js";

var SRCCSS = './src/style.css';
var DSTCSS = './style.css';

var sortFunc = function(a, b) {
    return a.name < b.name;
};

var data = {};

data.buildDate = df(new Date(), 'yyyy-mm-dd hh:MM:ss');
data.tags = {};


function parseTmpl() {
    fs.readFile(TEMPLATE_INDEX, 'utf8', function(err, tmpl) {
        var fn = jade.compile(tmpl, {
            //pretty: true
        });

        var keyArry = [];
        for (var key in data.tags) {
            keyArry.push(key);

            //保证顺序
            data.tags[key] = data.tags[key].sort(sortFunc);
        }

        //保证顺序
        data.keyArry = keyArry.sort();

        fs.writeFile(DSTFILE, fn(data), 'utf-8', function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log('cool! u got it!');
            }
        });
    });
}

//转为合法的JSON文件

//function toJSONSync() {
//    var files = fs.readdirSync(DATAFOLDER);
//    fileCount = files.length;
//    files.forEach(function(v, i) {
//        var json = fs.readFileSync(path.join(DATAFOLDER, v), 'utf8');
//        var o = eval('(' + json.trim() + ')');
//        fs.writeFileSync(path.join(DATAFOLDER, v), JSON.stringify(o), 'utf8');
//    });
//}

fs.readdir(DATAFOLDER, function(err, files) {
    fileCount = files.length;
    files.forEach(function(v, i) {
        fs.readFile(path.join(DATAFOLDER, v), 'utf8', function(err, j) {
            if (!j || err) {
                throw (err);
            }

            var siteName, o, tags;
            o = JSON.parse(j);
            o.name = v;

            tags = o.tags.split(/,| |，| /);
            tags.forEach(function(v, i) {
                if (data.tags[v] === undefined) {
                    data.tags[v] = [];
                }

                data.tags[v].push(o);
            });
            if (--fileCount === 0) {
                parseTmpl();
            }
        });
    });
});

//最小化一下JS
fs.writeFile(DSTJS, uglifyJS.minify(SRCJS).code);

//copy css
fs.writeFile(DSTCSS, fs.readFileSync(SRCCSS, 'utf8'));
