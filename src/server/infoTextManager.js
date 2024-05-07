import * as fs from "fs"
import { INFORMATION_PATH, INFORMATION_TEXT_PATH } from "./main.js"
import { convertToHtml } from "mammoth";

export function getInfoTexts(){

    const files = fs.readdirSync(INFORMATION_TEXT_PATH);
    let texts = [];
    for(var i = 0; i < files.length; i++){
        
        if(fs.statSync(INFORMATION_TEXT_PATH + files[i]).isDirectory())
            continue;

        const content = fs.readFileSync(INFORMATION_TEXT_PATH + files[i]);
        const json = JSON.parse(content.toString())
        json["id"] = files[i].substring(0, files[i].length - 5);
        texts.push(json)
    }

    //Wrap in json Object
    const data = JSON.parse("{}");
    data["texts"] = texts;

    const generalInformation = JSON.parse(fs.readFileSync(INFORMATION_PATH + "general.json").toString());
    data["generalInformation"] = generalInformation;

    return data;

}

export async function loadContent(path){

    return (await convertToHtml({path: path})).value;
}