// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCr-wjNHYp2jUZlrf8v6wC7Q4LUvFdrLNo",
  authDomain: "sgtourismbored.firebaseapp.com",
  projectId: "sgtourismbored",
  storageBucket: "sgtourismbored.appspot.com",
  messagingSenderId: "117023699986",   // ✅ only 10–13 digits
  appId: "1:117023699986:web:xxxxxxxxxxxxxxxxxxxxxx", // ✅ matches project ID above
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
