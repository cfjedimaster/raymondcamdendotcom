{
	"title": "An OpenWhisk Monitor/Alert POC",
	"date": "2017-06-27T14:54:00-07:00",
	"categories": [
		"Serverless"
	],
	"tags": ["openwhisk"],
	"url": "/2017/06/27/an-openwhisk-monitoralert-poc",
	"banner":"/images/banners/ow_alert.jpg"
}

A few weeks back I posted (<a href="https://www.raymondcamden.com/2017/06/16/monitoring-openwhisk-activity/">Monitoring OpenWhisk Activity</a>) about how you can monitor your OpenWhisk activity. One of the things I made note of is that it would be nice to have an "alert" system such that I could specify that if a certain action began performing poorly, I could get an alert. Now "poor" is a fairly nebulous term, but today I worked on a little demo that I'd like to share. It uses OpenWhisk itself to monitor your OpenWhisk actions, but in general, I'm more concerned about my code failing, or third party APIs failing, then OpenWhisk itself.

I began by creating a basic action that would return true if the action was acting up. Let me share the code and then I'll explain how it wors.

<pre><code class="language-javascript">&#x2F;*
For an action X
Taking all the activations I can get in one pull
Up from optional time Y
If the success rate is below Z% (default 100), 
return true
else return false

action: action to check
from: ms since epoch to start from, defaults to forever
rate: numeric value 0-100, defaults to 100
max: total # of activations, defaults to MAX_LIMIT
*&#x2F;

const openwhisk = require(&#x27;openwhisk&#x27;);
&#x2F;&#x2F; last time i checked, this was 200
const MAX_LIMIT = 200;

function main(args) {
	const ow = openwhisk();

	if(!args.action) {
		return {
			error:&#x27;Action argument not specified.&#x27;
		};
	}

	if(!args.from) {
		args.from = 0;
	}

	if(!args.rate) {
		args.rate = 100;
	}

	if(!args.max) {
		args.max = MAX_LIMIT;
	}

	console.log(`Checking action ${args.action} starting at time ${args.from} and expecting a success rate of ${args.rate}%`);

	let status = false;

	return new Promise( (resolve, reject) =&gt; {
		ow.activations.list({
			name:args.action,
			limit:args.max,
			since:args.from,
			docs:true
		}).then((results) =&gt; {
			&#x2F;&#x2F;early out
			if(results.length === 0) resolve({status:status, action:args.action});
			let total = results.length;

			let totalGood = results.reduce( (acc, val) =&gt; {
				if(val.response.success) return ++acc;
				return acc;
			},0);
			let successRate = Math.floor(totalGood&#x2F;total*100);
			console.log(`${total} activations, ${totalGood} good, for a rate of ${successRate}%`);
			if(successRate &lt; args.rate) status = true;
			resolve({status:status, action:args.action});
		}).catch(err =&gt; {
			console.log(&#x27;error&#x27;, JSON.stringify(err));
			reject({error:err});
		});
	});

}
</code></pre>

Alrighty - so the action expects the following arguments:

* First and foremost, the action to check. Note that the code uses activations to track action health and the last time I checked there was a bug with getting activations for an action in a package. Obviously if that is still a bug it's going to be fixed, but keep that in mind when using this code. 
* The `from` argument is the number of milliseconds from epoch to use as a filter for fetching data.
* The `max` argument is the total number of previous activations to check. In general, I'd expect people to use this over `from`, also, the value you use here will totally depend on your usage. So for example, if I have an action that runs hourly and if I want to check health every day in a CRON trigger, than I'd set max to 24. 
* The `rate` argument is a percentage value that represents healthy. It defaults to 100% which is probably too high, but again, it depends on your particular usage.

I use the OpenWhisk npm package. Note that I do not have to specify the authentication information since I'm instantiating it in the main function itself. This means it will pick up the authentication values for the account. I then fetch activations using the filters as described above. Note that there is a undocumented limit of 200 activations. You could get more (I document this <a href="https://www.raymondcamden.com/2017/05/15/my-own-openwhisk-stat-tool/">here</a>) but since you have control over how often this check runs, you can specify a schedule that will ensure you don't run into that problem. 

Once I have my activations, I loop over, count up the good ones, and then use a bit of math to get the percentage. If you are too low, then we are in error. I called this action, `isBad`, and I know it's kinda bad to use a negative like this. In this case, the true status of this action implies we've got a problem and that kinda makes sense to me, but I could also see building this as `isGood` and reversing the results. The "Clean Code" part of me felt bad about this but the "Get er Done" part of me told it to shut the front door. 

Note that I return a status and the action requested. I could have also returned the total and total good values as well.

So in theory... that's mainly it. A person using this would combine this with another action to handle the result and do something. So for my first example, I combined it with a simple email action:

<pre><code class="language-javascript">&#x2F;*
requires:
    email (will be used for to&#x2F;from)
    action (name)
    sgkey (sendgrid key)

I send a hard coded message saying args.action has failed

Note - since we can&#x27;t do conditional actions in sequences, this
action leaves early if status:false
*&#x2F;

const helper = require(&#x27;sendgrid&#x27;).mail;

function main(args) {

    if(!args.status) return {result:0};

	let SG_KEY = args.SG_KEY;

	let from_email = new helper.Email(&#x27;raymondcamden@gmail.com&#x27;);
	let to_email = new helper.Email(args.email);
	let subject = &#x27;Failure Rate Alert: &#x27;+args.action;

    let mainTemplate = `
The action, ${args.action}, has fallen beneath its desired success rate.
Take action!
`;

    let mailContent = new helper.Content(&#x27;text&#x2F;html&#x27;, mainTemplate);
    let mail = new helper.Mail(from_email, subject, to_email, mailContent);

    let sg = require(&#x27;sendgrid&#x27;)(SG_KEY);
    
    var request = sg.emptyRequest({
        method: &#x27;POST&#x27;,
        path: &#x27;&#x2F;v3&#x2F;mail&#x2F;send&#x27;,
        body: mail.toJSON()
    });

    return new Promise((resolve, reject) =&gt; {
        sg.API(request, function(error, response) {
            if(error) {
                console.log(&#x27;error in sg&#x27;, error.response.body);
                reject({error:error.message}) 
            } else {
                resolve({result:1});
            }
        });

    });

}
</code></pre>

In this action, I just use SendGrid to fire off an email. The template is incredibly simple. And here it is when executed (I fixed the typo with its/it's later):

![Email alert](https://static.raymondcamden.com/images/2017/6/alert1.jpg)

And then for the hell of it, I wrote up a Twilio action so I could send a SMS:

<pre><code class="language-javascript">&#x2F;*
as args, needs:
accountSid
authToken
to 
from

*&#x2F;
const twilio = require(&#x27;twilio&#x27;);

function main(args) {

    var client = new twilio(args.accountSid, args.authToken);
    let body = `The action, ${args.action}, has fallen beneath its desired success rate. Take action!`;

    return new Promise((resolve, reject) =&gt; {
        client.messages.create({
            body: body,
            to: args.to,  
            from: args.from
        })
        .then((message) =&gt; {
            resolve({result:1});
        })
        .catch(err =&gt; {
            console.log(err);
            reject({error:err});
        });
        
    });
}
</code></pre>

It requires your Twilio app auth info and a number to send to as well as a number to send from. And here is in action:

<img src="https://static.raymondcamden.com/images/2017/6/alert2a.jpg" title="SMS FTW" class="imgborder">

And that's basically it. To make this "live" I'd set up a CRON trigger and figure out how I want to be notified, but since my code is perfect, I don't have to worry about this. Woot! You can find the source for all three of these actions here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/alert
