import { browserLocalPersistence, browserSessionPersistence, createUserWithEmailAndPassword, getAuth, setPersistence, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ActionResult, postJson } from "./requestUtils.js";
import { addDoc, collection, doc, documentId, getDoc, getDocs, or, orderBy, query, setDoc, where } from "firebase/firestore";
import { db } from "./init.js";
import { orderByValue } from "firebase/database";

export async function performSignUp(email, password, username, staySignedIn){

    if(await checkExistance(email))
        return {status: ActionResult.EMAIL_ALREADY_IN_USE}

    const auth = getAuth();
    setPersistence(auth, staySignedIn ? browserLocalPersistence : browserSessionPersistence)

    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(collection(db, "accounts"), credentials.user.uid), {
        "email": email,
        "username": username,
        "followers": [],
        "followings": [],
        "created": new Date().toUTCString(),
        "points": 0
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
            "uid": userId,

        },
        body: pic
    })

    const path = res.path;
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


export async function searchUsers(q){

    const userQuery = query(collection(db, "accounts"), where(documentId(), "==", q));
    let docs = await getDocs(userQuery);

    if(docs.empty)
        docs = await getDocs(query(collection(db, "accounts"), where("username", "==", q)))

    if(docs.empty)
        return [];


    const users = [];
 
    docs.forEach((docRef) => {
        const data = docRef.data();
        data["uid"] = docRef.id;
        if(data["profilePicture"] === undefined || data["profilePicture"] === null)
            data["profilePicture"] = "defaultPP.png";
        users.push(data);
    })

    return users;
}


export async function follow(uid){

    const userId = getAuth().currentUser.uid;

    const userDocRef = doc(collection(db, "accounts"), userId);
    const followDocRef = doc(collection(db, "accounts"), uid);

    const userDocData = (await getDoc(userDocRef)).data();
    const followDocData = (await getDoc(followDocRef)).data();

    if(!userDocData.followings.includes(uid))
        userDocData.followings.push(uid);
    
    if(!followDocData.followers.includes(userId))
        followDocData.followers.push(userId);

    await setDoc(userDocRef, userDocData);
    await setDoc(followDocRef, followDocData);
}


export async function createPost(category, subtitle, image, points, username, date, userProfilePic){

    const userId = getAuth().currentUser.uid;

    const q = query(doc(collection(db, "posts"), userId));
    const docRef = await getDoc(q);

    let posts = [];

    if(docRef.exists())
        posts = docRef.data().posts;

    posts.push({
        "username": username,
        "date": date,
        "hasImage": image !== undefined,
        "category": category,
        "subtitle": subtitle,
        "image": image !== undefined ? image : "none",
        "points": points
    })
    
    await setDoc(doc(collection(db, "posts"), userId), {
        "posts": posts
    });
    
    const userDoc = await getDoc(doc(collection(db, "accounts"), userId));
    const currentPoints = userDoc.data().points;

    await setDoc(doc(collection(db, "accounts"), userId), {
        "points": currentPoints + points
    }, {merge: true})

    const totalPoints = currentPoints + points;

    const ranks = await loadTopRanks();
    if(ranks.length === 0){
        await setDoc(doc(collection(db, "ranking"), "ranking"), {
            "ranks": [{
                "profilePicture": userProfilePic !== undefined ? userProfilePic : "none",
                "username": username,
                "points": totalPoints,
                "uid": userId
            }]
        })
        return;
    }

    for(var j = 0; j < ranks.length; j++){
        if(ranks[j].uid === userId){
            ranks.splice(j, 1);
            break;
        }
    }

    let i = ranks.length - 1;
    for(i; i >= 0; i--){
        const rankData = ranks[i];

        if(rankData.points > totalPoints)
            break;
    }

    ranks.splice(i + 1, 0, {
        "profilePicture": userProfilePic !== undefined ? userProfilePic : "none",
        "username": username,
        "points": totalPoints,
        "uid": userId
    })

    await setDoc(doc(collection(db, "ranking"), "ranking"), {
        "ranks": ranks
    })
}


export async function loadPostCache(){

    const postCache = [];

    const userId = getAuth().currentUser.uid;
    const userData = (await getDoc(doc(collection(db, "accounts"), userId))).data();
    
    const followers = userData.followings;
    followers.unshift(userId);

    for(var i = 0; i < Math.min(followers.length, 20); i++){
        const follower = followers[i];

        const followerPostDoc = (await getDoc(doc(collection(db, "posts"), follower)));
        if(!followerPostDoc.exists())
            continue;

        const followerPostData = followerPostDoc.data();
        if(followerPostData.posts.length === 0)
            continue;

        const data = followerPostData.posts[followerPostData.posts.length - 1];
        data["uid"] = follower;

        postCache.push(data);
    }

    return postCache;
}


export async function loadTopRanks(){

    const entries = [];

    const rankDoc = await getDoc(doc(collection(db, "ranking"), "ranking"));
    if(!rankDoc.exists())
        return entries;

    return rankDoc.data().ranks;

}