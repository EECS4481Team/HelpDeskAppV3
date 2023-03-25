// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFhlv2doIrEsbvZ7kDLcNzArKmCA-5muc",
  authDomain: "uploadingfile-118d3.firebaseapp.com",
  projectId: "uploadingfile-118d3",
  storageBucket: "uploadingfile-118d3.appspot.com",
  messagingSenderId: "47555293656",
  appId: "1:47555293656:web:8f8ff67201ffd41b3882ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);