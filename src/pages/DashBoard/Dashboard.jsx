import { useMemo, useState } from 'react';
import { Users, Browsers, Robot, ChartLineUp, UserMinus } from '@phosphor-icons/react';
import {
  StatCard, RosterToolbar, StudentCard, ActivityFeed,
  StudentDetailModal, WarningModal, EmptyState,
} from '../../components/Dashboardcomponents/Dashboardcomponents.jsx';
import { useSession } from '../../context/SessionsContext.jsx';
import useLiveSession from '../../hooks/useLiveSessions.js';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { session } = useSession();
  const { stats, students: allStudents, events: rawEvents } = useLiveSession(session?.id);

  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [feedSeverity, setFeedSeverity] = useState('all');
  const [inspected, setInspected] = useState(null);
  const [warnTarget, setWarnTarget] = useState(null);

  const students = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allStudents.filter(
      (s) =>
        (riskFilter === 'all' || s.status === riskFilter) &&
        (!q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q))
    );
  }, [allStudents, search, riskFilter]);

  const events = useMemo(
    () =>
      rawEvents
        .filter((e) => feedSeverity === 'all' || e.type === feedSeverity)
        .map((e) => ({ ...e, time: new Date(e.at).toLocaleTimeString() })),
    [rawEvents, feedSeverity]
  );

  const openWarning = (student) => {
    setInspected(null);
    setWarnTarget(student);
  };

  return (
    <>
      <section className={styles.stats}>
        <StatCard label="Active Students" icon={<Users weight="bold" size={14} />} value={stats.active} />
        <StatCard label="Tab Switches" icon={<Browsers weight="bold" size={14} />} value={stats.tabSwitches} />
        <StatCard label="Flagged AI Pastes" icon={<Robot weight="bold" size={14} />} value={stats.aiPastes} />
        <StatCard
          label="Avg Focus Score"
          icon={<ChartLineUp weight="bold" size={14} />}
          value={stats.avgFocus ?? '—'}
          suffix={stats.avgFocus != null ? '%' : undefined}
        />
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
                description={
                  session
                    ? 'Waiting for students to join with the session code.'
                    : 'Start a session first, then share the code.'
                }
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