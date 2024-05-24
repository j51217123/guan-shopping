// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAuZ5ef0w4sOkUSBE-60jr0PVjNvw0ZEuY",
//   authDomain: "guan-shopping.firebaseapp.com",
//   projectId: "guan-shopping",
//   storageBucket: "guan-shopping.appspot.com",
//   messagingSenderId: "493762983053",
//   appId: "1:493762983053:web:07a3db88e5470cda67dec4",
//   measurementId: "G-D85W3KY037",
// };

const firebaseConfig = {
  apiKey: "AIzaSyACx6r234UJICsJvPQcHQdxFWHeToA--rA",
  authDomain: "guan-shopping-bf7df.firebaseapp.com",
  projectId: "guan-shopping-bf7df",
  storageBucket: "guan-shopping-bf7df.appspot.com",
  messagingSenderId: "919671907702",
  appId: "1:919671907702:web:befad5a81fea8adfd9c657"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default firebaseConfig