
// setInterval(() => {
//   console.log(new Notification('Bla bla'));
// }, 5000);

// const checkNotificationSupp = () => {
//   if (!Notification || !Notification.requestPermission)
//       return false;
//
//   if (Notification.permission !== 'granted')
//     Notification.requestPermission();
//
//   try {
//     new Notification('');
//   } catch (e) {
//     if (e.name == 'TypeError')
//       return false;
//   }
//
//   return true;
// };

// self.registration.showNotification(title, {
//   body,
//   tag
// });
