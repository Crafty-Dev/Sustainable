import * as fs from "fs";
import { PROFILE_PICTURE_PATH } from "./main.js";

export async function saveProfilePic(data){

    const uid = data.userId;
    const pic_encoded = data.pic.replace("data:image/jpeg;base64,", "");
    console.log(pic_encoded)

    fs.mkdirSync(PROFILE_PICTURE_PATH + uid, {
        recursive: true
    });

    const decoded = Buffer.from(pic_encoded, "base64");
   fs.writeFileSync(PROFILE_PICTURE_PATH + uid + "/profilePic.jpg", decoded);

}