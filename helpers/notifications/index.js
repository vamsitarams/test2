import notifCheckPermission from './checkNotificationsSupp';
import PusherService from '../pusher';
import config from '../../config';
import {
  isAdmin
} from '../user';
import visibility from 'visibilityjs';

const showNotification = ({
  type,
  title,
  message,
  requireInteraction,
  icon,
  image,
  data,
  link
}, navigate) => {
  if (!type || !title || !message) return;

  const tag = `${type} - ${title} - ${message}`;
  const notification = new Notification(title, {
    body: message,
    image,
    icon,
    requireInteraction,
    persistent: requireInteraction,
    tag
  });

  notification.onclick = () => {
    if (link) navigate(link);
    window.focus();
    notification.close();
  };
};

class NotificationsHelper {
  init (user, userSettings, navigate) {
    this.user = user;
    this.userSettings = userSettings;
    this.navigate = navigate;
    this.notificationChannelName = config.pusher.notificationPrefix + this.user._id;

    if (window.Notification) {
      this.subscribe();
    }
  }

  subscribe () {
    PusherService.subscribe(
      this.notificationChannelName,
      async (context, res) => {
        if (context.indexOf('pusher:') === -1) {
          if (
            res.type === 'message' &&
            (!visibility.hidden() || !this.userSettings.assistedTravelers)
          ) {
            return;
          }
          await notifCheckPermission();

          showNotification({
            ...res,
            link: res.link ? res.link : this.getRedirectLink(res.type, res.data)
          }, this.navigate);
        }
      }
    );
  }

  getRedirectLink (type, data) {
    if (
      type === 'traveler' ||
      type === 'flifo' ||
      type === 'message'
    ) {
      return `/traveler/${data.subscriberId}`;
    } else if (type === 'station') {
      return !isAdmin(this.user.roleName) ? '/?mapView=airportStatus' : '/active-travelers?mapView=airportStatus';
    }
  }

  unbind () {
    PusherService.unsubscribe(this.notificationChannelName);
  }
};
const notificationsHelper = new NotificationsHelper();

export const bindNotifications = async (user, userSettings, navigate) => {
  if (!user || !navigate || !userSettings) return;

  await notifCheckPermission();
  notificationsHelper.init(user, userSettings, navigate);
};

export const unbindNotifications = () => {
  notificationsHelper.unbind();
};
