import { Outlet } from 'react-router-dom';
import { DashboardHeader } from '../components/Dashboardcomponents/Dashboardcomponents.jsx';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout() {
  return (
    <div className={styles.shell}>
      <DashboardHeader />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}