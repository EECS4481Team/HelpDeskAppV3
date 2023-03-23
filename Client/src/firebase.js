// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyD9eyqqEfY13qcjmgiQsFFGrJIIBxfXb0c",

  authDomain: "uploadingfile-b8e4e.firebaseapp.com",

  projectId: "uploadingfile-b8e4e",

  storageBucket: "uploadingfile-b8e4e.appspot.com",

  messagingSenderId: "416440469304",

  appId: "1:416440469304:web:4220a434580594a7f363cd"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);