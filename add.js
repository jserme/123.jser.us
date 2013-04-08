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

const DATAPATH = './data';

function init() {
	rl.question("site  " + keyArry[i] + ' is:', function(answer) {
		rst[keyArry[i]] = answer;
		i++;

		if (i == keyArry.length) {
			fs.writeFile(path.join(DATAPATH, rst.name), JSON.stringify({
				description: rst.description,
				tags: rst.tags,
				url: rst.url
			}), function(err) {
				if (err) {
					throw err
                } 
			});

			i = 0;
			rst = {};
		}

		init();
	});
}

init();

