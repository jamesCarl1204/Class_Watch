import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Info } from '@phosphor-icons/react';
import Input from '../../components/Input/Input.jsx';
import Button from '../../components/Button/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { validateEmail, validatePassword } from '../../utils/validators.js';
import styles from '../../styles/authForm.module.css';

export default function Login() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const next = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    };
    setErrors(next);
    if (next.email || next.password) return;

    // TODO: API — call login endpoint here (email, password, remember)
    showToast('Form valid — API not connected yet', 'info');
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
          error={errors.email}
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
          error={errors.password}
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

        <Button type="submit" icon={<ArrowRight weight="bold" size={14} />}>
          Sign In
        </Button>
      </form>

      <div className={styles.footer}>
        New teacher?
        <Link to="/register">Create account</Link>
      </div>
    </>
  );
}
