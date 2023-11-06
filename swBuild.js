require('dotenv').config({
  path: './.env.local'
}); // make sure you have '.env' file in pwd
const fs = require('fs');
const path = require('path');

const directoryPath = './dist';
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