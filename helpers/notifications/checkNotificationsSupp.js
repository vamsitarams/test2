export default function notifCheckPermission () {
  return new Promise((resolve, reject) => {
    if (Notification.permissions === 'granted') {
      resolve(true);
    } else {
      Notification.requestPermission(res => {
        if (res === 'granted') resolve(true);
        else reject('Notifications are not allowed');
      });
    }
  });
};
