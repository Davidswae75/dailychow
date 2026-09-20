import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const sv = import.meta.env;
export const config = {
  apiKey: sv["apiKey"],
  authDomain: sv["authDomain"],
  projectId: sv["projectId"],
  storageBucket: sv["storageBucket"],
  messagingSenderId: sv["messagingSenderId"],
  appId: sv["appId"],
};

const app = initializeApp(config);
export const db = getFirestore(app)
export const auth = getAuth(app)