/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import webhook from './handlers/webhook'
import Router from './handlers/router'

export default {
  async fetch(request) {
    const r = new Router()
    r.post('/webhook', webhook)

    let response = await r.route(request)

    if (!response) {
      response = new Response('Not found', { status: 404 })
    }
  
    return response
    // try {
    //   const url = new URL(request.url)
    //   const method = request.method
    //   if (method == "POST" && url.pathname == '/webhook') {
    //     webhook(request);
    //   } else {
    //     return new Response('Not found', { status: 404 })
    //   }
    // } catch (err) {
    //   const errorText = 'unexpected error'
    //   return new Response(errorText, { status: 501 })
    // }
  },
};
