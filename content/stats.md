+++
title = "Stats"
+++

This is a simple report of my blog content. It is not dynamic (I generated the 
data on June 28, 2017). Do not view source - the code is crap.

<div id="chart_div"></div>
<div id="chart_month"></div>

<h2>Category Data</h2>
<table>
    <thead>
    <tr>
        <th>Category</th>
        <th>Count</th>
    </thead>
    <tbody id="categoryData"></tbody>    
</table>

<h2>Tag Data</h2>

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
     '2017': 82 },
  months: [ 481, 475, 489, 466, 525, 483, 496, 526, 479, 474, 494, 460 ],
  posts: 5848,
  categories:
   { misc: 1167,
     coldfusion: 3131,
     development: 773,
     books: 40,
     movies: 34,
     'video games': 76,
     adoption: 14,
     music: 11,
     flex: 189,
     uncategorized: 15,
     javascript: 637,
     jquery: 329,
     mobile: 493,
     html5: 274,
     design: 32,
     games: 5,
     'static sites': 9,
     television: 1,
     serverless: 51,
     developer: 1 },
  tags:
   { 'front-end-interview-questions': 3,
     bluemix: 22,
     mobilefirst: 25,
     ionic: 89,
     cordova: 63,
     phonegap: 2,
     harpjs: 1,
     strongloop: 15,
     swift: 1,
     nodejs: 19,
     nativescript: 5,
     javascript: 11,
     windows: 5,
     html5: 2,
     loopback: 4,
     'advent of code': 9,
     openwhisk: 50,
     'visual studio code': 2,
     jekyll: 1,
     hugo: 1 },
  wordCount: 1925160,
  avgWordCount: 329.1997264021888 };


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


    var misc = `
    <tr><td>Total Posts:</td><td>${formatter.format(data.posts)}</td></tr>
    <tr><td>Total Words:</td><td>${formatter.format(data.wordCount)}</td></tr>
    <tr><td>Average Words Per Post:</td><td>${formatter.format(data.avgWordCount)}</td></tr>
    `;
    document.querySelector('#miscData').innerHTML = misc;
</script>