+++
title = "Stats"
+++

This is a simple report of my blog content. It is not dynamic (I generated the 
data last 2017). Do not view source - the code is crap.

<div id="chart_div"></div>
<div id="chart_month"></div>

<h2>Category Data (This Year)</h2>
<table>
    <thead>
    <tr>
        <th>Category</th>
        <th>Count</th>
    </thead>
    <tbody id="categoryDataThisYear"></tbody>    
</table>

<h2>Tag Data (This Year)</h2>

<table>
    <thead>
    <tr>
        <th>Tag</th>
        <th>Count</th>
    </thead>
    <tbody id="tagDataThisYear"></tbody>    
</table>

<h2>Category Data (All Time)</h2>
<table>
    <thead>
    <tr>
        <th>Category</th>
        <th>Count</th>
    </thead>
    <tbody id="categoryData"></tbody>    
</table>

<h2>Tag Data (All Time)</h2>

<table>
    <thead>
    <tr>
        <th>Tag</th>
        <th>Count</th>
    </thead>
    <tbody id="tagData"></tbody>    
</table>

<h2>Misc Data</h2>

<table>
    <thead>
    <tbody id="miscData"></tbody>    
</table>

<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
<script type="text/javascript">

function monthAsString(x) {
    var labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return labels[x];
}

// literally pasted
data = { years: 
   { '2003': 222,
     '2004': 186,
     '2005': 575,
     '2006': 739,
     '2007': 824,
     '2008': 605,
     '2009': 500,
     '2010': 396,
     '2011': 408,
     '2012': 343,
     '2013': 296,
     '2014': 272,
     '2015': 252,
     '2016': 148,
     '2017': 152 },
  months: [ 481, 475, 489, 466, 525, 484, 507, 538, 488, 490, 504, 471 ],
  posts: 5918,
  categories: 
   { misc: 1169,
     coldfusion: 3132,
     development: 802,
     books: 42,
     movies: 36,
     'video games': 77,
     adoption: 14,
     music: 12,
     flex: 189,
     uncategorized: 15,
     javascript: 647,
     jquery: 329,
     mobile: 494,
     html5: 274,
     design: 32,
     games: 5,
     'static sites': 10,
     television: 1,
     serverless: 82,
     developer: 1 },
  tags: 
   { 'front-end-interview-questions': 3,
     bluemix: 22,
     mobilefirst: 25,
     ionic: 89,
     cordova: 64,
     phonegap: 2,
     harpjs: 1,
     strongloop: 15,
     swift: 1,
     nodejs: 21,
     nativescript: 5,
     javascript: 33,
     windows: 7,
     html5: 2,
     loopback: 4,
     'advent of code': 10,
     openwhisk: 81,
     'visual studio code': 3,
     jekyll: 2,
     alexa: 8,
     hugo: 1,
     watson: 3,
     development: 1,
     vuejs: 14,
     pwa: 1,
     webpack: 1 },
  wordCount: 1991175,
  wordCountThisYear: 144837,
  categoriesThisYear: 
   { serverless: 81,
     mobile: 7,
     coldfusion: 3,
     javascript: 19,
     development: 37,
     misc: 4,
     'static sites': 6,
     developer: 1,
     html5: 1,
     books: 2,
     movies: 2,
     music: 1,
     'video games': 1 },
  tagsThisYear: 
   { openwhisk: 80,
     ionic: 6,
     loopback: 1,
     windows: 3,
     'visual studio code': 3,
     nodejs: 5,
     jekyll: 2,
     alexa: 8,
     cordova: 2,
     hugo: 1,
     html5: 1,
     watson: 3,
     javascript: 22,
     development: 1,
     vuejs: 14,
     pwa: 1,
     webpack: 1,
     'advent of code': 1 },
  avgWordCount: 336.4607975667455,
  avgWordCountThisYear: 952.875 }


    //rewrite data.years
    var newYears = [];
    Object.keys(data.years).forEach(function(year) {
        newYears.push([year,data.years[year]]);
    });

    //rewrite data.months
    var newMonths = [];
    Object.keys(data.months).forEach(function(month) {
        newMonths.push([monthAsString(month),data.months[month]]);
    });

    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Year');
        data.addColumn('number', 'Posts');
        data.addRows(newYears);

        // Set chart options
        var options = {'title':'Posts Per Year',
                        'width':600,
                        'height':500};

        var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
        chart.draw(data, options);

        // Month Chart

        // Create the data table.
        var data2 = new google.visualization.DataTable();
        data2.addColumn('string', 'Month');
        data2.addColumn('number', 'Posts');
        data2.addRows(newMonths);

        // Set chart options
        var options = {'title':'Posts Per Month',
                        'width':600,
                        'height':500};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.BarChart(document.getElementById('chart_month'));
        chart.draw(data2, options);

    }

    var formatter;
    if(window.Intl) {
        formatter = new Intl.NumberFormat();
    } else {
        formatter = {
            format:function(x) { return x; }
        };
    }

    //sort categories
    var sortedCats = Object.keys(data.categories).sort(function(a, b) {
        if(data.categories[a] < data.categories[b]) return 1;
        if(data.categories[a] > data.categories[b]) return -1;
        return 0;
    });

    var catDiv = document.querySelector('#categoryData');
    sortedCats.forEach(function(cat) {
        var html = '<tr><td>'+cat+'</td><td>'+formatter.format(data.categories[cat])+'</td></tr>';
        catDiv.innerHTML += html;
    });

    //sort tags
    var sortedTags = Object.keys(data.tags).sort(function(a, b) {
        if(data.tags[a] < data.tags[b]) return 1;
        if(data.tags[a] > data.tags[b]) return -1;
        return 0;
    });

    var tagDiv = document.querySelector('#tagData');
    sortedTags.forEach(function(tag) {
        var html = '<tr><td>'+tag+'</td><td>'+formatter.format(data.tags[tag])+'</td></tr>';
        tagDiv.innerHTML += html;
    });

    //new logic for This Year
    //sort categories
    sortedCats = Object.keys(data.categoriesThisYear).sort(function(a, b) {
        if(data.categoriesThisYear[a] < data.categoriesThisYear[b]) return 1;
        if(data.categoriesThisYear[a] > data.categoriesThisYear[b]) return -1;
        return 0;
    });

    catDiv = document.querySelector('#categoryDataThisYear');
    sortedCats.forEach(function(cat) {
        var html = '<tr><td>'+cat+'</td><td>'+formatter.format(data.categoriesThisYear[cat])+'</td></tr>';
        catDiv.innerHTML += html;
    });

    //sort tags
    sortedTags = Object.keys(data.tagsThisYear).sort(function(a, b) {
        if(data.tagsThisYear[a] < data.tagsThisYear[b]) return 1;
        if(data.tagsThisYear[a] > data.tagsThisYear[b]) return -1;
        return 0;
    });

    tagDiv = document.querySelector('#tagDataThisYear');
    sortedTags.forEach(function(tag) {
        var html = '<tr><td>'+tag+'</td><td>'+formatter.format(data.tagsThisYear[tag])+'</td></tr>';
        tagDiv.innerHTML += html;
    });
    

    var misc = `
    <tr><td>Total Posts:</td><td>${formatter.format(data.posts)}</td></tr>
    <tr><td>Total Words:</td><td>${formatter.format(data.wordCount)}</td></tr>
    <tr><td>Average Words Per Post:</td><td>${formatter.format(data.avgWordCount)}</td></tr>
    <tr><td>Total Words (This Year):</td><td>${formatter.format(data.wordCountThisYear)}</td></tr>
    <tr><td>Average Words Per Post (This Year):</td><td>${formatter.format(data.avgWordCountThisYear)}</td></tr>
    `;
    document.querySelector('#miscData').innerHTML = misc;
</script>