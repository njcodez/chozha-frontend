import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function getApiUrl(): Promise<string> {
  const docRef = doc(db, "config", "api_link");
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data().url;
  }
  return "http://localhost:8000"; // fallback
}
