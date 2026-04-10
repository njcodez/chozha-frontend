import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

type ConfigDoc = {
  url: string;
};

export async function getApiUrl(): Promise<string> {
  const docRef = doc(db, "config", "api_link");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data() as ConfigDoc;
    return data.url;
  }
  return "http://localhost:8000";
}