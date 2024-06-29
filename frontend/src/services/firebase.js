import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC5sE95RqkC33NLlVIQmehs5KwWqgWcL_E",
  authDomain: "videoupload-testtask.firebaseapp.com",
  projectId: "videoupload-testtask",
  storageBucket: "videoupload-testtask.appspot.com",
  messagingSenderId: "288200936552",
  appId: "1:288200936552:web:d693d77480fb7b7cf23fdd",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
