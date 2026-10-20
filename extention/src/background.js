const API = 'http://localhost:3000/api';

const AI_DOMAINS = [
  'chatgpt.com', 'chat.openai.com', 'claude.ai', 'gemini.google.com',
  'copilot.microsoft.com', 'perplexity.ai',
];

const hostOf = (url) => {
  try { return new URL(url).hostname; } catch { return ''; }
};
const isAi = (h) => AI_DOMAINS.some((d) => h === d || h.endsWith('.' + d));

async function post(path, body = {}) {
  const { session } = await chrome.storage.local.get('session');
  if (!session?.token) return;

  try {
    const res = await fetch(API + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify(body),
    });
    if (res.status === 401 || res.status === 410) {
      await chrome.storage.local.remove('session');
    }
  } catch {
  }
}

const send = (type, detail = {}) => post('/events', { type, detail });

function reportTab(tab, switched) {
  const host = hostOf(tab.url ?? '');
  const ai = isAi(host);
  if (switched) send('tab_switch', { host, title: tab.title, isAi: ai });
  if (ai) send('ai_site_open', { host, title: tab.title });
}

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    reportTab(await chrome.tabs.get(tabId), true);
  } catch {  }
});

chrome.tabs.onUpdated.addListener((_id, info, tab) => {
  if (info.url && tab.active) reportTab(tab, false);
});

let blurred = false;
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    blurred = true;
    send('window_blur');
  } else if (blurred) {
    blurred = false;
    send('window_focus');
  }
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.kind === 'EVENT') {
    send(msg.type, { ...msg.detail, host: hostOf(sender.tab?.url ?? '') });
  } else if (msg.kind === 'HEARTBEAT') {
    post('/heartbeat');
  }
});