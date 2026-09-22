import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
  } from "firebase/auth";
  import { auth } from "@/firebase";
  
  const signIn = async (
    type: "register" | "login",
    email: string,
    password: string
  ) => {
    const cred =
      type === "register"
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
    return {
      uid: cred.user.uid,
    };
  };
  
  export {
      signIn
  }
  