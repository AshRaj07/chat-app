import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBS-SAMKgVEBCXYgRFZHG1Epf5zEEDbJeY",
  authDomain: "chat-web-app-c6fe3.firebaseapp.com",
  databaseURL: "https://chat-web-app-c6fe3-default-rtdb.firebaseio.com",
  projectId: "chat-web-app-c6fe3",
  storageBucket: "chat-web-app-c6fe3.appspot.com",
  messagingSenderId: "107487103164",
  appId: "1:107487103164:web:e9d154193e7fdf5d1fe8b9",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();