import { useAlert } from "@/hooks/useAlert";
import { FirebaseError } from "firebase/app";

const errorCapture = async (
  func: () => Promise<void>,
  fallBack = "An Error As Occured"
) => {
  try {
    Promise.resolve(func());
  } catch (error) {
    console.log(error);
    throw new Error(fallBack);
  }
};

export const firebaseError = (error: FirebaseError) => {
  const { alert } = useAlert();
  const msg = getFirebaseErrorMessage(error.code || error.message);

  alert.error(msg || "An Error Occured");
  console.log({ error, msg });
};

export const getError = (error: Error | unknown) => {
  if (error instanceof FirebaseError) {
    firebaseError(error);
  } else {
    console.error("An unexpected error occurred:", error);
  }
};

const getFirebaseErrorMessage = (code: string): string | null => {
  const errorMap: Record<string, string> = {
    // Auth
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/email-already-in-use": "This email is already registered.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",

    // Firestore
    "permission-denied": "You don't have permission to perform this action.",
    "not-found": "The requested document was not found.",
    "already-exists": "This document already exists.",

    // Storage
    "storage/unauthorized": "You are not authorized to access this file.",
    "storage/quota-exceeded": "Storage quota has been exceeded.",
  };

  return errorMap[code] ?? null;
};
