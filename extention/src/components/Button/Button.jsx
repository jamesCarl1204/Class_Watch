import styles from './Button.module.css';

export default function Button({ children, icon, type = 'button', ...props }) {
  return (
    <button type={type} className={styles.btn} {...props}>
      <span>{children}</span>
      {icon}
    </button>
  );
}
