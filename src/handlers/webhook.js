import { constructGhReleasesGChatMessage, constructGChatUrl, constructPingGChatMessage, constructSimpleGChatMessage } from '../utils/gchat'
import { postLog } from '../utils/logs'
import { parseFeed } from 'htmlparser2';
import { dateDifference } from '../utils/utils'

export default async request => {
  try {
    const { headers, url } = request;
    const contentType = headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw '{"error": "wrong content-type"}';
    }
    const body = JSON.stringify(await request.json())
    const { zen, action, release, hook } = JSON.parse(body)
    const prefix_text = `An new releases was ${action}:`
    const gchatWebhookUrl = constructGChatUrl(url)
    let blocks;

    if (gchatWebhookUrl === null) {
      throw '{ "error": "error not enough params sent"}'
    }

    if (zen !== undefined) {
      blocks = constructPingGChatMessage(hook)
    } else if (action == "released") {
      blocks = constructGhReleasesGChatMessage(release, prefix_text)
    } else {
      const msg = `${action} - Not yet supported`
      const objRelease = JSON.stringify(release, (k, v) => v === undefined ? null : v)
      const objHook = JSON.stringify(hook, (k, v) => v === undefined ? null : v)
      await postLog(msg, `{"action": "${action}", "release": ${objRelease}, "hook": ${objHook}}`)
      return new Response(msg, { status: 500 })
    }

    let response = await fetch(gchatWebhookUrl, {
      body: JSON.stringify(blocks),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    if (response.status == 200) {
      return new Response('OK')
    } else {
      throw `${JSON.stringify(await response.json())}`
    }
  } catch (err) {
    await postLog('Error has been raised', err)
    return new Response(err, { status: 500 })
  }
}

export async function fetchAndPost(env) {
  try {
    const webhooks = await env.KV.get("webhooks", { type: "json" });

    if (webhooks == null) {
      throw '{"error": "webhooks or urls not configured in KV"}'
    }

    for (const webhook of webhooks) {
      const res = await fetch(webhook.source)
      console.log("Status: " + res.status)
      const txt = await res.text();
      const commits = parseFeed(txt).items;

      for (const commit of commits) {
        delete commit.media;

        const kv = await env.KV.get(commit.id);
    
        if (kv === null) {
          await postNew(env, webhook, commit);
        }
      }
    }
    return new Response("Ok")
  } catch (err) {
    await postLog('Error has been raised', err)
    return new Response(err, { status: 500 })
  }
}

async function postNew(env, webhook, commit) {
  const dateCommit = new Date(commit.pubDate);
  const today = new Date(Date.now())
  const diffDays = dateDifference(today, dateCommit)

  if (diffDays < 2) {
    const blocks = constructSimpleGChatMessage(`${webhook.name}: ${commit.title}`, commit.link)
    for (const webhookUrl of webhook.destinations) {
      let response = await fetch(webhookUrl, {
        body: JSON.stringify(blocks),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    
      if (response.status != 200) {
        throw `${JSON.stringify(await response.json())}`
      }
    }
  }
  await env.KV.put(commit.id, JSON.stringify(commit));
}