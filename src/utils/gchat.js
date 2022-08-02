const compact = array => array.filter(el => el)

export const constructGhReleasesGChatMessage = (release, prefix_text) => {
  const release_link = `<${release.html_url}>`
  const user_link = `<${release.author.html_url}|${release.author.login}>`
  const date = new Date(Date.parse(release.created_at)).toLocaleDateString()

  const text_lines = [
    `*${prefix_text}*`,
    `*${release.target_commitish}*: ${release.tag_name} - ${release_link}`,
    release.body,
    `Created by ${user_link} on ${date}`,
  ]

  return {
      text: compact(text_lines).join('\n'),
    };
}

export const constructPingGChatMessage = (hook) => {
  const date = new Date(Date.parse(hook.created_at)).toLocaleDateString()

  const text_lines = [
    `*Webhooks status:* ${hook.active}`,
    `Created on ${date}`,
  ]

  return {
      text: compact(text_lines).join('\n'),
    };
}

export const constructSimpleGChatMessage = (title, body) => {
  const text_lines = [
    `*${title}*`,
    `${body}`,
  ]

  return {
      text: compact(text_lines).join('\n'),
    };
}

export const constructGChatUrl = (url) => {
  const params = new URL(url).searchParams;
  if (params !== undefined && params.has("space") && params.has("key") && params.has("token")) {
    const space = params.get("space");
    const key = params.get("key");
    const token = params.get("token");
    return `https://chat.googleapis.com/v1/spaces/${space}/messages?key=${key}&token=${token}`;
  }

  return null;
}