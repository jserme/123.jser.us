#!/usr/bin/env node

var readline = require('readline');
var fs = require('fs');
var path = require('path');

var keyArry = ['站点名', '描述', '网站', '标签'];

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var i = 0;
var rst = {};

var DATAPATH = './data';

function init() {
    rl.question("网站的  " + keyArry[i] + ' 是:', function(answer) {
        rst[keyArry[i]] = answer;
        i++;

        if (i == keyArry.length) {
            fs.writeFile(path.join(DATAPATH, rst.name), JSON.stringify({
                description: rst.description,
                tags: rst.tags,
                url: rst.url,
                createAt: new Date()
            }), function(err) {
                if (err) {
                    throw err;
                }
            });

            i = 0;
            rst = {};
        }

        init();
    });
}

init();
