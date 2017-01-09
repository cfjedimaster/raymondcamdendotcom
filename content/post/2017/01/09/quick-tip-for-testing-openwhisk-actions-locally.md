
{
	"title": "Quick Tip for Testing OpenWhisk Actions Locally",
	"date": "2017-01-09T14:59:00-07:00",
	"categories": [
		"Serverless"
	],
	"tags": ["openwhisk"],
	"url": "/2017/01/09/quick-tip-for-testing-openwhisk-actions-locally"
}

I'd like to share a quick tip for working with [OpenWhisk](https://developer.ibm.com/openwhisk/). Credit for this goes to my coworker
[Carlos Santana](https://twitter.com/csantanapr?lang=en). When working with OpenWhisk, you need to deploy your code to the cloud
in order to test it. This is a very quick operation (and can be even quicker with the [Visual Studio Code extension](https://github.com/openwhisk/openwhisk-vscode) but it
can be a bit annoying if you are working on something complex. It would be cool if you could test directly on your machine without the 
'copy to OpenWhisk' command, right?

You can do this with two quick changes. First, modify your action to add the following code at the end:

<pre><code class="language-javascript">
/*
Only required for testing locally, running in OpenWhisk this get's ignored
Export main function only if its being use as a module (i.e. require(./sendEmail.js))
*/
if (require.main !== module) {
  module.exports = main;
}

</code></pre>

This is taken directly from Carlos' code. The comment makes it very clear what's happening - basically setting your main function as 
an export when run locally. Then, use this script. I have all my OpenWhisk stuff in one folder where I'm testing, so I called this test.js:

<pre><code class="language-javascript">
const actionToRun = process.argv[2];

let params = {};
for(var i=3;i&lt;process.argv.length;i++) {
	let [name,value] = process.argv[i].split('=');
	params[name] = value;
}

const action = require(actionToRun);

action(params)
.then(result => console.log(result))
.catch(error => console.error(error));
</code></pre>

This too is code from Carlos although I modified it a bit to make it more generic. Now I can do this at the CLI to test:

	node ./test.js rsstest/main param1=paramvalue param2=paramblah

Of course, on the Mac, I could add the shell thingy on top so I could skip including "node " in front as well. (As far as I know you can't
do that on Windows.)

Anyway, I hope this helps!
