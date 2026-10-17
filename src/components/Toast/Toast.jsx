import { CheckCircle, Info } from '@phosphor-icons/react';
import styles from './Toast.module.css';

export default function Toast({ visible, message, type }) {
  const Icon = type === 'success' ? CheckCircle : Info;
  return (
    <div className={`${styles.toast} ${visible ? styles.visible : ''}`} role="status">
      <Icon weight="bold" size={16} className={type === 'success' ? styles.success : styles.info} />
      <span>{message}</span>
    </div>
  );
}
