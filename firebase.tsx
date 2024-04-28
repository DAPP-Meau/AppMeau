import {initializeApp} from 'firebase/app'

const firebaseConfig = {
    apiKey: "AIzaSyAdR3vDtZ8a8QnvyyHSp3K7-9qvVO1LhLk",
    authDomain: "meau-app-1b023.firebaseapp.com",
    // The value of `databaseURL` depends on the location of the database
    projectId: "meau-app-1b023",
    //storageBucket: STORAGE_BUCKET,
    appId: "813508935570",
  };

export const firebaseapp = initializeApp(firebaseConfig)