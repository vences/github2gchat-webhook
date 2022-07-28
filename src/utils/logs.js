import { readSentryID, readSentryKey } from '../config.js'

export async function postLog(message, data) {
  const sentry_key = readSentryKey()
  const sentry_id = readSentryID()
  if (sentry_id === undefined || sentry_id == "" || sentry_key === undefined || sentry_key == "") {
    return false;
  }
  const date = new Date(Date.now).toLocaleDateString()
  const sentryUrl = `https://sentry.io/api/${sentry_id}/store/`
  const uuid = crypto.randomUUID()
  return fetch(sentryUrl, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'X-Sentry-Auth': `Sentry sentry_version=7, sentry_timestamp=${date}, sentry_key=${sentry_key}, sentry_client=workers`
    },
    body: `{"event_id": "${uuid}", "message": "${message}", "extra": ${data}}`,
  });
}