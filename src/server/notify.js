import { newId } from './store';

// Adds one notification inside an open `mutate` call. The admin bell reads these.
export const addNotification = (db, { type, title, body = '', link = '' }) => {
  db.notifications.unshift({ id: newId('ntf'), type, title, body: String(body).slice(0, 200), link, read: false, createdAt: new Date().toISOString() });
  if (db.notifications.length > 500) db.notifications.length = 500;
};
