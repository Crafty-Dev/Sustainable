import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { ActionResult } from "./requestUtils";

export async function performSignUp(email, password, username){


    const auth = getAuth();

    console.log(auth)
    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    console.log(credentials.user)

    return {
        status: ActionResult.SUCCESS
    }

}


export async function performSignIn(email, password){

    console.log("Siiiign in")

    return {
        status: ActionResult.SUCCESS
    }
}