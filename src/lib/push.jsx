// ── Web Push: subscription management (client side) ──────────
//
// Dormant until you paste your VAPID PUBLIC key below. Generate a pair
// with `npx web-push generate-vapid-keys` (see docs/PUSH_SETUP.md). The
// PRIVATE key never lives in the client — it's a secret on the
// smart-track-push Edge Function that actually sends the notifications.
//
// iOS note: Web Push only works in an INSTALLED PWA on iOS 16.4+, and the
// subscribe call must run from a user gesture (the Settings toggle does).

window.PUSH_VAPID_PUBLIC = ''; // <-- paste VAPID public key to enable push

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

// True only when push is actually usable: a VAPID key is configured AND
// the platform supports the APIs. The Settings toggle hides itself
// otherwise, so we never show a control that can't work.
window.pushSupported = () =>
  !!window.PUSH_VAPID_PUBLIC &&
  'serviceWorker' in navigator &&
  'PushManager' in window &&
  'Notification' in window;

// 'unsupported' | 'denied' | 'on' | 'off'
window.pushStatus = async () => {
  if (!window.pushSupported()) return 'unsupported';
  if (Notification.permission === 'denied') return 'denied';
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return sub ? 'on' : 'off';
  } catch (_) { return 'off'; }
};

window.pushSubscribe = async () => {
  if (!window.pushSupported()) throw new Error('Push not supported on this device');
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') throw new Error(window.isRTL ? 'لم يُمنح إذن الإشعارات' : 'Notification permission denied');
  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(window.PUSH_VAPID_PUBLIC),
    });
  }
  const json = sub.toJSON();
  // One row per browser endpoint; re-subscribing upserts.
  const { error } = await window.sb.from('push_subscriptions').upsert({
    user_id:  window.currentUserId,
    endpoint: sub.endpoint,
    p256dh:   json.keys.p256dh,
    auth:     json.keys.auth,
  }, { onConflict: 'endpoint' });
  if (error) throw error;
  return 'on';
};

window.pushUnsubscribe = async () => {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      try { await window.sb.from('push_subscriptions').delete().eq('endpoint', sub.endpoint); } catch (_) {}
      try { await sub.unsubscribe(); } catch (_) {}
    }
  } catch (_) {}
  return 'off';
};
