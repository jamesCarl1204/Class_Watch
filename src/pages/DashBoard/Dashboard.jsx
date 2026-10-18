import { useState } from 'react';
import { Users, Browsers, Robot, ChartLineUp, UserMinus } from '@phosphor-icons/react';
import {
  StatCard, RosterToolbar, StudentCard, ActivityFeed,
  StudentDetailModal, WarningModal, EmptyState,
} from '../../components/Dashboardcomponents/Dashboardcomponents.jsx';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const students = [];
  const events = [];

  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [feedSeverity, setFeedSeverity] = useState('all');
  const [inspected, setInspected] = useState(null);
  const [warnTarget, setWarnTarget] = useState(null);

  const openWarning = (student) => {
    setInspected(null);
    setWarnTarget(student);
  };

  return (
    <>
      <section className={styles.stats}>
        <StatCard label="Active Students" icon={<Users weight="bold" size={14} />} value="0" />
        <StatCard
          label="Tab Switches"
          icon={<Browsers weight="bold" size={14} />}
          value="0"
        />
        <StatCard label="Flagged AI Pastes" icon={<Robot weight="bold" size={14} />} value="0" />
        <StatCard label="Avg Focus Score" icon={<ChartLineUp weight="bold" size={14} />} value="—" />
      </section>

      <div className={styles.grid}>
        <section className={styles.roster}>
          <RosterToolbar
            search={search}
            onSearchChange={setSearch}
            riskFilter={riskFilter}
            onRiskChange={setRiskFilter}
          />

          {students.length === 0 ? (
            <div className={styles.emptyCard}>
              <EmptyState
                icon={<UserMinus weight="bold" size={28} />}
                title="No students connected"
                description="Start a session and share the code so students can join from the extension."
              />
            </div>
          ) : (
            students.map((s) => (
              <StudentCard key={s.id} student={s} onInspect={setInspected} onWarn={openWarning} />
            ))
          )}
        </section>

        <div className={styles.feed}>
          <ActivityFeed
            events={events}
            severity={feedSeverity}
            onSeverityChange={setFeedSeverity}
          />
        </div>
      </div>

      <StudentDetailModal
        student={inspected}
        onClose={() => setInspected(null)}
        onWarn={openWarning}
      />
      <WarningModal student={warnTarget} onClose={() => setWarnTarget(null)} />
    </>
  );
}