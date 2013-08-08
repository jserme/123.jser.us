#!/usr/bin/env node

var readline = require('readline');
var fs = require('fs');
var path = require('path');

var keyArry = ['name', 'description', 'url', 'tags'];

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var i = 0;
var rst = {};

var DATAPATH = './data/sites/';
var info = JSON.parse(fs.readFileSync('./data/info.json', 'utf-8'));

function init() {
    rl.question("the site " + keyArry[i] + ' is:', function(answer) {
        rst[keyArry[i]] = answer;
        i++;

        if (i == keyArry.length) {
            fs.writeFile(path.join(DATAPATH, (++info.totalCount) + '.json'), JSON.stringify({
                name : rst.name,
                id : info.totalCount++,
                description: rst.description,
                tags: rst.tags,
                url: rst.url,
                createAt: +new Date()
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
