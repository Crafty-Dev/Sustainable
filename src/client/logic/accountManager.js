import { browserLocalPersistence, browserSessionPersistence, createUserWithEmailAndPassword, getAuth, setPersistence, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ActionResult, postJson } from "./requestUtils.js";
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "./init.js";

export async function performSignUp(email, password, username, staySignedIn){

    if(await checkExistance(email))
        return {status: ActionResult.EMAIL_ALREADY_IN_USE}

    const auth = getAuth();
    setPersistence(auth, staySignedIn ? browserLocalPersistence : browserSessionPersistence)

    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(collection(db, "accounts"), credentials.user.uid), {
        "email": email,
        "username": username
    })

    return await retrieveAccountInfo(credentials.user.uid);

}


export async function performSignIn(email, password, staySignedIn){

    if(!checkExistance(email))
        return {status: ActionResult.EMAIL_NOT_EXISTANT};

    const auth = getAuth();
    setPersistence(auth, staySignedIn ? browserLocalPersistence : browserSessionPersistence)
    try {
        const credentials = await signInWithEmailAndPassword(auth, email, password);
        return await retrieveAccountInfo(credentials.user.uid);
    }catch(e){
        return {status: ActionResult.INVALID_PASSWORD};
    }

}

export async function performProfilePicChange(userId, pic){

    const res = await postJson("http://localhost:3000/profilePicture", {
        method: "POST",
        headers: {
            "Content-Type": pic.type,
            "Image-Type": pic.name.split(".")[pic.name.split(".").length - 1],
            "Content-Length": pic.size,
            "uid": userId
        },
        body: pic
    })

    const path = res.path;
    console.log(path)
    const docRef = doc(collection(db, "accounts"), userId);
    await setDoc(docRef, {profilePicture: path}, {merge: true})

}

async function checkExistance(email){
    const q = query(collection(db, "accounts"), where("email", "==", email))
    return !(await getDocs(q)).empty;
}

export async function retrieveAccountInfo(userId){

    const docRef = doc(collection(db, "accounts"), userId)
    const snapshot = await getDoc(docRef);
    if(!snapshot.exists())
        return {status: ActionResult.EMAIL_NOT_EXISTANT};

    return {
        status: ActionResult.SUCCESS,
        data: snapshot.data()
    };
}

export async function performLogout(){

    const auth = getAuth();
    if(!auth.currentUser)
        return {status: ActionResult.FAILED};


    await signOut(auth);
    return {status: ActionResult.SUCCESS}
}
