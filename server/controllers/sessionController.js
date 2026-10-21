import { randomBytes } from 'node:crypto';
import Session from '../models/sessionModel.js';
import Participant from '../models/participantModel.js';
import Event from '../models/eventModel.js';
import { newToken, hashToken } from '../utils/token.js';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const makeCode = () =>
  Array.from(randomBytes(6), (b) => ALPHABET[b % ALPHABET.length]).join('');


export async function start(req, res) {
  try {
    const name = String(req.body.name || '').trim().slice(0, 120) || 'Untitled session';
    await Session.endAllForTeacher(req.teacherId);

    let code;
    do { code = makeCode(); } while (await Session.findActiveByCode(code));

    const id = await Session.create({ teacherId: req.teacherId, name, code });
    res.status(201).json({ session: { id, name, code, status: 'active' } });
  } catch (err) {
    console.error('start error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function end(req, res) {
  try {
    const ok = await Session.end(req.params.id, req.teacherId);
    if (!ok) return res.status(404).json({ message: 'Active session not found' });
    res.json({ message: 'Session ended' });
  } catch (err) {
    console.error('end error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function active(req, res) {
  try {
    res.json({ session: await Session.findActiveByTeacher(req.teacherId) });
  } catch (err) {
    console.error('active error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}


export async function join(req, res) {
  try {
    const { code, name, studentId } = req.body;
    const session = await Session.findActiveByCode(String(code).toUpperCase());
    if (!session) return res.status(404).json({ message: 'Invalid or ended session code' });

    const token = newToken();
    await Participant.upsert({
      sessionId: session.id,
      studentId: String(studentId).trim(),
      name: String(name).trim(),
      tokenHash: hashToken(token),
    });
    res.json({ token, session: { name: session.name, code: session.code } });
  } catch (err) {
    console.error('join error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}


const TEXT = {
  tab_switch: (m) => `Switched to ${m.host || 'another tab'}`,
  window_blur: () => 'Left the browser window',
  window_focus: () => 'Returned to the window',
  copy: (m) => `Copied ${m.length ?? 0} characters`,
  paste: (m) =>
    m.suspicious
      ? `Suspicious paste: ${m.length} chars with little typing`
      : `Pasted ${m.length ?? 0} characters`,
  ai_site_open: (m) => `Opened AI site: ${m.host}`,
};

export async function live(req, res) {
  try {
    const session = await Session.findOwned(req.params.id, req.teacherId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const [rows, tabs, events] = await Promise.all([
      Participant.summaries(session.id),
      Event.latestTabs(session.id),
      Event.recent(session.id, 50),
    ]);

    const tabByP = new Map(tabs.map((t) => [t.participant_id, t]));

    const students = rows.map((s) => {
      const switches = Number(s.switches) || 0;
      const blurs = Number(s.blurs) || 0;
      const aiPastes = Number(s.ai_pastes) || 0;
      const aiOpens = Number(s.ai_opens) || 0;
      const copies =  Number(s.copies) || 0;
      const focusScore = Math.max(
        0,
        100 - switches * 3 - blurs * 2 - aiPastes * 15 - aiOpens * 10
      );
      const status =
        aiPastes || aiOpens || focusScore < 60 ? 'high' : focusScore < 80 ? 'warning' : 'normal';

      const tab = tabByP.get(s.id);
      return {
        id: s.student_id,
        name: s.name,
        initials: s.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase(),
        status,
        focusScore,
        currentTab: tab?.metadata?.host || '—',
        isAiTab: tab?.type === 'ai_site_open' || !!tab?.metadata?.isAi,
        switches,
        pastes: aiPastes,
        aiOpens,
        copies,
        timeAway: '—',
        online: !!Number(s.online),
        
      };
    });

    const sum = (k) => students.reduce((a, s) => a + s[k], 0);

    res.json({
      stats: {
        active: students.filter((s) => s.online).length,
        tabSwitches: sum('switches'),
        aiPastes: sum('pastes'),
        aiOpens: sum('aiOpens'),
        avgFocus: students.length ? Math.round(sum('focusScore') / students.length) : null,
      },
      students,
      events: events.map((e) => ({
        id: e.id,
        at: e.occurred_at,
        type: e.severity,
        student: e.name,
        text: (TEXT[e.type] ?? (() => e.type))(e.metadata ?? {}),
      })),
    });
  } catch (err) {
    console.error('live error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}