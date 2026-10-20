let typed = [];

const send = (type, detail = {}) =>
  chrome.runtime.sendMessage({ kind: 'EVENT', type, detail }).catch(() => {});

document.addEventListener('keydown', (e) => {
  if (e.key.length !== 1) return;
  const now = Date.now();
  typed.push(now);
  typed = typed.filter((t) => now - t < 10000);
});

document.addEventListener('copy', () => {
  send('copy', { length: String(window.getSelection() ?? '').length });
});

document.addEventListener('paste', (e) => {
  const text = e.clipboardData?.getData('text') ?? '';
  const now = Date.now();
  const typedRecently = typed.filter((t) => now - t < 10000).length;
  send('paste', { length: text.length, typedRecently });
});

// Heartbeat para lumabas na "online" ang student
setInterval(() => {
  if (!document.hidden) chrome.runtime.sendMessage({ kind: 'HEARTBEAT' }).catch(() => {});
}, 5000);