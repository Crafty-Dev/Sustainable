import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ActionResult } from "./requestUtils.js";
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "./init.js";

export async function performSignUp(email, password, username){

    if(await checkExistance(email))
        return {status: ActionResult.EMAIL_ALREADY_IN_USE}

    const auth = getAuth();

    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(collection(db, "accounts"), credentials.user.uid), {
        "email": email,
        "username": username
    })

    return await retrieveAccountInfo(credentials.user.uid);

}


export async function performSignIn(email, password){

    const auth = getAuth();
    const credentials = await signInWithEmailAndPassword(auth, email, password);

    return {
        status: ActionResult.SUCCESS
    }
}

async function checkExistance(email){
    const q = query(collection(db, "accounts"), where("email", "==", email))
    return !(await getDocs(q)).empty;
}

async function retrieveAccountInfo(userId){

    const docRef = doc(collection(db, "accounts"), userId)
    const snapshot = await getDoc(docRef);
    if(!snapshot.exists())
        return {status: ActionResult.EMAIL_NOT_EXISTANT};

    return {
        status: ActionResult.SUCCESS,
        data: snapshot.data()
    };
}