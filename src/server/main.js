import express from "express";
import ViteExpress from "vite-express";
import * as fs from "fs";
import "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getInfoTexts } from "./infoTextManager.js";

export const INFORMATION_PATH = "data/information";

const app = express();

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);

app.get("/information", (req, res) => {
  const data = getInfoTexts();
  res.json(data)
})


initDirectories();

function initDirectories(){

  console.log("Initializing Directories...")
  fs.mkdirSync(INFORMATION_PATH, {
    recursive: true
  })

  console.log("Directories have been initialized")

}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyBx0T8XvjNQp4BS5bZn7gW3eAUa3Gx4Y",
  authDomain: "sustainable-6804c.firebaseapp.com",
  projectId: "sustainable-6804c",
  storageBucket: "sustainable-6804c.appspot.com",
  messagingSenderId: "404353865184",
  appId: "1:404353865184:web:e3975a472869a7061b8785"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore();

