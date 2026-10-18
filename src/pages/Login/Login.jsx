import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Info } from '@phosphor-icons/react';
import Input from '../../components/Input/Input.jsx';
import Button from '../../components/Button/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import styles from '../../styles/authForm.module.css';

export default function Login() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || 'Login failed', 'error');
        return;
      }

      showToast(`Welcome back, ${data.teacher.username}!`, 'success');
      navigate('/dashboard');
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.heading}>
        <h2 className={styles.title}>Teacher Login</h2>
        <p className={styles.subtitle}>Authenticate your proctoring credentials</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.info}>
          <Info weight="bold" size={16} />
          <span>Teacher Dashboard: View live student tabs &amp; AI alerts.</span>
        </div>

        <Input
          id="email"
          name="email"
          type="email"
          label="Institutional Email"
          placeholder="professor@university.edu"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
        />

        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••••••"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          rightLabel={
            <a
              href="#"
              className={styles.link}
              onClick={(e) => {
                e.preventDefault();
                showToast('Password reset not available yet', 'info');
              }}
            >
              Forgot?
            </a>
          }
        />

        <label className={styles.remember}>
          <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} />
          <span>Keep session active on this device</span>
        </label>

        <Button type="submit" icon={<ArrowRight weight="bold" size={14} />} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>

      <div className={styles.footer}>
        New teacher?
        <Link to="/register">Create account</Link>
      </div>
    </>
  );
}
