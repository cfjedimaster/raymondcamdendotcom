
{
	"title": "Need a Test SMTP Server?",
	"date": "2016-08-09T16:44:00-07:00",
	"categories": [
		"Development"
	],
	"tags": [],
	"url": "/2016/08/09/need-a-test-smtp-server"
}

I always feel bad when I blog something I've tweeted about, but then I remind myself that some folks have (wisely) avoided the trap that is Twitter addiction or may simply have missed it. Earlier this week I was doing some work for a client using [Lucee](http://lucee.org/) (I'm trying to ween myself off ACF completely) and ran into an issue trying to read emails generated by the code. No matter what I tried, I couldn't find the temporary mail files generated by the back end code. I knew multiple different SMTP testing servers existed, but I hadn't installed one in a while. I did a quick Google and came across [MailDev](https://www.npmjs.com/package/maildev).

MailDev is a quick install via npm but obviously doesn't matter if you use Node, ColdFusion, or PHP for your back end. You simply install it and then type <code>maildev</code> in your Terminal/Command Prompt.

![Maildev](https://static.raymondcamden.com/images/2016/08/maildev1.jpg) 

Notice this gives you both a SMTP server *and* a web interface!

![Maildev](https://static.raymondcamden.com/images/2016/08/maildev2.jpg) 

And not just a web interface, a pretty snazzy one. As soon as mail shows up, it alerts you and auto updates. The reader is nice and simple.

![Maildev](https://static.raymondcamden.com/images/2016/08/maildev3.jpg) 

Note that the email being displayed there is a diagnostic one and kinda ugly. That's not MailDev's fault. 

On top of being a simple SMTP test server, it can also relay email and be used within a Node.js application as well. 

<pre><code class="language-javascript">var MailDev = require('maildev');
 
var maildev = new MailDev();
 
maildev.listen();
 
maildev.on('new', function(email){
  // We got a new email! 
});</code></pre>

Anyway - I thought this was just darn tootin' nice and thought I'd share.