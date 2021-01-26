  import firebase from "firebase";

  const firebaseApp =firebase.initializeApp ({
    apiKey: "AIzaSyBfO9dnTSnv9FORTHYDA9aD6lBEaF-Sza0",
    authDomain: "instagram-clone-bhanu.firebaseapp.com",
    databaseURL: "https://instagram-clone-bhanu.firebaseio.com",
    projectId: "instagram-clone-bhanu",
    storageBucket: "instagram-clone-bhanu.appspot.com",
    messagingSenderId: "165010779821",
    appId: "1:165010779821:web:944ee8ca4be2d8d0cca024",
    measurementId: "G-JBDTF0LTDJ"
  });

  const db=firebaseApp.firestore();
  const auth=firebase.auth();
  const storage=firebase.storage();

  export {db,auth,storage};