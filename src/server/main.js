import express from "express";
import ViteExpress from "vite-express";
import * as fs from "fs";
import "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getInfoTexts, loadContent } from "./infoTextManager.js";
import bodyParser from "body-parser";
import { ActionResult } from "../client/logic/requestUtils.js";
import { saveProfilePic } from "./imageManager.js";
import cors from "cors";

export const INFORMATION_PATH = "data/information/";
export const INFORMATION_TEXT_PATH = INFORMATION_PATH + "texts/";
export const INFORMATION_CONTENT_PATH = INFORMATION_PATH + "content/";
export const PROFILE_PICTURE_PATH = "data/profilePictures/";

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

app.post("/profilePicture", bodyParser.raw({type: ["image/jpeg", "image/png", "image/gif"], limit: "10mb"}), async (req, res) => {
  

  const fileEnding = req.headers["image-type"];
  const uid = req.headers["uid"];

  const files = fs.readdirSync(PROFILE_PICTURE_PATH);
  for(var i = 0; i < files.length; i++){
    const file = files[i];
    if(file.startsWith(uid + "."))
      fs.unlinkSync(PROFILE_PICTURE_PATH + file);
  }
  fs.writeFileSync(PROFILE_PICTURE_PATH + uid + "." + fileEnding, Buffer.from(req.body, "base64"), {encoding: "base64"});

  res.json({
    status: ActionResult.SUCCESS
  })
})

app.post("/getProfilePicture", async (req, res) => {

  console.log("Bamening")

  const files = fs.readdirSync(PROFILE_PICTURE_PATH);
  let pic = "none";
  for(var i = 0; i < files.length; i++){
    if(files[i].startsWith(req.body.uid + "."))
      pic = fs.readFileSync(PROFILE_PICTURE_PATH + files[i], "base64");
  }

  console.log(pic)
  res.json({
    status: ActionResult.SUCCESS,
    pic: pic
  })
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
  fs.mkdirSync(PROFILE_PICTURE_PATH, {
    recursive: true
  })
  console.log("Directories have been initialized")

}


function verifyHost(hostname){
  return hostname === "localhost";
}


