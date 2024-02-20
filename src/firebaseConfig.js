import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.APIKEY, //"AIzaSyBnGmxuXuEfD5iumxttWD01bBe7AwhMS14",
//   authDomain: 'vasskraft-8d6df.firebaseapp.com',
//   projectId: 'vasskraft-8d6df',
//   storageBucket: 'vasskraft-8d6df.appspot.com',
//   messagingSenderId: '439429551651',
//   appId: '1:439429551651:web:4b8e6f06bb70b6ee0cc396',
// }
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  projectId: import.meta.env.VITE_PROJECTID,
  appId: import.meta.env.VITE_APPID,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  databaseURL: import.meta.env.VITE_DATABASEURL,
}
// Initialize Firebase
//const app = initializeApp(firebaseConfig);
const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth()

export { auth, firebaseApp }
