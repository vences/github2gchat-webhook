# Project goal

The goal of that project is to handle releases from github webhook and send it to a Gchat channel.

That project is mainly inspired from [worker-slack-bot](https://github.com/codewithkristian/workers-slack-bot).

## How to deploy?

Clone the repo and use `wrangler publish`. If you do not know wrangler please follow the guide [here](https://developers.cloudflare.com/workers/get-started/guide/). 

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/vences/github2gchat-webhook)

Then follow requirements described for the deployment option you want to go to:
- [Webhook mode](#deployment-as-a-webhook)
- [Monitoring mode](#deployment-as-a-monitoring-mode)

Additionaly you can follow logging instruction [here](logging-via-sentry) to monitor any error raised by your workers.

## How it works?

### :link: Deployment as a webhook

That deployment means you need to enter the webhook URL in Github that point to your Cloudflare Workers. You are leveraging the path `/webhook` and all the query string parameters expected by thta deployment (described below). In that mode, the Cloudflare Workers is a middelware to adapt the webhhok request sent by github into a webhook message understood by Google Chat. 

*Requirements in webhook mode:*

The Workers has a path `/webhook` that need to be used. 
In addition to that the Workers is using the google webhook schema. The current logic is used: 
`https://chat.googleapis.com/v1/spaces/<SPACE-ID>/messages?key=<KEY>&token=<TOKEN>`

The _SPACE-ID_, _KEY_ and _TOKEN_ has to be sent in order to handle the destination correctly

The following params are available:
- space: defined the space-id destination in Google. 
- key: defined the key for the Gchat destination.
- token: defined the token for the Gchat destination

Here an example of the final URL you have to configure in github to get webhook in GChat: `https://github2gchat-webhook.<subdomain>.workers.dev/webhook?space=<SPACE-ID>&key=<KEY>&token=<TOKEN>`

### :mag_right: Deployment as a monitoring mode

The monitoring mode leverage KV storage in Cloudflare and Workers Cron jobs in order to monitor specific RSS feed and post any update in a Gchat via a webhooks. 

*Requirements in webhook mode:*

In order to use that mode, you have to:

1. Configure a KV store and bind it to your workers: `wrangler kv:namespace create KV`
2. Configure the structure use by the Workers in order to monitor an RSS feed. Here an example:
`wrangler kv:key put --binding=KV "webhooks" '[{"name": "Terraform Provider Cloudflare", "source": "https://github.com/cloudflare/terraform-provider-cloudflare/releases.atom", "destinations": ["https://chat.googleapis.com/v1/spaces/<SPACE_ID>/messages?key=<KEY>&token=<TOKEN>"]}]'`
Please not that the url should not be URL encoded, menaing you need to remove any excape characters like `\` and replace `%3D` by `=` for example. More info [here](https://www.w3schools.com/tags/ref_urlencode.ASP#:~:text=ASCII%20Encoding%20Reference). Otherwise the escape charactere is breaking the JSON object. 
3. Make sure you are using `htmlparser2` dependency. Run `npm install`.
4. (if needed) Change the default Cron triggers (set to 30 minutes in the [wrangler.toml](wrangler.toml) file) as described in the docs [here](https://developers.cloudflare.com/workers/platform/cron-triggers/)

The following structure has to be defined in the KV store:
- KV key: webhooks
- KV Value: an Array containing a JSON object with:
  - name: name of the webhook
  - source: RSS feed to monitor in my example I am taking RSS feed directly from github.
  - destinations: Array of Google Chat webhook on which any update are posted.

### :bell: Logging via Sentry

The project use Sentry as logging endpoint for every errors. 

*Requirements for logging:*

To redirect those error correctly you need to set-up `Sentry_Key` and `Sentry_ID` (if not specify no logging would be done). 
The steps are the following:
- `wrangler secret put Sentry_Key`: Defined your Sentry Key
- `wrangler secret put Sentry_ID`: Defined your Sentry ID

## Test locally

If you want to test locally, you have to follow the steps below:
1. Create a file `.dev.vars` at the root with the variable `Sentry_Key` and `Sentry_ID`.
2. Run the project with `wrangler dev`

## Final note

The current version of the [webhook mode](deployment-as-a-webhook) only handle `released` as an action as per the github doc [here](https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#release). 

When you add the webhook (in [webhook mode](deployment-as-a-webhook)), the Workers handles [ping](https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#ping) event and write a message in the destination chat channel. 

Enjoy! :tada: