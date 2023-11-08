// Import the functions you need from the SDKs you need
import { TypeUser } from "@/Types/User";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import type { Messaging } from "firebase/messaging";
import { APIConfig } from "../(Dashboard)/dashboard/config/_helper";
import axios from "axios";

declare global {
  var registration: any
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FCM_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FCM_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FCM_STRORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FCM_MESSAGING_SENDER,
  appId: process.env.NEXT_PUBLIC_FCM_APP_ID
};

// Initialize Firebase
export var messaging: Messaging | undefined

if (global?.window && 'navigator' in window) {
  var app = initializeApp(firebaseConfig);

  messaging = getMessaging(app);

}

export async function doNotification(swr: ServiceWorkerRegistration, notif?: { title: string, notification: NotificationOptions }) {
  if (global?.window && 'navigator' in window) {
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      const u = JSON.parse(localStorage.getItem('site-user') || '') as TypeUser | ''
      if (u && u.fcmToken && localStorage.getItem('fcmToken')) {
        // const notification = new Notification(notif?.title || "Permission Granted", notif?.notification || { body: 'You now have permissions' })
        swr.showNotification(notif?.title || "Permission Granted", notif?.notification || { body: 'You now have permissions' });
      } else {
        return await requestPermission(swr, notif)
      }
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      return await requestPermission(swr, notif)
    }

  }
}

export async function requestPermission(swr: ServiceWorkerRegistration, notif?: { title: string, notification: NotificationOptions }) {
  if (global?.window && 'navigator' in window) {
    const permission = await Notification.requestPermission()

    if (permission === 'granted') {
      // Add the public key generated from the console here.
      if (messaging) {

        const fcmToken = await getToken(messaging, {
          serviceWorkerRegistration: swr,
          vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY
        }).catch((err) => {
          console.log(err)
          alert('An error occurred while retrieving token. ');
          // ...
        });
        if (fcmToken) {
          // Send the token to your server and update the UI if necessary
          // subscribe user to notifications
          const u = JSON.parse(localStorage.getItem('site-user') || '') as TypeUser | ''
          if (u) {
            u.fcmToken = fcmToken
            localStorage.setItem('fcmToken', fcmToken);
            localStorage.setItem('site-user', JSON.stringify(u));

            // const notification = new Notification(notif?.title || "Permission Granted", notif?.notification || { body: 'You now have permissions' })
            swr.showNotification(notif?.title || "Permission Granted", notif?.notification || { body: 'You now have permissions' });
          }
        } else {
          // Show permission request UI
          alert('No registration token available. Request permission to generate one.');
          // ...
        }

      } else {
        alert('FCM Token not found')
      }
    }
  }
}
