import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
export let firebase;
export let db;

export function initFirebase(){
    firebase = initializeApp(firebaseConfig);
    db = getFirestore();
}


const firebaseConfig = {
    "apiKey": "AIzaSyCyBx0T8XvjNQp4BS5bZn7gW3eAUa3Gx4Y",
    "authDomain": "sustainable-6804c.firebaseapp.com",
    "projectId": "sustainable-6804c",
    "storageBucket": "sustainable-6804c.appspot.com",
    "messagingSenderId": "404353865184",
    "appId": "1:404353865184:web:e3975a472869a7061b8785"
}
