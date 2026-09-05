export function formatCurrency(amount) {
  const value = Number(amount) || 0;
  return `₱${value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDateForDisplay(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return isoDate;
  return `${month}/${day}/${year}`;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/* ---------- date range helpers for Summary filtering ---------- */

function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function startOfWeek(iso) {
  const d = parseISO(iso);
  const day = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}

export function endOfWeek(iso) {
  const d = parseISO(startOfWeek(iso));
  d.setDate(d.getDate() + 6);
  return d.toISOString().slice(0, 10);
}

export function startOfMonth(iso) {
  const d = parseISO(iso);
  d.setDate(1);
  return d.toISOString().slice(0, 10);
}

export function endOfMonth(iso) {
  const d = parseISO(iso);
  d.setMonth(d.getMonth() + 1, 0); // last day of current month
  return d.toISOString().slice(0, 10);
}

export function shiftDate(iso, filter, direction) {
  const d = parseISO(iso);
  if (filter === 'Daily') d.setDate(d.getDate() + direction);
  else if (filter === 'Weekly') d.setDate(d.getDate() + direction * 7);
  else d.setMonth(d.getMonth() + direction);
  return d.toISOString().slice(0, 10);
}

export function isWithinRange(dateISO, startISO, endISO) {
  return dateISO >= startISO && dateISO <= endISO;
}

export function formatDisplayDate(iso) {
  const d = parseISO(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
