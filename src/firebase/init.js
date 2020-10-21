import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAuZtcrcNrWnpOYnLt_lTIm-8T78ndEqIo",
  authDomain: "unacademy-pi.firebaseapp.com",
  databaseURL: "https://unacademy-pi.firebaseio.com",
  projectId: "unacademy-pi",
  storageBucket: "unacademy-pi.appspot.com",
  messagingSenderId: "258428393699",
  appId: "1:258428393699:web:74c4635c9092124014cdd6",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
