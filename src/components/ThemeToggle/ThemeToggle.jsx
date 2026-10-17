import { Moon, Sun } from '@phosphor-icons/react';
import useTheme from '../../hooks/useTheme.js';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === 'dark' ? Sun : Moon;

  return (
    <button type="button" className={styles.btn} onClick={toggleTheme} aria-label="Toggle theme">
      <Icon weight="bold" size={18} />
    </button>
  );
}
