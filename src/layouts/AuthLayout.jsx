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
              <span>Online Assessment Monitoring</span>
            </div>

            <h1 className={styles.title}>
              MONITOR.
              <br />
              REVIEW.
              <br />
              RESPOND.
            </h1>

            <p className={styles.desc}>
              Support online exams, technical assessments, and interviews with browser activity
              signals. Review flagged events to help guide a fair follow-up.
            </p>

            <ul className={styles.checklist}>
              <li>
                <Check weight="bold" size={14} />
                <span>Tab switches &amp; window-focus activity</span>
              </li>
              <li>
                <Check weight="bold" size={14} />
                <span>AI-related paste detection and AI website access alerts</span>
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
