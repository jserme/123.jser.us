#!/usr/bin/env node

var jade = require('jade');
var fs = require('fs');
var path = require('path');
var df = require('dateformat');
var uglifyJS = require('uglify-js');
var cleanCSS = require('clean-css');


var DATAFOLDER = "./data/sites";
var INFO = "./data/info.json";
var INDEXS = "./data/indexs.json";

var TEMPLATE_INDEX = "./src/index.jade";
var DSTFILE = "./index.html";

var SRCJS = "./src/app.js";
var DSTJS = "./app-min.js";

var SRCCSS = "./src/style.css";
var DSTCSS = "./style-min.css";

var sortFunc = function(a, b) {
    return a.name < b.name;
};

var data = {};
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

function writeSiteInfo(info) {
    fs.writeFileSync(INFO, JSON.stringify(info), 'utf8');
    console.log('基本信息生成完成');
}


fs.readdir(DATAFOLDER, function(err, files) {
    var totalCount = files.length;
    var info = JSON.parse(fs.readFileSync(INFO));
    var updateCount = 0;

    files.forEach(function(v, i) {
        fs.readFile(path.join(DATAFOLDER, v), 'utf8', function(err, file) {
            if (!data || err) {
                throw (err);
            }

            var o, tags;
            o = JSON.parse(file);

            //一天内更新的算新增
            if ((new Date() - o.createAt) < 1 * 24 * 60 * 60 * 1000) {
                updateCount++;
            }

            tags = o.tags.split(/,| |，| /);
            tags.forEach(function(v, i) {
                if (data.tags[v] === undefined) {
                    data.tags[v] = [];
                }

                data.tags[v].push(o);
            });

            if (--totalCount === 0) {
                //更新网站信息
                info.lastUpdateCount = updateCount;
                if (updateCount > 0) {
                    info.lastUpdateDate = df(new Date(), 'yyyy-mm-dd hh:MM:ss');
                }

                if (files.length != info.totalCount) {
                    info.totalCount = files.length;
                }
                writeSiteInfo(info);

                data.info = info;
                parseTmpl();

            }
        });
    });
});

//最小化一下JS和CSS
fs.writeFile(DSTJS, uglifyJS.minify(SRCJS).code);
fs.writeFile(DSTCSS, cleanCSS.process(fs.readFileSync(SRCCSS, 'utf-8')));
