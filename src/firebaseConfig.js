// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.APIKEY, //"AIzaSyBnGmxuXuEfD5iumxttWD01bBe7AwhMS14",
  authDomain: 'vasskraft-8d6df.firebaseapp.com',
  projectId: 'vasskraft-8d6df',
  storageBucket: 'vasskraft-8d6df.appspot.com',
  messagingSenderId: '439429551651',
  appId: '1:439429551651:web:4b8e6f06bb70b6ee0cc396',
}

// Initialize Firebase
//const app = initializeApp(firebaseConfig);

export { firebaseConfig }
