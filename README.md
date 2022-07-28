# Project goal

The goal of that project is to handle releases from github webhook and send it to a Gchat channel.

That project is mainly inspired from [worker-slack-bot](https://github.com/codewithkristian/workers-slack-bot).

## How it works?

The Workers has a path `/webhook` that need to be used. 
As per the creation of a google webhook, the following schema is currently used:
`https://chat.googleapis.com/v1/spaces/<SPACE-ID>/messages?key=<KEY>&token=<TOKEN>`

The _SPACE-ID_, _KEY_ and _TOKEN_ has to be sent in order to handle the destination correctly

The following params are available:
- space: defined the space-id destination in Google. 
- key: defined the key for the Gchat destination.
- token: defined the token for the Gchat destination

Here an example of URL you have to configure in github to get webhook in GChat: `https://github2gchat-webhook.<subdomain>.workers.dev/webhook?space=<SPACE-ID>&key=<KEY>&token=<TOKEN>`

## How to deploy?

Clone the repo and use `wrangler publish`. If you do not know wrangler please follow the guide [here](https://developers.cloudflare.com/workers/get-started/guide/). 

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/vences/github2gchat-webhook)

### Logging via Sentry

The project use Sentry as logging endpoint for every errors, in order to redirect those error correctly you need to set-up `Sentry_Key` and `Sentry_ID` (if not specify no logging would be done). 
The steps are the following:
- `wrangler secret put Sentry_Key`: Defined your Sentry Key
- `wrangler secret put Sentry_ID`: Defined your Sentry ID

## Test locally

1. Create a file `.dev.vars` at the root with the variable `Sentry_Key` and `Sentry_ID`.
2. Run the project with `wrangler dev`

## Note

The current version only handle `released` as an action as per the github doc [here](https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#release). 

When you add the webhook, the Workers handles [ping](https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#ping) event and write a message in the destination chat channel. 

Enjoy!
