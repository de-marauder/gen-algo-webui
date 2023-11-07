require('dotenv').config({
  path: './.env.local'
}); // make sure you have '.env' file in pwd
const fs = require('fs');
const path = require('path');

const directoryPath = './public';
const fileName = 'swenv.js';

// Check if the directory exists, and create it if it doesn't
if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath, { recursive: true });
}
fs.writeFileSync(path.join(directoryPath, fileName),
  `
const process = {
  env: {
    apiKey: "${process.env.NEXT_PUBLIC_FCM_API_KEY}",
    authDomain: "${process.env.NEXT_PUBLIC_FCM_AUTH_DOMAIN}",
    projectId: "${process.env.NEXT_PUBLIC_FCM_PROJECT_ID}",
    storageBucket: "${process.env.NEXT_PUBLIC_FCM_STRORAGE_BUCKET}",
    messagingSenderId: "${process.env.NEXT_PUBLIC_FCM_MESSAGING_SENDER}",
    appId: "${process.env.NEXT_PUBLIC_FCM_APP_ID}"
  }
}
`);

fs.writeFileSync(path.join(directoryPath, 'firebase-messaging-sw.js'),
  `
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');
// custom env file
importScripts('swenv.js');

const firebaseConfig = {
  ...process.env
};

firebase.initializeApp(firebaseConfig);
const isSupported = firebase.messaging.isSupported();

if (isSupported) {
  const messaging = firebase.messaging();
  // Configure message handler (assumes backend is set up)
  messaging.onBackgroundMessage((payload) => {
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };
    self.registration?.showNotification(notificationTitle,
      notificationOptions);
  });
}
`);

const _directoryPath = './.next';
const _fileName = 'swenv.js';

// Check if the directory exists, and create it if it doesn't
if (!fs.existsSync(_directoryPath)) {
  fs.mkdirSync(_directoryPath, { recursive: true });
}
fs.writeFileSync(path.join(_directoryPath, _fileName),
  `
const process = {
  env: {
    apiKey: "${process.env.NEXT_PUBLIC_FCM_API_KEY}",
    authDomain: "${process.env.NEXT_PUBLIC_FCM_AUTH_DOMAIN}",
    projectId: "${process.env.NEXT_PUBLIC_FCM_PROJECT_ID}",
    storageBucket: "${process.env.NEXT_PUBLIC_FCM_STRORAGE_BUCKET}",
    messagingSenderId: "${process.env.NEXT_PUBLIC_FCM_MESSAGING_SENDER}",
    appId: "${process.env.NEXT_PUBLIC_FCM_APP_ID}"
  }
}
`);

fs.writeFileSync(path.join(_directoryPath, 'firebase-messaging-sw.js'),
  `
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');
// custom env file
// importScripts('swenv.js');

fetch('/api/fcmConfig').then((firebaseConfig)=>{

  // const firebaseConfig = {
  //   ...process.env
  // };

  firebase.initializeApp(firebaseConfig);

  const isSupported = firebase.messaging.isSupported();
  if (isSupported) {
    const messaging = firebase.messaging();
    // Configure message handler (assumes backend is set up)
    messaging.onBackgroundMessage((payload) => {
      // Customize notification here
      const notificationTitle = 'Background Message Title';
      const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
      };

      self.registration?.showNotification(notificationTitle,
        notificationOptions);
    });
  }
})
`);

