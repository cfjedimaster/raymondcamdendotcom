{
	"title": "BlogCFC 4.0.1",
	"categories": [
		"ColdFusion"
	],
	"tags": [],
	"date": "2005-11-28T17:11:00+06:00",
	"url": "/2005/11/28/BlogCFC-401",
	"guid": "942"
}

After a few bug fixes, I'm happy to announce a new version with actual new features in it - not just bug fixes. Here are the changes:

<ul>
<li>Fixed a bug with BlueDragon. BlueDragon has a render function, and since my CFC also had a method with the name, it didn't work. Simply changed it to renderEntry(). Hey New Atlanta, next time you add a feature, be sure it doesn't conflict with my blog ware! (Sorry, couldn't resiste. ;)
<li>The last update had a fix for MySQL/MSACCESS and a date format issue. <a href="http://www.sustainablegis.com/blog/cfg11n/">Paul Hasting</a> wrote a nice update to take care of this and a few other things as well.
<li>Ping support for Weblogs.com. Just use @weblogs in your ping list. Thanks to Rob Gonda.
<li>Another idea by Rob - the layout file now shows meta tags for TITLE and KEYWORDS. The blog.ini file now has a blogkeywords value to allow you to set this.
<li>Google Site Maps are officially supported.
<li>Few small bug fixex (see release notes)
<li>Word doc has been updated, and I'm now shipping a PDF version as well (which caused the zip to grow quite a bit :)
</ul>

You can download the software at the <a href="http://ray.camdenfamily.com/projects/blogcfc">project page</a>.

As always, please let me know if you have any feedback. If you love it - don't forget my <a href="http://www.amazon.com/o/registry/2TCL1D08EZEYE">wish list</a> (still no one has gotten the Nano, do you guys just not love me or something?) or my <a href="http://ipodnanos.freepay.com/?r=22637619">free IPod Nano</a> referer thingy. Thanks!