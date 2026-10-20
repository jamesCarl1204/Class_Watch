import { pool } from '../config/db.js';

const Participant = {
  async upsert({ sessionId, studentId, name, tokenHash }) {
    await pool.execute(
      `INSERT INTO participants (session_id, student_id, display_name, join_token, joined_at, last_seen_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE
         display_name = VALUES(display_name),
         join_token   = VALUES(join_token),
         last_seen_at = NOW(),
         left_at      = NULL`,
      [sessionId, studentId, name, tokenHash]
    );
    const [rows] = await pool.execute(
      'SELECT id FROM participants WHERE session_id = ? AND student_id = ?',
      [sessionId, studentId]
    );
    return rows[0].id;
  },

  async findByTokenHash(hash) {
    const [rows] = await pool.execute(
      `SELECT p.id, p.session_id, s.status
       FROM participants p JOIN sessions s ON s.id = p.session_id
       WHERE p.join_token = ? LIMIT 1`,
      [hash]
    );
    return rows[0] ?? null;
  },

  async touch(id) {
    await pool.execute('UPDATE participants SET last_seen_at = NOW() WHERE id = ?', [id]);
  },

  async summaries(sessionId) {
    const [rows] = await pool.execute(
      `SELECT p.id, p.student_id, p.display_name AS name,
              (p.left_at IS NULL AND TIMESTAMPDIFF(SECOND, p.last_seen_at, NOW()) <= 20) AS online,
              SUM(e.type = 'tab_switch') AS switches,
              SUM(e.type = 'window_blur') AS blurs,
              SUM(e.type = 'paste' AND e.severity = 'critical') AS ai_pastes,
              SUM(e.type = 'ai_site_open') AS ai_opens
       FROM participants p
       LEFT JOIN events e ON e.participant_id = p.id
       WHERE p.session_id = ?
       GROUP BY p.id`,
      [sessionId]
    );
    return rows;
  },
};

export default Participant;  