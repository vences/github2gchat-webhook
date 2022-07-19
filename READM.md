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

## How to deploy?

Clone the repo and use `wrangler publish`. If you do not know wrangler please follow the guide [here](https://developers.cloudflare.com/workers/get-started/guide/). 

## Note

The current version only handle `released` as an action as per the github doc [here](https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#release). 

When you add the webhook, the Workers handles [ping](https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#ping) event and just return a 200 reponse code. 

Enjoy!
