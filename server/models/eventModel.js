import { pool } from '../config/db.js';

const Event = {
  async create({ sessionId, participantId, type, severity, metadata }) {
    await pool.execute(
      'INSERT INTO events (session_id, participant_id, type, severity, occurred_at, metadata) VALUES (?, ?, ?, ?, NOW(), ?)',
      [sessionId, participantId, type, severity, JSON.stringify(metadata)]
    );
  },

  async recent(sessionId, limit = 50) {
    const [rows] = await pool.execute(
      `SELECT e.id, e.type, e.severity, e.occurred_at, e.metadata, p.display_name AS name
       FROM events e JOIN participants p ON p.id = e.participant_id
       WHERE e.session_id = ? ORDER BY e.id DESC LIMIT ${Number(limit)}`,
      [sessionId]
    );
    return rows;
  },

  async latestTabs(sessionId) {
    const [rows] = await pool.execute(
      `SELECT participant_id, type, metadata FROM events
       WHERE id IN (
         SELECT MAX(id) FROM events
         WHERE session_id = ? AND type IN ('tab_switch','ai_site_open')
         GROUP BY participant_id
       )`,
      [sessionId]
    );
    return rows;
  },
};

export default Event;