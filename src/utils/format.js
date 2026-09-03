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
