import { useState } from 'react';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import styles from './Input.module.css';

export default function Input({ id, label, error, type = 'text', rightLabel, ...props }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && show ? 'text' : type;

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        {rightLabel}
      </div>

      <div className={styles.wrap}>
        <input
          id={id}
          type={inputType}
          className={`${styles.input} ${error ? styles.invalid : ''} ${isPassword ? styles.hasIcon : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.eye}
            onClick={() => setShow((s) => !s)}
            aria-label="Toggle password visibility"
          >
            {show ? <EyeSlash weight="bold" size={16} /> : <Eye weight="bold" size={16} />}
          </button>
        )}
      </div>

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
