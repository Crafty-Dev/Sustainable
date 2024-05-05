import * as fs from "fs"
import { INFORMATION_PATH } from "./main.js"

export function getInfoTexts(){

    const files = fs.readdirSync(INFORMATION_PATH);
    let texts = [];
    for(var i = 0; i < files.length; i++){
        
        const content = fs.readFileSync(INFORMATION_PATH + "/" + files[i]);
        const json = JSON.parse(content.toString())
        json["id"] = files[i].substring(0, files[i].length - 5);
        texts.push(json)
    }

    //Wrap in json Object
    const data = JSON.parse("{}");
    data["texts"] = texts;

    return data;

}