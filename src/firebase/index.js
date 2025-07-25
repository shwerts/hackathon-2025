import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvdKILCr2qKAwEg8lnOgLbxHkrXNOtrEQ",
  authDomain: "hackathon-2025-3dc4c.firebaseapp.com",
  databaseURL: "https://hackathon-2025-3dc4c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hackathon-2025-3dc4c",
  storageBucket: "hackathon-2025-3dc4c.firebasestorage.app",
  messagingSenderId: "776070382397",
  appId: "1:776070382397:web:c43ffe05c14d79fc353b54"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export {
  db,
  auth
}