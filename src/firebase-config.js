// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: "AIzaSyCpgUHFh0giqOA9cbqUb1JkdiDpw-xxTWg",
  // authDomain: "ai-project-9c85d.firebaseapp.com",
  // databaseURL: "https://ai-project-9c85d-default-rtdb.firebaseio.com",
  // projectId: "ai-project-9c85d",
  // storageBucket: "ai-project-9c85d.appspot.com",
  // messagingSenderId: "617549331230",
  // appId: "1:617549331230:web:becb6ee6a16663c490670f",
  // measurementId: "G-K284W277C5"
  apiKey: "AIzaSyD-JjbG5o0IPMkHqiepWIuhHrTrmDlFoKU",
  authDomain: "safe-crop.firebaseapp.com",  
  databaseURL: "https://safe-crop-default-rtdb.firebaseio.com",
  projectId: "safe-crop",  
  storageBucket: "safe-crop.appspot.com",
  messagingSenderId: "819507712444",  
  appId: "1:819507712444:web:4d17f8f4d04f2dcc1a9bb9",
  measurementId: "G-ER7KC75RZH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
const storage = getStorage(app);

export { auth, db, storage };


//this is bamlak feleke 
// Import the functions you need from the SDKs you needimport { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {  
//   apiKey: "AIzaSyD-JjbG5o0IPMkHqiepWIuhHrTrmDlFoKU",
//   authDomain: "safe-crop.firebaseapp.com",  
//   databaseURL: "https://safe-crop-default-rtdb.firebaseio.com",
//   projectId: "safe-crop",  
//   storageBucket: "safe-crop.appspot.com",
//   messagingSenderId: "819507712444",  
//   appId: "1:819507712444:web:4d17f8f4d04f2dcc1a9bb9",
//   measurementId: "G-ER7KC75RZH"
// };
// Initialize Firebase
//const app = initializeApp(firebaseConfig);const analytics = getAnalytics(app);