import React from "react";
import styles from "./Account.module.css"
import { ActionResult, getStatusText, postJson } from "../../logic/requestUtils.js";
import { performLogout, performSignIn, performSignUp, retrieveAccountInfo } from "../../logic/accountManager.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default class Account extends React.Component {


    constructor(props){
        super(props)

        this.state = {expanded: true, account: undefined}


    }


    componentDidMount(){

        this.stopAuthListener = onAuthStateChanged(getAuth(), async (user) => {
            if(user){
                const data = (await retrieveAccountInfo(user.uid)).data;

                console.log(data)

                if(data["profilePic"] === undefined)
                    data["profilePic"] = "defaultPP.png"

                this.setState({account: data})
            }
        })
    }

    componentWillUnmount(){
        this.stopAuthListener();
    }


    render(){


        return (
            <div>
                <div id="account_btn" className={this.state.expanded ? styles.account_expanded : styles.account} onClick={() => this.setState({expanded: !this.state.expanded})} onMouseEnter={() => {
                        
                        if(this.state.expanded)
                            return;
                        
                        document.getElementById("account_btn").animate([
                            {
                                color: "rgb(92, 105, 116)"
                            },
                            {
                                color: "rgb(184, 184, 184)"
                            }
                        ], 500)
                }}>
                {this.state.account !== undefined ? <UserLoggedIn username={this.state.account.username}/> : <UserLoggedOut/>}
                </div>
                <LoginScreen render={this.state.expanded && !this.loggedIn()} handleSuccess={this.handleLoginSuccess.bind(this)}/>
                <LogoutScreen render={this.state.expanded && this.loggedIn()} handleSuccess={this.handleLogoutSuccess.bind(this)} pb={this.loggedIn() ? this.state.account["profilePic"] : undefined}/>
            </div>

        )
    }

    loggedIn(){
        return this.state.account !== undefined;
    }

    handleLoginSuccess(data){

        this.setState({account: data, expanded: false})
    }

    handleLogoutSuccess(){
        this.setState({account: undefined, expanded: false})
    }

}


class UserLoggedIn extends React.Component {

    constructor(props){
        super(props)
    }


    render(){

        return (
            <div className={styles.loggedIn}>
                <div className={styles.loggedIn_label}>Logged in as</div>
                <div className={styles.loggedIn_username}>{this.props.username}</div>
            </div>
        )
    }
}

class UserLoggedOut extends React.Component {

    constructor(props){
        super(props)

    }


    render(){

        return (
            <div>
                <div className={styles.loggedOut}>
                Sign in
                </div>
            </div>
        )

    }

}

class LoginScreen extends React.Component {

    constructor(props){
        super(props)

        this.state = {signUp: false}
    }


    render(){

        if(!this.props.render)
            return null;

        return (
            <div className={styles.loginScreen}>
                <div className={styles.signIn_Up_switch}>
                    <div className={this.state.signUp ? styles.switch_inactive : styles.switch_active} onClick={() => this.setState({signUp: false})}>Sign in</div>
                    <div className={this.state.signUp ? styles.switch_active : styles.switch_inactive} onClick={() => this.setState({signUp: true})}>Sign up</div>
                </div>
                <SignIn render={!this.state.signUp} handleSuccess={this.props.handleSuccess}/>
                <SignUp render={this.state.signUp} handleSuccess={this.props.handleSuccess}/>
            </div>
        )
    }

}

class SignIn extends React.Component {

    constructor(props){
        super(props)

        this.state = {email: undefined, password: undefined, statusMsg: undefined, processing: false}
    }

    render(){

        if(!this.props.render)
            return null;

        return (
            <div className={styles.sign_in}>
                <div className={styles.sign_title}>Sign In</div>
                <div className={styles.sign_label}>E-Mail</div>
                <input className={styles.sign_input} type="email" onChange={(e) => {
                    this.setState({email: e.currentTarget.value})
                }}/>
                <div className={styles.sign_label}>Passwort</div>
                <input className={styles.sign_input} type="password" onChange={(e) => {
                    this.setState({password: e.currentTarget.value})
                }}/>
                {this.state.statusMsg}
                <div className={this.state.processing ? styles.sign_confirm_processing : styles.sign_confirm} onClick={() => this.login()}>Anmelden</div>
            </div>
        )
    }


    setStatusMessage(status){

        this.setState({statusMsg: <StatusMessage message={getStatusText(status)}/>})

    }

    async login(){
        
        if(this.state.processing)
            return;

        this.setState({processing: true})

        const res = await this.performLogin();
        console.log(res)
        if(res.status !== ActionResult.SUCCESS)
            this.setStatusMessage(res.status)
        else
            this.props.handleSuccess(res.data);

        this.setState({processing: false})

    }

    async performLogin(){


        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if(this.state.email === undefined || !pattern.test(this.state.email))
            return {status: ActionResult.INVALID_EMAIL};

        if(this.state.password === undefined)
            return {status: ActionResult.INVALID_PASSWORD};


        const res = await performSignIn(this.state.email, this.state.password);

        if(res === null)
            return {status: ActionResult.FAILED};

        return res;
    }

}

class SignUp extends React.Component {

    constructor(props){
        super(props)

        this.state = {email: undefined, username: undefined, password: undefined, rep_password: undefined, statusMsg: undefined, processing: false}
    }

    render(){

        if(!this.props.render)
            return null;

        return (
            <div className={styles.sign_up}>
                <div className={styles.sign_title}>Sign Up</div>
                <div className={styles.sign_label}>E-Mail</div>
                <input className={styles.sign_input} type="email" onChange={(e) => {
                    this.setState({email: e.currentTarget.value})
                }}/>
                <div className={styles.sign_label}>Nutzername</div>
                <input className={styles.sign_input} type="text" onChange={(e) => {
                    this.setState({username: e.currentTarget.value})
                }}/>
                <div className={styles.sign_label}>Passwort</div>
                <input className={styles.sign_input} type="password" onChange={(e) => {
                    this.setState({password: e.currentTarget.value})
                }}/>
                <div className={styles.sign_label}>Passwort wiederholen</div>
                <input className={styles.sign_input} type="password" onChange={(e) => {
                    this.setState({rep_password: e.currentTarget.value})
                }}/>
                {this.state.statusMsg}
                <div className={this.state.processing ? styles.sign_confirm_processing : styles.sign_confirm} onClick={() => this.signUp()}>Registrieren</div>
            </div>
        )
    }

    setStatusMessage(status){

        this.setState({statusMsg: <StatusMessage message={getStatusText(status)}/>})

    }

    async signUp(){

        if(this.state.processing)
            return;

        this.setState({processing: true})

        const res = await this.performSignUp();
        console.log(res)
        if(res.status !== ActionResult.SUCCESS)
            this.setStatusMessage(res.status)
        else
            this.props.handleSuccess(res.data);

        this.setState({processing: false})
    }

    async performSignUp(){



        if(this.state.password !== this.state.rep_password)
            return {status: ActionResult.PASSWORDS_NOT_MATCHING};

        console.log(1)
        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if(this.state.email === undefined || !pattern.test(this.state.email))
            return {status: ActionResult.INVALID_EMAIL};

        if(this.state.username === undefined)
            return {status: ActionResult.INVALID_USERNAME};

        if(this.state.password === undefined)
            return {status: ActionResult.INVALID_PASSWORD};


        const res = await performSignUp(this.state.email, this.state.password, this.state.username);

        if(res === null)
            return {status: ActionResult.FAILED};

        return res;
    }
}

class LogoutScreen extends React.Component {

    constructor(props){
        super(props)
    }

    render(){

        if(!this.props.render)
            return null;

        return (
            <div className={styles.logoutScreen}>
                <div className={styles.sign_title}>Account Optionen</div>
                <div className={styles.pb}>
                    <img className={styles.pic} src={this.props.pb}/>
                    <div onClick={() => document.getElementById("pic_selector").click()} className={styles.pic_selector_fake}>Ändern</div>
                    <input id="pic_selector" className={styles.pic_selector} type="file" accept="image/png, image/gif, image/jpeg" onChange={(event) => {
                        this.performProfilePicChange(event.currentTarget.files[0])
                    }}/>
                </div>
                <div className={styles.logout} onClick={() => this.performLogout()}>Abmelden</div>
            </div>
        )
    }

    /**
     * 
     * @param {File} pic 
     */
    async performProfilePicChange(pic){

        const reader = new FileReader();
        reader.onloadend = () => {
            postJson("http://localhost:3000/profilePicture", {
                method: "POST",
                headers: {
                    "Content-Type": pic.type,
                    "Content-Length": pic.size
                },
                body: pic
            })
        }
        reader.readAsDataURL(pic)
    }

    async performLogout(){

        const res = await performLogout();
        if(res.status === ActionResult.SUCCESS)
            this.props.handleSuccess();
    }

}

class StatusMessage extends React.Component {


    constructor(props){
        super(props)
    }


    render(){

        return (
            <div className={styles.status_message}>
                {this.props.message}
            </div>
        )

    }

}