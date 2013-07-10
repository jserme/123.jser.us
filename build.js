#!/usr/bin/env node

var jade = require('jade');
var fs = require('fs');
var path = require('path');

var data = {};

data.buildDate = getCurDate();
data.tags = {};

var fileCount;

var DATAFOLDER = "./data";
var TEMPLATEFILE = "./template.jade";
var DSTFILE = "./index.html";

function prePaddingNum(num, count) {
    var baseNum = Math.pow(10, count - 1);
    if (parseInt(num, 10) < baseNum) {
        return (baseNum + '').slice(1) + '' + num;
    } else {
        return num;
    }
}

function getCurDate() {
    var d = new Date();
    return d.getFullYear() + '-' + prePaddingNum(d.getMonth() + 1, 2) + '-' + prePaddingNum(d.getDate(), 2) + ' ' + prePaddingNum(d.getHours(), 2) + ':' + prePaddingNum(d.getMinutes(), 2) + ':' + prePaddingNum(d.getSeconds(), 2);
}

function parseTmpl() {
    fs.readFile(TEMPLATEFILE, 'utf8', function(err, tmpl) {
        //var fn = jade.compile(tmpl, {pretty : true});
        var fn = jade.compile(tmpl, {
            pretty: true
        });

        var keyArry = [];
        for (var key in data.tags) {
            keyArry.push(key);

            //保证顺序
            data.tags[key] = data.tags[key].sort(function(a, b) {
                return a.name < b.name;
            });
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

fs.readdir(DATAFOLDER, function(err, files) {
    fileCount = files.length;
    files.forEach(function(v, i) {
        fs.readFile(path.join(DATAFOLDER, v), 'utf8', function(err, j) {
            var siteName, o, tags;
            //siteName = v.replace(/\.json$/, '');
            o = eval('(' + j.trim() + ')');
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
