export const RISK_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'high', label: 'High Risk' },
  { value: 'warning', label: 'Warning' },
  { value: 'normal', label: 'Normal' },
];

export const FEED_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'critical', label: 'Critical' },
  { value: 'warning', label: 'Warnings' },
];

export const STATUS_META = {
  high: { label: 'HIGH RISK', tone: 'danger' },
  warning: { label: 'WARNING', tone: 'warning' },
  normal: { label: 'NORMAL', tone: 'success' },
};

export const EVENT_TONE = {
  critical: 'danger',
  warning: 'warning',
  info: 'neutral',
};

export const WARNING_PRESETS = [
  {
    label: 'Tab Switch Notice',
    message: 'Unapproved tab switch detected. Please return to the session immediately.',
  },
  {
    label: 'AI Content Warning',
    message: 'Instant AI text paste flagged. External tools are strictly prohibited.',
  },
  {
    label: 'Final Strict Alert',
    message: 'Final Warning: Continued browser focus loss will result in session auto-submission.',
  },
];