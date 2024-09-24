
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
