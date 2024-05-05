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

// Initialize Firebase
const firebase = initializeApp(JSON.parse(fs.readFileSync("./firebaseConfig.json")));
const db = getFirestore();

