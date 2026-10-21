import { useState } from 'react';
import {
  Copy, MagnifyingGlass, Browsers, Robot, Eye, Warning, WarningCircle,
  Lightning, Info, Pulse, Broadcast, X,SignOut,
} from '@phosphor-icons/react';
import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx';
import {
  RISK_FILTERS, FEED_FILTERS, STATUS_META, EVENT_TONE, WARNING_PRESETS,
} from '../../constants/dashboard.js';
import { useAuth } from '../../context/AuthContext.jsx';
import styles from './DashboardComponents.module.css';
import { useSession } from '../../context/SessionsContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export function Badge({ tone = 'neutral', mono = false, children }) {
  return (
    <span className={`${styles.badge_badge} ${styles[`badge_${tone}`]} ${mono ? styles.badge_mono : ''}`}>{children}</span>
  );
}

export function Modal({ open, onClose, size = 'md', children }) {
  if (!open) return null;

  return (
    <div className={styles.modal_overlay} onMouseDown={onClose}>
      <div
        className={`${styles.modal_panel} ${styles[`modal_${size}`]}`}
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.modal_close} onClick={onClose} aria-label="Close">
          <X weight="bold" size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, description }) {
  return (
    <div className={styles.empty_box}>
      {icon}
      <p className={styles.empty_title}>{title}</p>
      {description && <p className={styles.empty_desc}>{description}</p>}
    </div>
  );
}

export function DashboardHeader() {
  const { teacher, logout } = useAuth();
  const { session, startSession, endSession } = useSession();
  const { showToast } = useToast();
  const isLive = !!session;

  const handleStart = async () => {
    const name = window.prompt('Session name?');
    if (name === null) return;
    try {
      await startSession(name);
      showToast('Session started', 'success');
    } catch (err) {
      showToast(err.message, 'info');
    }
  };

  const handleEnd = async () => {
    try {
      await endSession();
      showToast('Session ended', 'info');
    } catch (err) {
      showToast(err.message, 'info');
    }
  };

  const handleCopy = async () => {
    if (!session) return;
    await navigator.clipboard.writeText(session.code);
    showToast('Code copied', 'success');
  };

  return (
    <header className={styles.hdr_header}>
      <div className={styles.hdr_inner}>
        <div className={styles.hdr_brand}>
          <div className={styles.hdr_logo}>CW</div>
          <div>
            <div className={styles.hdr_titleRow}>
              <span className={styles.hdr_name}>CLASSWATCH</span>
              <span className={styles.hdr_tag}>PROCTOR PORTAL</span>
            </div>
            <div className={styles.hdr_session}>
              Session: <strong>{session?.name || '—'}</strong>
            </div>
          </div>
        </div>

        <div className={styles.hdr_controls}>
          <Badge tone={isLive ? 'success' : 'neutral'}>
            <span className={`${styles.hdr_dot} ${isLive ? styles.hdr_live : ''}`} />
            {isLive ? 'Session Live' : 'No Active Session'}
          </Badge>

          <div className={styles.hdr_code}>
            <span className={styles.hdr_codeLabel}>CODE:</span>
            <strong>{session?.code || '—'}</strong>
            <button type="button" className={styles.hdr_copy} title="Copy session code" onClick={handleCopy}>
              <Copy weight="bold" size={12} />
            </button>
          </div>

          {isLive ? (
            <button type="button" className={styles.hdr_primary} onClick={handleEnd}>
              End Session
            </button>
          ) : (
            <button type="button" className={styles.hdr_primary} onClick={handleStart}>
              Start Session
            </button>
          )}

          <span className={styles.hdr_codeLabel}>{teacher?.username}</span>
          <button type="button" className={styles.hdr_primary} onClick={logout}>
            <SignOut weight="bold" size={12} /> Logout
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export function StatCard({ label, icon, value = '—', suffix, hint, tone = 'neutral' }) {
  return (
    <div className={styles.stat_card}>
      <div className={styles.stat_top}>
        <span className={styles.stat_label}>{label}</span>
        {icon}
      </div>
      <div className={styles.stat_bottom}>
        <span className={styles.stat_value}>
          {value}
          {suffix && <span className={styles.stat_suffix}> {suffix}</span>}
        </span>
        {hint && <Badge tone={tone}>{hint}</Badge>}
      </div>
    </div>
  );
}

export function RosterToolbar({ search, onSearchChange, riskFilter, onRiskChange }) {
  return (
    <div className={styles.toolbar_bar}>
      <div className={styles.toolbar_searchWrap}>
        <MagnifyingGlass weight="bold" size={14} className={styles.toolbar_searchIcon} />
        <input
          type="text"
          className={styles.toolbar_search}
          placeholder="Search student name or ID..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className={styles.toolbar_tabs}>
        {RISK_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`${styles.toolbar_tab} ${riskFilter === f.value ? styles.toolbar_active : ''}`}
            onClick={() => onRiskChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}


export function StudentCard({ student, onInspect, onWarn }) {
  const meta = STATUS_META[student.status] ?? STATUS_META.normal;
  const border = student.status === 'high' ? styles.card_high : student.status === 'warning' ? styles.card_warn : '';

  return (
    <article className={`${styles.card_card} ${border}`}>
      <div className={styles.card_top}>
        <div className={styles.card_who}>
          <div className={styles.card_avatar}>{student.initials}</div>
          <div>
            <div className={styles.card_nameRow}>
              <h3 className={styles.card_name}>{student.name}</h3>
              <span className={styles.card_id}>{student.id}</span>
            </div>
            <p className={styles.card_tab}>
              {student.isAiTab ? (
                <Robot weight="bold" size={12} className={styles.card_aiIcon} />
              ) : (
                <Browsers weight="bold" size={12} />
              )}
              <span className={student.isAiTab ? styles.card_aiText : ''}>{student.currentTab}</span>
            </p>
          </div>
        </div>
        <Badge tone={meta.tone} mono>
          {meta.label}
        </Badge>
      </div>

      <div className={styles.card_metrics}>
        <Metric label="Focus Score" value={`${student.focusScore}%`} danger={student.focusScore < 60} />
        <Metric label="Tab Switches" value={student.switches} warn={student.switches > 3} />
        <Metric label="AI Pastes" value={student.pastes} danger={student.pastes > 0} />
        <Metric label="Time Away" value={student.timeAway} />
        <Metric label="AI Sites" value={student.aiOpens} danger={student.aiOpens > 0} />
<Metric label="Copies" value={student.copies} warn={student.copies > 5} />
      </div>

      <div className={styles.card_actions}>
        <button type="button" className={styles.card_inspect} onClick={() => onInspect?.(student)}>
          <Eye weight="bold" size={14} />
          <span>Inspect Timeline</span>
        </button>
        <button type="button" className={styles.card_warnBtn} onClick={() => onWarn?.(student)}>
          <Warning weight="bold" size={14} />
          <span>Warn</span>
        </button>
      </div>
    </article>
  );
}

function Metric({ label, value, danger, warn }) {
  const cls = danger ? styles.card_danger : warn ? styles.card_warning : '';
  return (
    <div>
      <span className={styles.card_metricLabel}>{label}</span>
      <span className={`${styles.card_metricValue} ${cls}`}>{value}</span>
    </div>
  );
}

const ICONS = { critical: Lightning, warning: Warning, info: Info };


export function ActivityFeed({ events = [], severity, onSeverityChange, onClear }) {
  return (
    <section className={styles.feed_panel}>
      <div className={styles.feed_header}>
        <div className={styles.feed_titleRow}>
          <span className={styles.feed_ping} />
          <h2 className={styles.feed_title}>Threat &amp; Activity Stream</h2>
        </div>
        <button type="button" className={styles.feed_clear} onClick={onClear}>
          Clear Log
        </button>
      </div>

      <div className={styles.feed_filters}>
        <span className={styles.feed_filterLabel}>Filter:</span>
        {FEED_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`${styles.feed_filter} ${severity === f.value ? styles.feed_active : ''}`}
            onClick={() => onSeverityChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className={styles.feed_list}>
        {events.length === 0 ? (
          <EmptyState
            icon={<Broadcast weight="bold" size={24} />}
            title="No activity yet"
            description="Events will appear here once students join the session."
          />
        ) : (
          events.map((e) => {
            const Icon = ICONS[e.type] ?? Info;
            return (
              <div key={e.id} className={`${styles.feed_item} ${styles[`feed_${e.type}`] ?? ''}`}>
                <div className={styles.feed_itemTop}>
                  <span className={styles.feed_student}>
                    <Icon weight="bold" size={12} />
                    {e.student}
                  </span>
                  <span className={styles.feed_time}>{e.time}</span>
                </div>
                <p className={styles.feed_text}>{e.text}</p>
              </div>
            );
          })
        )}
      </div>

      <div className={styles.feed_footer}>
        <span className={styles.feed_sync}>
          <Pulse weight="bold" size={14} />
          Chrome Extension Sync: Waiting
        </span>
        <span className={styles.feed_ping2}>Ping: —</span>
      </div>
    </section>
  );
}


export function StudentDetailModal({ student, onClose, onWarn }) {
  return (
    <Modal open={!!student} onClose={onClose} size="lg">
      {student && (
        <>
          <div className={styles.detail_header}>
            <div className={styles.detail_avatar}>{student.initials}</div>
            <div>
              <h3 className={styles.detail_name}>{student.name}</h3>
              <p className={styles.detail_id}>ID: {student.id}</p>
            </div>
          </div>

          <div className={styles.detail_summary}>
            <Summary label="Focus Score" value={`${student.focusScore}%`} />
            <Summary label="Tab Switches" value={student.switches} tone="warning" />
            <Summary label="AI Pastes" value={student.pastes} tone="danger" />
          </div>

          <div className={styles.detail_body}>
            <h4 className={styles.detail_sectionTitle}>Chronological Activity Timeline</h4>
            <div className={styles.detail_timeline}>
              {student.timeline?.map((log, i) => (
                <div key={i} className={styles.detail_log}>
                  <div className={styles.detail_logTop}>
                    <Badge tone={EVENT_TONE[log.type] ?? 'neutral'}>{log.event}</Badge>
                    <span className={styles.detail_time}>{log.time}</span>
                  </div>
                  <p className={styles.detail_detail}>{log.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.detail_footer}>
            <button type="button" className={styles.detail_warnBtn} onClick={() => onWarn?.(student)}>
              <Warning weight="bold" size={14} />
              <span>Send Warning Alert</span>
            </button>
            <button type="button" className={styles.detail_closeBtn} onClick={onClose}>
              Close
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}

function Summary({ label, value, tone }) {
  return (
    <div className={styles.detail_summaryCard}>
      <span className={styles.detail_summaryLabel}>{label}</span>
      <span className={`${styles.detail_summaryValue} ${tone ? styles[`detail_${tone}`] : ''}`}>{value}</span>
    </div>
  );
}

export function WarningModal({ student, onClose, onSend }) {
  const [preset, setPreset] = useState(WARNING_PRESETS[0].message);
  const [note, setNote] = useState('');

  const handleSend = () => {
    onSend?.({ student, message: preset, note });
  };

  return (
    <Modal open={!!student} onClose={onClose}>
      <div className={styles.warn_body}>
        <div className={styles.warn_titleRow}>
          <WarningCircle weight="bold" size={24} />
          <h3 className={styles.warn_title}>Send Direct Warning</h3>
        </div>

        <p className={styles.warn_desc}>
          This warning will pop up on <strong>{student?.name ?? 'the student'}</strong>'s browser
          window immediately.
        </p>

        <div className={styles.warn_field}>
          <label className={styles.warn_label} htmlFor="warning-preset">
            Preset Warning Message
          </label>
          <select
            id="warning-preset"
            className={styles.warn_control}
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
          >
            {WARNING_PRESETS.map((p) => (
              <option key={p.label} value={p.message}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.warn_field}>
          <label className={styles.warn_label} htmlFor="warning-note">
            Custom Note (Optional)
          </label>
          <textarea
            id="warning-note"
            rows={3}
            className={styles.warn_control}
            placeholder="Type specific instructions..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className={styles.warn_actions}>
          <button type="button" className={styles.warn_cancel} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.warn_send} onClick={handleSend}>
            Dispatch Alert
          </button>
        </div>
      </div>
    </Modal>
  );
}