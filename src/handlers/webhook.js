import { constructGhReleasesGChatMessage, constructGChatUrl } from '../utils/gchat'

export default async request => {
  try {
    const { headers, url } = request;
    const contentType = headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw 'wrong content-type';
    }
    const body = JSON.stringify(await request.json())
    const { zen, action, release } = JSON.parse(body)
    const prefix_text = `An new releases was ${action}:`

    if (zen !== undefined || action != "released") {
      return new Response('OK')
    }

    const blocks = constructGhReleasesGChatMessage(release, prefix_text)
    const gchatWebhookUrl = constructGChatUrl(url)

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