/*
Step one - read all the md files in content/post
We assume yyyy/mmmm/dd
*/

var fs = require('fs');
var path = './content/post/';
console.log('Scan '+path);

var data = {
	years:{},
	months:[],
	posts:0,
	categories:{},
	tags:{},
	wordCount:0,
	wordCountThisYear:0,
	categoriesThisYear:{},
	tagsThisYear:{}
};

let thisYear = new Date().getFullYear();

years = fs.readdirSync(path);
years.forEach((year) => {
	//console.log('working on '+year);
	data.years[year] = 0;
	months = fs.readdirSync(path+year);
	months.forEach((month) => {
		let bareMonth = Number(month)-1;
		if(!data.months[bareMonth]) data.months[bareMonth] = 0;

		//console.log('working on '+month);
		days = fs.readdirSync(path+year+'/'+month);
		days.forEach((day) => {
			posts = fs.readdirSync(path+year+'/'+month+'/'+day);
			data.posts += posts.length;
			data.years[year] += posts.length;
			data.months[bareMonth] += posts.length;
			posts.forEach((file) => {
				let content = fs.readFileSync(path+year+'/'+month+'/'+day+'/'+file,"utf8");
				// get the front matter
				let closingBracket = content.indexOf("}", 1);
				let fm = content.substring(0, closingBracket+1);
				let rest = content.replace(fm, '');

				let fmData = JSON.parse(fm);
				if(fmData.categories) {
					fmData.categories.forEach((cat) => {
						cat = cat.toLowerCase();
						if(!data.categories[cat]) data.categories[cat] = 0;
						data.categories[cat]++;
						if(year == thisYear) {
							if(!data.categoriesThisYear[cat]) data.categoriesThisYear[cat] = 0;
							data.categoriesThisYear[cat]++;								
						}
					});
				}
				if(fmData.tags) {
					fmData.tags.forEach((tag) => {
						tag = tag.toLowerCase();
						if(!data.tags[tag]) data.tags[tag] = 0;
						data.tags[tag]++;
						if(year == thisYear) {
							if(!data.tagsThisYear[tag]) data.tagsThisYear[tag] = 0;
							data.tagsThisYear[tag]++;
						}	
					});
				}

				data.wordCount += rest.split(' ').length;
				if(year == thisYear) {
					data.wordCountThisYear += rest.split(' ').length;					
				}
			});
		});
	});

});

data.avgWordCount = data.wordCount / data.posts;
data.avgWordCountThisYear = data.wordCountThisYear / data.years[thisYear];

console.log(data);