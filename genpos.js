#!/usr/bin/env node
var fs = require('fs');
if(process.argv.length < 3) {
	console.log('Usage: genpos TITLE [CATEGORIES] [TAGS]');
	process.exit(1);
}

var title = process.argv[2];

if(process.argv.length >= 4) { 
	categories = process.argv[3].split(',').map((cat) => {
		return '"' + cat + '"';
	}).join(',');
} else {
	categories = '"Uncategorized"';
}
if(process.argv.length >= 5) { 
	tags = process.argv[4].split(',').map((tag) => {
		return '"' + tag + '"';
	}).join(',');
} else {
	tags = "";
}

var now = new Date();
var year = now.getFullYear();
var month = String(now.getMonth()+1);
if(month.length == 1) month = '0' + month;
var day = String(now.getDate());
if(day.length == 1) day = '0' + day;

//2016-02-01T12:12:24-07:00
var hour = String(now.getHours());
if(hour.length == 1) hour = '0'+hour;
var minute = String(now.getMinutes());
if(minute.length == 1) minute = '0'+minute;
var date = year + '-'+month+'-'+day+'T'+hour+':'+minute+':00-07:00';

var slug = title.replace(/ /g,'-').toLowerCase();
//remove multiple -
slug = slug.replace(/-{2,}/,'-');
//remove non alnum
//slug = slug.replace(/[^A-Za-z\-]+/g,'');
slug = slug.replace(/[^\w\-]+/g,'');

//default template
var template = `{
	"title": "${title}",
	"date": "${date}",
	"categories": [
		${categories}
	],
	"tags": [${tags}],
	"url": "/${year}/${month}/${day}/${slug}"
}`;

//console.log(template);

//Try to make the folder
var path = './content/post/'+year+'/';
//console.log(path);
try {
	fs.accessSync(path,fs.F_OK);
} catch(e) {
	if(e.code === "ENOENT") {
		fs.mkdirSync(path);
	}
}

path = './content/post/'+year+'/'+month+'/';
try {
	fs.accessSync(path,fs.F_OK);
} catch(e) {
	if(e.code === "ENOENT") {
		fs.mkdirSync(path);
	}
}

path = './content/post/'+year+'/'+month+'/'+day;
console.log(path);
try {
	fs.accessSync(path,fs.F_OK);
} catch(e) {
	if(e.code === "ENOENT") {
		fs.mkdirSync(path);
	}
}

var fileName = slug + '.md';
if(fs.existsSync(path+'/'+fileName)) {
	console.log('POST NOT WRITTEN: '+path+'/'+fileName+ ' already exists.');
	process.exit();
}

fs.writeFileSync(path+'/'+fileName, template,'utf8');

console.log('Created '+path+'/'+fileName);