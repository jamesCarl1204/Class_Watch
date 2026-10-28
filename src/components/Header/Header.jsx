import { Eye } from '@phosphor-icons/react';
import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logo} aria-hidden="true">
          <Eye weight="bold" size={19} />
        </div>
        <span className={styles.name}>ASSESSWATCH</span>
      </div>

      <div className={styles.right}>
        <div className={styles.status}>
          <span className={styles.dot} />
          <span className={styles.statusText}>Telemetry Engine Ready</span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
