import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA8e82A-hn9qwlLf3qY1EoktSeL6ZbMlHE",
  authDomain: "fir-next-social.firebaseapp.com",
  projectId: "fir-next-social",
  storageBucket: "fir-next-social.appspot.com",
  messagingSenderId: "1027683114650",
  appId: "1:1027683114650:web:f7393dbb67efc8143e4923",
};

if (!firebase.apps.length > 0) firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

export const firestore = firebase.firestore();
export const Increment = firebase.firestore.FieldValue.increment();
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();

export const data = (firebasedata) => {
  const fire = firebasedata.data();
  return {
    ...fire,
    id: firebasedata.id,
  };
};
