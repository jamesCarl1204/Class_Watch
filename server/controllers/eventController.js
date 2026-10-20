import Event from '../models/eventModel.js';
import Participant from '../models/participantModel.js';

const TYPES = new Set([
  'tab_switch', 'window_blur', 'window_focus', 'copy', 'paste', 'ai_site_open',
]);

// Linisin ang metadata galing sa extension (huwag magtiwala sa input)
function clean(m = {}) {
  const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : undefined);
  return {
    host: String(m.host ?? '').slice(0, 100),
    title: String(m.title ?? '').slice(0, 150),
    isAi: !!m.isAi,
    length: num(m.length),
    typedRecently: num(m.typedRecently),
  };
}

// Server ang nagpapasya ng severity, hindi ang extension
function classify(type, m) {
  if (type === 'ai_site_open') return 'critical';
  if (type === 'paste') {
    m.suspicious = (m.length ?? 0) > 150 && (m.typedRecently ?? 0) < 20;
    return m.suspicious ? 'critical' : 'warning';
  }
  if (type === 'tab_switch' || type === 'window_blur') return 'warning';
  return 'info';
}

export async function ingest(req, res) {
  try {
    const { type, detail } = req.body ?? {};
    if (!TYPES.has(type)) return res.status(400).json({ message: 'Unknown event type' });

    const metadata = clean(detail);
    const severity = classify(type, metadata);

    await Event.create({
      sessionId: req.participant.sessionId,
      participantId: req.participant.id,
      type,
      severity,
      metadata,
    });
    await Participant.touch(req.participant.id);
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('ingest error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function heartbeat(req, res) {
  try {
    await Participant.touch(req.participant.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('heartbeat error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}