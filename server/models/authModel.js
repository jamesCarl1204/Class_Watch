import { pool } from '../config/db.js';

const Teacher = {
  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT id, username, email, password_hash FROM teachers WHERE email = ? LIMIT 1',
      [email]
    );
    return rows[0] ?? null;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, username, email, created_at FROM teachers WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] ?? null;
  },

  async create({ username, email, passwordHash }) {
    const [result] = await pool.execute(
      'INSERT INTO teachers (username, email, password_hash, created_at) VALUES (?, ?, ?, NOW())',
      [username, email, passwordHash]
    );
    return { id: result.insertId, username, email };
  },
};

export default Teacher;