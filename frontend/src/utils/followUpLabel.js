import dayjs from 'dayjs';

export function getFollowUpLabel(status, nextFollowUpDate) {
  if (!nextFollowUpDate) return '';
  if (status === 'Pending') return '-';

  const today = dayjs().startOf('day');
  const next = dayjs(nextFollowUpDate).startOf('day');
  const diff = next.diff(today, 'day');

  if (diff >= 1) return 'Upcoming';
  if (diff === 0) return 'Due Today';
  if (diff < 0) return 'Overdue';

  return '';
}