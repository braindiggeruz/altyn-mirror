// Compact, URL-safe-ish session id used inside Telegram start payload `am_<token>`.
// Format: am_<10-12 base36 chars>. Telegram start payload limit is 64 chars; we stay well under.

export function newToken(): string {
  const a = Math.floor(Math.random() * 0xffffffff).toString(36);
  const b = Date.now().toString(36).slice(-6);
  return ('am_' + (a + b)).slice(0, 18);
}

export function isValidToken(s: string | null | undefined): s is string {
  return !!s && /^am_[a-z0-9]{4,16}$/i.test(s);
}
