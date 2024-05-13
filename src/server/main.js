import express from "express";
import ViteExpress from "vite-express";
import * as fs from "fs";
import "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getInfoTexts, loadContent } from "./infoTextManager.js";
import bodyParser from "body-parser";

export const INFORMATION_PATH = "data/information/";
export const INFORMATION_TEXT_PATH = INFORMATION_PATH + "texts/";
export const INFORMATION_CONTENT_PATH = INFORMATION_PATH + "content/";

const app = express();

app.use(bodyParser.json())

const server = ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);

app.get("/information", async (req, res) => {

  if(!verifyHost(req.hostname)){
    res.send("Invalid Host")
    return;
  }

  const data = getInfoTexts();

  for(var i = 0; i < data.texts.length; i++){
    const text = data.texts[i];

    if(text["content"].endsWith(".docx"))
      text["content"] = await loadContent(INFORMATION_CONTENT_PATH + text.content)
  }

  data["generalInformation"].content = await loadContent(INFORMATION_PATH + data["generalInformation"].content)

  res.json(data)
})


initDirectories();

function initDirectories(){

  console.log("Initializing Directories...")
  fs.mkdirSync(INFORMATION_PATH, {
    recursive: true
  })
  fs.mkdirSync(INFORMATION_TEXT_PATH, {
    recursive: true
  })
  fs.mkdirSync(INFORMATION_CONTENT_PATH, {
    recursive: true
  })
  console.log("Directories have been initialized")

}


function verifyHost(hostname){
  return hostname === "localhost";
}


