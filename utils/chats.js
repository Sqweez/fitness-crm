export const canManageChats = user => !!user && (user.is_boss || user.roles.some(role => role.id === 2));

// IDs come as strings: compare numerically
export const isReadByClient = (message, clientLastReadMessageId) =>
  clientLastReadMessageId !== null && Number(message.id) <= Number(clientLastReadMessageId);

const isSameDay = (a, b) => a.toDateString() === b.toDateString();

export const formatMessageTime = iso =>
  new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

export const formatDayLabel = iso => {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (isSameDay(date, today)) {
    return 'Сегодня';
  }
  if (isSameDay(date, yesterday)) {
    return 'Вчера';
  }
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: date.getFullYear() === today.getFullYear() ? undefined : 'numeric' });
};

// Chat list: time for today, short date otherwise
export const formatListTime = iso => {
  const date = new Date(iso);
  return isSameDay(date, new Date())
    ? formatMessageTime(iso)
    : date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
};

export const isSameDayIso = (a, b) => isSameDay(new Date(a), new Date(b));
