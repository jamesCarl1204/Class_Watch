import { Outlet } from 'react-router-dom';
import { ShieldCheck, Check } from '@phosphor-icons/react';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';
import styles from './AuthLayout.module.css';

export default function AuthLayout() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.grid}>
          <section className={styles.hero}>
            <div className={styles.badge}>
              <ShieldCheck weight="bold" size={14} />
              <span>Proctoring &amp; Activity Detection</span>
            </div>

            <h1 className={styles.title}>
              MONITOR.
              <br />
              DETECT.
              <br />
              PROTECT.
            </h1>

            <p className={styles.desc}>
              Real-time browser telemetry for educators. Track tab switches, window blur events, and
              instant AI text pastes seamlessly.
            </p>

            <ul className={styles.checklist}>
              <li>
                <Check weight="bold" size={14} />
                <span>Tab &amp; background window focus logger</span>
              </li>
              <li>
                <Check weight="bold" size={14} />
                <span>Clipboard speed &amp; LLM pattern detector</span>
              </li>
            </ul>
          </section>

          <section>
            <div className={styles.card}>
              <Outlet />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
