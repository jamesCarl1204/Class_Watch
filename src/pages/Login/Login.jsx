import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Info } from '@phosphor-icons/react';
import Input from '../../components/Input/Input.jsx';
import Button from '../../components/Button/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../utils/api.js';
import styles from '../../styles/authForm.module.css';

export default function Login() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { setTeacher } = useAuth();
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
      const { teacher } = await api('/auth/login', {
        method: 'POST',
        body: { email: form.email, password: form.password, remember: form.remember },
      });

      setTeacher(teacher);
      showToast(`Welcome back, ${teacher.username}!`, 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message, 'info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.heading}>
        <h2 className={styles.title}>Host Sign In</h2>
        <p className={styles.subtitle}>Manage online assessments and interviews</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.info}>
          <Info weight="bold" size={16} />
          <span>Review browser activity signals and flagged events from your sessions.</span>
        </div>

        <Input
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
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
        New to ClassWatch?
        <Link to="/register">Create account</Link>
      </div>
    </>
  );
}
