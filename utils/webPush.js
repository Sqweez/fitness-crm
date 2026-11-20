// Notification + Push are missing on insecure origins (plain HTTP except localhost) and in older browsers
export const isWebPushSupported = () =>
  'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

export const registerServiceWorker = () => navigator.serviceWorker.register('/sw.js');

const urlBase64ToUint8Array = base64 => {
  const padded = (base64 + '='.repeat((4 - base64.length % 4) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(padded), char => char.charCodeAt(0));
};

export const subscribeToPush = (registration, publicKey) =>
  registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

// Backend body: subscription.toJSON() plus the encoding the browser supports
export const subscriptionPayload = subscription => ({
  ...subscription.toJSON(),
  content_encoding: PushManager.supportedContentEncodings.includes('aes128gcm') ? 'aes128gcm' : 'aesgcm',
});
