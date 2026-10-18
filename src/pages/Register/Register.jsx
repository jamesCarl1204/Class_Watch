import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Info } from '@phosphor-icons/react';
import Input from '../../components/Input/Input.jsx';
import Button from '../../components/Button/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../utils/api.js';
import styles from '../../styles/authForm.module.css';

export default function Register() {
  const { showToast } = useToast();
  const { setTeacher } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { teacher } = await api('/auth/register', {
        method: 'POST',
        body: form,
      });

      setTeacher(teacher);
      showToast('Account created! Welcome.', 'success');
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
        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>Register as a teacher to start proctoring</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.info}>
          <Info weight="bold" size={16} />
          <span>Use your institutional email. Password must be 8+ characters.</span>
        </div>

        <Input
          id="username"
          name="username"
          type="text"
          label="Username"
          placeholder="prof_smith"
          value={form.username}
          onChange={handleChange}
          autoComplete="username"
        />

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
          autoComplete="new-password"
        />

        <Button type="submit" icon={<ArrowRight weight="bold" size={14} />} disabled={loading}>
          {loading ? 'Creating account…' : 'Register'}
        </Button>
      </form>

      <div className={styles.footer}>
        Already have an account?
        <Link to="/login">Sign in</Link>
      </div>
    </>
  );
}