// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_FIREBASE_APP_ID,
// }

const firebaseConfig = {
    apiKey: "AIzaSyCjIFvmtvUgLqpIUwgXb4s7D0Nt14ahZxQ",
    authDomain: "guan-shopping-web.firebaseapp.com",
    projectId: "guan-shopping-web",
    storageBucket: "guan-shopping-web.appspot.com",
    messagingSenderId: "837685921252",
    appId: "1:837685921252:web:34e7e7de8823a08667f3f1"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

export default firebaseConfig