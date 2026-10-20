import { pool } from '../config/db.js';

const Session = {
  async create({ teacherId, name, code }) {
    const [r] = await pool.execute(
      "INSERT INTO sessions (teacher_id, name, code, status, started_at) VALUES (?, ?, ?, 'active', NOW())",
      [teacherId, name, code]
    );
    return r.insertId;
  },

  async endAllForTeacher(teacherId) {
    await pool.execute(
      "UPDATE sessions SET status='ended', ended_at=NOW() WHERE teacher_id=? AND status='active'",
      [teacherId]
    );
  },

  async end(id, teacherId) {
    const [r] = await pool.execute(
      "UPDATE sessions SET status='ended', ended_at=NOW() WHERE id=? AND teacher_id=? AND status='active'",
      [id, teacherId]
    );
    return r.affectedRows > 0;
  },

  async findActiveByTeacher(teacherId) {
    const [rows] = await pool.execute(
      "SELECT id, name, code, status, started_at FROM sessions WHERE teacher_id=? AND status='active' ORDER BY id DESC LIMIT 1",
      [teacherId]
    );
    return rows[0] ?? null;
  },

  async findActiveByCode(code) {
    const [rows] = await pool.execute(
      "SELECT id, name, code FROM sessions WHERE code=? AND status='active' LIMIT 1",
      [code]
    );
    return rows[0] ?? null;
  },

  async findOwned(id, teacherId) {
    const [rows] = await pool.execute(
      'SELECT id, name, code, status FROM sessions WHERE id=? AND teacher_id=? LIMIT 1',
      [id, teacherId]
    );
    return rows[0] ?? null;
  },
};

export default Session;