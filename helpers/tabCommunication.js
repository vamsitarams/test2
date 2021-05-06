export const messageBroadcast = (message) => {
  localStorage.setItem('dashboard-message', JSON.stringify(message));
  localStorage.removeItem('dashboard-message');
};

export const messageReceive = (ev, cb) => {
  if (ev.originalEvent.key !== 'dashboard-message') return; // ignore other keys
  const message = (ev.originalEvent && ev.originalEvent.newValue ? JSON.parse(ev.originalEvent.newValue) : null);
  if (!message) return;
  cb(message);
};
