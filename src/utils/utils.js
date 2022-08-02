export function dateDifference(date2, date1) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  // Discard the time and time-zone information.
  const utc1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  const diff = utc2.getTime() - utc1.getTime()
  const diffDays = Math.ceil(diff/_MS_PER_DAY)

  return diffDays;
}