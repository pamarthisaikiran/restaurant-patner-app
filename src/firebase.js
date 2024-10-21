// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore,  } from 'firebase/firestore'; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC297_ObIKEAJvaAAr9tdl2PJCe8MFgkEU",
  authDomain: "swiggyrest.firebaseapp.com",
  projectId: "swiggyrest",
  storageBucket: "swiggyrest.appspot.com",
  messagingSenderId: "144976285988",
  appId: "1:144976285988:web:f9fbfbb75de4e66c4723b1",
  measurementId: "G-YD2926H1LX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
const googleProvider = new GoogleAuthProvider(); 
googleProvider.addScope('email')

export { auth, db,googleProvider };