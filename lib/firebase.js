import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyANpgOUk7PwXc5iFpW-1JVRb6WeKTT5lyw",
  authDomain: "social-web-a4f9f.firebaseapp.com",
  projectId: "social-web-a4f9f",
  storageBucket: "social-web-a4f9f.appspot.com",
  messagingSenderId: "952984936239",
  appId: "1:952984936239:web:c5cfa889baddb2b3be4bda",
};

if (!firebase.apps.length > 0) firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

export const firestore = firebase.firestore();
export const Increment = firebase.firestore.FieldValue.increment;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();
export const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
export const arrayRemove = firebase.firestore.FieldValue.arrayRemove;

export const storage = firebase.storage();

export const data = (firebasedata) => {
  const fire = firebasedata.data();
  return {
    ...fire,
    id: firebasedata.id,
  };
};
