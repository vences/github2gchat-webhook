/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import webhook, { fetchAndPost } from './handlers/webhook'
import Router from './handlers/router'
import { pushSentryKey, pushSentryID } from './config.js'

export default {
  async fetch(request, env) {
    pushSentryKey(env.Sentry_Key)
    pushSentryID(env.Sentry_ID)
    const r = new Router()
    r.post('/webhook', webhook)

    let response = await r.route(request)

    if (!response) {
      response = new Response('Not found', { status: 404 })
    }
  
    return response
  },
  async scheduled(controller, environment, context) {
    pushSentryKey(env.Sentry_Key)
    pushSentryID(env.Sentry_ID)
    context.waitUntil(fetchAndPost(environment))
  }
};
