// Indian number formatting and admin utilities

/** Format number in Indian lakh / crore notation */
export function formatINR(n, opts = {}) {
  if (n == null || isNaN(n)) return '₹0';
  const abs = Math.abs(n);
  const { compact = true } = opts;
  if (compact && abs >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (compact && abs >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

/** Format number with Indian commas */
export function formatNum(n) {
  if (n == null) return '0';
  return n.toLocaleString('en-IN');
}

/** Format a delta percent with + / - and color class */
export function formatDelta(val) {
  if (val == null || isNaN(val)) return { text: '—', className: 'text-stone-400' };
  const sign = val >= 0 ? '+' : '';
  const text = `${sign}${val.toFixed(1)}%`;
  const className = val > 0 ? 'text-emerald-600 dark:text-emerald-400' : val < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-stone-400';
  return { text, className };
}

/** Get margin % from cost and price */
export function getMargin(cost, price) {
  if (!price || price === 0) return 0;
  return ((price - cost) / price) * 100;
}

export function calcMargin(cost, price) {
  return Math.round(getMargin(cost, price));
}

/** Margin color based on target */
export function marginColor(margin, target) {
  if (margin >= target) return 'text-emerald-600 dark:text-emerald-400';
  if (margin >= target * 0.85) return 'text-amber-600 dark:text-amber-400';
  return 'text-rose-600 dark:text-rose-400';
}

/** Suggest price from cost using target margin */
export function suggestPrice(cost, targetMarginPercent) {
  if (!cost || !targetMarginPercent) return 0;
  return Math.ceil(cost / (1 - targetMarginPercent / 100));
}

/** Format date string to readable */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Format date+time */
export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });
}

/** Generate unique ID */
export function genId(prefix = 'ID') {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

/** Classnames helper */
export function cn(...args) {
  return args.filter(Boolean).join(' ');
}
