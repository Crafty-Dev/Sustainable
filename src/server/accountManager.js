import { addDoc, collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { ActionResult, HASH_SET_PATH, db } from "./main.js";
import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID } from "crypto";
import { existsSync, readFileSync, writeFileSync } from "fs";


export async function createAccount(data){

    if(await checkExistance(data.email))
        return {status: ActionResult.EMAIL_ALREADY_IN_USE};

    const accountEntry = {
        email: data.email,
        username: data.username,
        password: encryptPassword(data.password),
        hashId: createHashEntry(),
        cryptoId: createCryptoData()
    }

    await addDoc(collection(db, "accounts"), accountEntry)

    return { 
        status: ActionResult.SUCCESS,
        accessToken: createAccessToken({
            email: accountEntry.email,
            hashId: accountEntry.hashId,
            verifyingId: accountEntry.cryptoId.split(".")[1],
            iv: accountEntry.cryptoId.split(".")[0],
            key: getKey(accountEntry.hashId)
        })
    };
}

export async function loginAccount(data){

    const q = query(collection(db, "accounts"), where("email", "==", data.email));
    const docRef = await getDocs(q);
    if(docRef.size == 0)
        return { status: ActionResult.EMAIL_NOT_EXISTANT }

    const doc = docRef.docs.at(0);
    const docData = doc.data();

    if(docData.password !== encryptPassword(data.password))
        return { status: ActionResult.INVALID_PASSWORD }


    return {
        status: ActionResult.SUCCESS,
        accessToken: createAccessToken({
            email: docData.email,
            hashId: docData.hashId,
            verifyingId: docData.cryptoId.split(".")[1],
            iv: docData.cryptoId.split(".")[0],
            key: getKey(docData.hashId)
        })
    }
}


async function checkExistance(email){

    const q = query(collection(db, "accounts"), where("email", "==", email))
    const snapshot = await getDocs(q);

    return snapshot.size > 0;
}

function encryptPassword(password){
    const hash = createHash("sha256");
    hash.update(password);
    return hash.digest("hex");
}

function createHashEntry(){

    const file = HASH_SET_PATH + "hash_sets.json";

    if(!existsSync(file))
        writeFileSync(file, "{}");

    const data = JSON.parse(readFileSync(file).toString())


    const hashId = randomUUID().toString();
    const key = randomBytes(32).toString("base64");

    data[hashId] = key;
    writeFileSync(file, JSON.stringify(data, null, 4));
    return hashId;
}

function getKey(hashId){
    return JSON.parse(readFileSync(HASH_SET_PATH + "hash_sets.json").toString())[hashId];
}

function createCryptoData(){

    const iv = randomBytes(16);
    const verifyingId = randomUUID().toString();

    return iv.toString("base64") + "." + verifyingId;
}

function createAccessToken(data){

    const tokenData = {
        email: data.email,
        uuid: data.verifyingId,
        created: new Date().toUTCString(),
        expiresIn: 1000 * 60 * 60 * 24 * 7
    }

    const cipher = createCipheriv("aes-256-cbc", Buffer.from(data.key, "base64"), Buffer.from(data.iv, "base64"));
    let encrypted = cipher.update(JSON.stringify(tokenData));
    encrypted = Buffer.concat([encrypted, cipher.final()])

    return encrypted.toString("base64url") + "." + data.hashId;
}


async function validateAccessToken(accessToken){

    if(!existsSync(HASH_SET_PATH + "hash_sets.json"))
        return false;

    const encryptedData = accessToken.split(".")[0];
    const hashId = accessToken.split(".")[1];

    const key = getKey(hashId);

    const q = query(collection(db, "accounts"), where("hashId", "==", hashId));
    const docRef = await getDocs(q);
    if(docRef.empty)
        return false;

    const doc = docRef.docs.at(0);
    const docData = doc.data();

    const cryptoId = docData.cryptoId;
    const iv = cryptoId.split(".")[0];
    const uuid = cryptoId.split(".")[1];

    let decrypted = undefined;

    try {
        const decipher = createDecipheriv("aes-256-cbc", Buffer.from(key, "base64"), Buffer.from(iv, "base64"))
        decrypted = decipher.update(Buffer.from(encryptedData, "base64url"));
        decrypted = Buffer.concat([decrypted, decipher.final()])
    }catch(error){
        return false;
    }


    const data = JSON.parse(decrypted.toString());
    if(data.email !== docData.email)
        return false;

    if(data.uuid !== uuid)
        return false;

    if(Date.parse(data.created) + data.expiresIn < new Date())
        return false;

    return data.email;
}


export async function getAccountInfo(accessToken) {

    const ref = await validateAccessToken(accessToken);

    if(!ref)
        return {status: ActionResult.INVALID_ACCESS_TOKEN};

    const account = await getAccountByMail(ref);
    if(account === null)
        return {status: ActionResult.FAILED}

    return {
        status: ActionResult.SUCCESS,
        email: account.email,
        username: account.username
    }
}


async function getAccountByMail(email){
    const q = query(collection(db, "accounts"), where("email", "==", email));
    const docRef = await getDocs(q);

    if(docRef.empty)
        return null;

    return docRef.docs.at(0).data();
}

export async function refreshToken(accessToken){

    const ref = await validateAccessToken(accessToken);
    if(!ref)
        return {status: ActionResult.INVALID_ACCESS_TOKEN}

    const account = await getAccountByMail(ref);
    if(accessToken === null)
        return {status: ActionResult.FAILED}

    const refreshed = createAccessToken({
        email: account.email,
        hashId: account.hashId,
        verifyingId: account.cryptoId.split(".")[1],
        iv: account.cryptoId.split(".")[0],
        key: getKey(account.hashId)
    })

    return {
        status: ActionResult.SUCCESS,
        refreshedToken: refreshed
    }

}
