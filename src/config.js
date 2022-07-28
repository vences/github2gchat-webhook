let Sentry_Key = ""
let Sentry_ID = ""

export function pushSentryKey(value) {
  Sentry_Key = value;
}

export function pushSentryID(value) {
  Sentry_ID = value;
}

export function readSentryKey() {
  return Sentry_Key;
}

export function readSentryID() {
  return Sentry_ID;
}