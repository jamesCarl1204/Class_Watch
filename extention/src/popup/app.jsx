import { useEffect, useState } from 'react';
import { ArrowRight, SignOut } from '@phosphor-icons/react';
import Input from '../components/Input/Input.jsx';
import Button from '../components/Button/Button.jsx';
import styles from './App.module.css';

export default function App() {
  const [form, setForm] = useState({ code: '', name: '', studentId: '' });
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    chrome.storage.local.get('session').then((data) => {
      setSession(data.session ?? null);
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.code.trim() || !form.name.trim() || !form.studentId.trim()) {
      return setError('Fill in all fields');
    }

    // TODO: palitan ng API call (POST /api/sessions/join) kapag may backend na
    const joined = {
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      studentId: form.studentId.trim(),
    };

    await chrome.storage.local.set({ session: joined });
    setSession(joined);
  };

  const handleLeave = async () => {
    await chrome.storage.local.remove('session');
    setSession(null);
    setForm({ code: '', name: '', studentId: '' });
  };

  if (loading) return null;

  if (session) {
    return (
      <div className={styles.wrap}>
        <h1 className={styles.title}>ClassWatch</h1>
        <p className={styles.subtitle}>Your activity is being monitored.</p>

        <div className={styles.status}>
          <span className={styles.dot} />
          Connected to session <strong>{session.code}</strong>
        </div>

        <p className={styles.meta}>
          Name: <strong>{session.name}</strong>
          <br />
          ID: <strong>{session.studentId}</strong>
        </p>

        <Button onClick={handleLeave} icon={<SignOut weight="bold" size={14} />}>
          Leave Session
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Join Session</h1>
      <p className={styles.subtitle}>Enter the code from your teacher.</p>

      <form className={styles.form} onSubmit={handleJoin} noValidate>
        <Input id="code" name="code" label="Session Code" placeholder="ABC123" value={form.code} onChange={handleChange} />
        <Input id="name" name="name" label="Full Name" placeholder="Juan Dela Cruz" value={form.name} onChange={handleChange} />
        <Input id="studentId" name="studentId" label="Student ID" placeholder="2024-00123" value={form.studentId} onChange={handleChange} error={error} />

        <Button type="submit" icon={<ArrowRight weight="bold" size={14} />}>
          Join
        </Button>
      </form>
    </div>
  );
}