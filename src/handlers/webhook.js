import { constructGhReleasesGChatMessage, constructGChatUrl, constructPingGChatMessage } from '../utils/gchat'

export default async request => {
  try {
    const { headers, url } = request;
    const contentType = headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw 'wrong content-type';
    }
    const body = JSON.stringify(await request.json())
    const { zen, action, release, hook } = JSON.parse(body)
    const prefix_text = `An new releases was ${action}:`
    const gchatWebhookUrl = constructGChatUrl(url)
    let blocks;

    if (zen !== undefined) {
      blocks = constructPingGChatMessage(hook)
    } else if (action == "released") {
      blocks = constructGhReleasesGChatMessage(release, prefix_text)
    } else {
      return new Response('Not yet supported', { status: 500 })
    }

    if (gchatWebhookUrl === null) {
      throw 'error not enough params sent'
    }

    let response = await fetch(gchatWebhookUrl, {
      body: JSON.stringify(blocks),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    console.log(response.status)
    console.log(JSON.stringify(await response.json()))

    return new Response('OK')
  } catch (err) {
    return new Response(err, { status: 500 })
  }
}