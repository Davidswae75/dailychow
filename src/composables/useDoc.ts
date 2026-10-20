import { db } from "@/firebase";
import type { UserProps } from "@/types";
import { addDoc, collection, deleteDoc, doc, DocumentReference, setDoc, updateDoc } from "firebase/firestore";

interface Collection {
  users: UserProps;
}

interface Doc<T extends keyof Collection> {
  col: T;
  data: Collection[T];
  id: string;
}

export function useDoc() {
  const addDocument = async <T extends keyof Collection>({
    col,
    data,
  }: Omit<Doc<T>, "id">): Promise<Collection[T]> => {
    const colref = collection(db, col);

    const docRef = await addDoc(colref, data);

    return {
      ...data,
      id: docRef.id,
    };
  };

  const updateDocument = async <T extends keyof Collection>({
    col,
    data,
    id,
  }: Omit<Doc<T>, "data"> & {
    data: Partial<Collection[T]>;
  }): Promise<void> => {
    const currentDoc = doc(db, col, id) as DocumentReference<Collection[T]>;
    
    await updateDoc(currentDoc, data);
  };

  const deleteDocument = async <T extends keyof  Collection>({ 
    col,
    id
  }: {
    col: T,
    id: string
  }) => {
    const currentDoc = doc(db, col, id)
    await deleteDoc(currentDoc)
  }

  const setDocument = async <T extends keyof Collection>({ col, data, id}: {
    col: T;
    data: Collection[T];
    id: string
  }): Promise<Collection[T]> => {
    const currentDoc = doc(db, col, id)

    await setDoc(currentDoc, data, {
        merge: true
    })

    return {
        ...data,
    }
  }

  return {
    updateDocument,
    setDocument,
    deleteDocument,
    addDocument
  }

}
