#!/usr/bin/env node

var jade = require('jade');
var fs = require('fs');
var path = require('path');
var df = require('dateformat');
var uglifyJS = require('uglify-js');


var DATAFOLDER = "./data/sites";
var INFO = "./data/info.json";
var INDEXS = "./data/indexs.json";

var TEMPLATE_INDEX = "./src/index.jade";
var DSTFILE = "./index.html";

var SRCJS = "./src/app.js";
var DSTJS = "./app-min.js";

var sortFunc = function(a, b) {
    return a.name < b.name;
};

var totalCount;

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
                console.log('页面生成完毕!');
            }
        });
    });
}

//转为合法的JSON文件
function toJSONSync() {
    var files = fs.readdirSync(DATAFOLDER);
    totalCount = files.length;
    files.forEach(function(v, i) {
        var json = fs.readFileSync(path.join(DATAFOLDER, v), 'utf8');
        var o = eval('(' + json.trim() + ')');
        fs.writeFileSync(path.join(DATAFOLDER, v), JSON.stringify(o), 'utf8');
    });
}

function writeSiteInfo(info) {
    fs.writeFile(INFO, JSON.stringify(info), 'utf8', function(err) {
        if (!err) {
            console.log('基本信息生成完成');
        }
    });
}


fs.readdir(DATAFOLDER, function(err, files) {
    totalCount = files.length;
    var info = {
        totalCount: totalCount,
        lastUpdateDate: 'date',
        lastUpdateCount: '最新更新数量'
    };

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
            if (--totalCount === 0) {
                parseTmpl();
                writeSiteInfo(info);
            }
        });
    });
});

//最小化一下JS
fs.writeFile(DSTJS, uglifyJS.minify(SRCJS).code);
