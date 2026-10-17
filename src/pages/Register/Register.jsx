import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Info } from '@phosphor-icons/react';
import Input from '../../components/Input/Input.jsx';
import Button from '../../components/Button/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { validateEmail, validatePassword } from '../../utils/validators.js';
import styles from '../../styles/authForm.module.css';

export default function Register() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const next = {
      email: validateEmail(form.email),
      password: validatePassword(form.password, { min: 8 }),
    };
    setErrors(next);
    if (next.email || next.password) return;

    // TODO: API — call register endpoint here (email, password)
    showToast('Form valid — API not connected yet', 'info');
  };

  return (
    <>
      <div className={styles.heading}>
        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>Register as a teacher to start proctoring</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.info}>
          <Info weight="bold" size={16} />
          <span>Use your institutional email. Password must be 8+ characters.</span>
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
          autoComplete="new-password"
        />

        <Button type="submit" icon={<ArrowRight weight="bold" size={14} />}>
          Register
        </Button>
      </form>

      <div className={styles.footer}>
        Already have an account?
        <Link to="/login">Sign in</Link>
      </div>
    </>
  );
}
