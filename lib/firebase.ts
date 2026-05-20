import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCakR2xMaPEV6zjty8LuSwRvlG89wEF_VI",
  authDomain: "almanca-okulum.firebaseapp.com",
  projectId: "almanca-okulum",
  storageBucket: "almanca-okulum.firebasestorage.app",
  messagingSenderId: "55253714365",
  appId: "1:55253714365:web:23afd9c0b4d1caf4c27ed4",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);