import express from "express";
import ViteExpress from "vite-express";
import * as fs from "fs";
import "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getInfoTexts, loadContent } from "./infoTextManager.js";
import bodyParser from "body-parser";
import { createAccount, getAccountInfo, loginAccount, refreshToken } from "./accountManager.js";

export const INFORMATION_PATH = "data/information/";
export const INFORMATION_TEXT_PATH = INFORMATION_PATH + "texts/";
export const INFORMATION_CONTENT_PATH = INFORMATION_PATH + "content/";
export const HASH_SET_PATH = "data/hash_sets/";

const app = express();

app.use(bodyParser.json())

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);


app.get("/information", async (req, res) => {
  const data = getInfoTexts();

  for(var i = 0; i < data.texts.length; i++){
    const text = data.texts[i];

    if(text["content"].endsWith(".docx"))
      text["content"] = await loadContent(INFORMATION_CONTENT_PATH + text.content)
  }

  data["generalInformation"].content = await loadContent(INFORMATION_PATH + data["generalInformation"].content)

  res.json(data)
})

app.post("/account/signUp", async (req, res) => {
  
  const data = req.body;
  if(data === undefined || (!("email" in data) || !("username" in data) || !("password" in data)))
    res.json({status: ActionResult.FAILED})
  
  res.json(await createAccount(data));
})

app.post("/account/signIn", async (req, res) => {
  const data = req.body;
  if(data === undefined || (!("email" in data) || !("password" in data)))
    res.json({status: ActionResult.FAILED})

  res.json(await loginAccount(data));
})

app.post("/account/info", async (req, res) => {
  const data = req.body;
  if(data === undefined || !("accessToken" in data))
    res.json({status: ActionResult.FAILED})

  res.json(await getAccountInfo(data.accessToken));
})

app.post("/account/refreshToken", async (req, res) => {

  const data = req.body;
  if(data === undefined || !("accessToken" in data))
    res.json({status: ActionResult.FAILED});

  res.json(await refreshToken(data.accessToken))

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
  fs.mkdirSync(HASH_SET_PATH, {
    recursive: true
  })
  console.log("Directories have been initialized")

}



export const ActionResult = {
    
  PASSWORDS_NOT_MATCHING: -1,
  INVALID_EMAIL: -2,
  INVALID_USERNAME: -3,
  INVALID_PASSWORD: -4,
  EMAIL_ALREADY_IN_USE: -5,
  EMAIL_NOT_EXISTANT: -6,
  INVALID_ACCESS_TOKEN: -7,
  FAILED: 0,
  SUCCESS: 1
  
}


// Initialize Firebase
export const firebase = initializeApp(JSON.parse(fs.readFileSync("./firebaseConfig.json")));
export const db = getFirestore();

