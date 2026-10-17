import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>© ClassWatch Systems. All rights reserved.</div>
      <div className={styles.links}>
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Documentation</a>
      </div>
    </footer>
  );
}
