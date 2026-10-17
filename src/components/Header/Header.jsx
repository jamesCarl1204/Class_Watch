import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logo}>CW</div>
        <span className={styles.name}>CLASSWATCH</span>
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
