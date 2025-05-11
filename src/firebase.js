import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDd2vaQTGRRatCJY0OVxeeJKf-UTwXwXks",
  authDomain: "townbook-eefb2.firebaseapp.com",
  projectId: "townbook-eefb2",
  storageBucket: "townbook-eefb2.appspot.com", // 🔁 FIXED: .app → .com
  messagingSenderId: "274930762795",
  appId: "1:274930762795:web:c5c25d4038527bd55f566e",
  measurementId: "G-DMF8JXR6TE"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
