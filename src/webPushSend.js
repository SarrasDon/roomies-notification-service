import * as WebPushLib from "web-push";
import { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } from "./config";

export const createNotification = (name, amount, reason) => {
  return {
    notification: {
      title: "New Expense!",
      body: `${name} spend ${amount.toFixed(2)}€ for ${reason}!`,
      icon: "assets/icons/icon-192x192.png",
      data: {
        onActionClick: {
          default: { operation: "openWindow" },
          see: {
            operation: "openWindow",
            url: "https://roomies.netlify.app/expenses/",
          },
        },
      },
      actions: [
        {
          action: "see",
          title: "Check Roomies!",
        },
      ],
    },
  };
};

export const pushNotifications = async ({ notification, subs }) => {
  WebPushLib.setVapidDetails(
    "mailto:sarrasdon@gmail.com",
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );

  const promises = subs.map((sub) =>
    WebPushLib.sendNotification(sub, JSON.stringify(notification))
  );

  try {
    await Promise.all(promises);
  } catch (error) {
    console.error(error);
  }
};
