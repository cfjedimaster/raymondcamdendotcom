{
	"title": "Simple Google Maps demo with Custom Markers - Followup",
	"categories": [
		"JavaScript"
	],
	"tags": [],
	"date": "2012-12-03T17:12:00+06:00",
	"url": "/2012/12/03/Simple-Google-Maps-demo-with-Custom-Markers-Followup",
	"guid": "4797"
}

This weekend I blogged (<a href="http://www.raymondcamden.com/index.cfm/2012/12/1/Simple-Google-Maps-demo-with-Custom-Markers">Simple Google Maps demo with Custom Markers</a>) a simple application that made use of Google's JavaScript Maps API to render custom markers. The data was based on a set of static locations and made use of Google's Geocoding API to translate the addresses into longitude/latitude pairs that could be drawn on a map. My demo worked great, but when the reader tried it out with real data (89 locations) he ran into a problem. Google's API was throttling him from making that many requests.
<!--more-->
Turns out he ran into the same thing I've run into before (<a href="http://www.raymondcamden.com/index.cfm/2009/12/15/Having-trouble-with-too-many-map-markers-and-CFMAP">Having trouble with too many map markers and CFMAP?</a>.) He figured out, as I did, that it made sense to simply do a one-time geocode of his addresses and make use of that instead. 

And frankly, even if you don't have 89 locations, it really is kinda of silly to constantly ask Google for address data for locations that aren't moving around. He asked if I could modify the code a bit to use long/lat data and I was glad to oblige.

<b>(As a quick aside: In my sample data you will see long/lat pairs along with static locations. The long/lat pairs may not match the actual addresses. I asked him for sample data and simply meshed it with my static list of four locations.)</b>

Let's take a look. The first thing I did was add the long/lat as data in my static array:

<script src="https://gist.github.com/4198704.js?file=gistfile1.js"></script>

Note that I'm keeping the address. That's used in the markers since most humans can't translate a longitude/latitude pair to a physical location. (Hell, I can't even remember which is which most of the time.)

The next change was simple - I just got rid of the geocoder call and its callback wrapper. In this code block you can see where I'm simply looping over the data and and using the static location in the marker.position value.

<script src="https://gist.github.com/4198720.js?file=gistfile1.js"></script>

And that's it. You can run this version by hitting the demo link below. It probably isn't that terribly faster in your desktop browser, but on a mobile device the savings would be much more important.

<a href="http://www.raymondcamden.com/demos/2012/dec/3/new5.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>