import React from "react";
import styles from "./Account.module.css"
import { ActionResult, getStatusText, postJson } from "../../util.js";

export default class Account extends React.Component {


    constructor(props){
        super(props)

        this.state = {expanded: false, account: undefined}
    }


    render(){


        return (
            <div>
                <div id="account_btn" className={this.state.expanded ? styles.account_expanded : styles.account} onClick={() => this.setState({expanded: !this.state.expanded})} onMouseEnter={() => {
                        
                        if(this.state.expanded)
                            return;
                        
                        document.getElementById("account_btn").animate([
                            {
                                color: "rgb(92, 116, 92)"
                            },
                            {
                                color: "rgb(184, 184, 184)"
                            }
                        ], 500)
                }}>
                {this.state.account !== undefined ? <UserLoggedIn username={this.state.account.username}/> : <UserLoggedOut/>}
                </div>
                <LoginScreen render={this.state.expanded && this.state.account === undefined} handleSuccess={this.handleSuccess.bind(this)}/>
            </div>

        )
    }

    componentDidMount(){
        this.loadAccountFromCache();
    }

    async loadAccountFromCache(){

        if(sessionStorage.getItem("accountCache") === null || sessionStorage.getItem("accountCache") === undefined)
            return;

        let accountData = JSON.parse(sessionStorage.getItem("accountCache"));

        this.setState({account: accountData})

        const res = await this.refreshAccessToken(accountData.accessToken);

        if(res.status === ActionResult.SUCCESS){
            accountData["accessToken"] = res.refreshedToken;
            sessionStorage.setItem("accountCache", JSON.stringify(accountData))
        }

        if(res.status !== ActionResult.SUCCESS){
            accountData = undefined;
            sessionStorage.removeItem("accountCache")
        }

        this.setState({account: accountData})
    }

    async refreshAccessToken(oldAccessToken){

        const body = JSON.stringify({
            accessToken: oldAccessToken
        })

        return await postJson("http://localhost:3000/account/refreshToken", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        })
    }

    async handleSuccess(accessToken) {
        
        const body = JSON.stringify({
            accessToken: accessToken
        })

        const res = await postJson("http://localhost:3000/account/info", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        })

        const accountData = res;
        delete accountData["status"]
        accountData["accessToken"] = accessToken;


        sessionStorage.setItem("accountCache", JSON.stringify(accountData))
        this.setState({account: accountData, expanded: false})

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

        this.state = {email: undefined, password: undefined, statusMsg: undefined}
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
                <div className={styles.sign_confirm} onClick={() => this.performLogin()}>Anmelden</div>
            </div>
        )
    }


    setStatusMessage(status){

        this.setState({statusMsg: <StatusMessage message={getStatusText(status)}/>})

    }

    async performLogin(){

        const res = await this.performLoginRequest();
        if(res.status !== ActionResult.SUCCESS){
            this.setStatusMessage(res.status)
            return;
        }

        if(!("accessToken" in res))
            this.setStatusMessage(ActionResult.INVALID_ACCESS_TOKEN)
        else
            this.props.handleSuccess(res.accessToken);

    }

    async performLoginRequest(){

        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if(this.state.email === undefined || !pattern.test(this.state.email))
            return {status: ActionResult.INVALID_EMAIL};

        if(this.state.password === undefined)
            return {status: ActionResult.INVALID_PASSWORD};

        const body = JSON.stringify({
            email: this.state.email,
            password: this.state.password
        })

        const res = await postJson("http://localhost:3000/account/signIn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        })

        if(res === null)
            return {status: ActionResult.FAILED};

        return res;
    }

}

class SignUp extends React.Component {

    constructor(props){
        super(props)

        this.state = {email: undefined, username: undefined, password: undefined, rep_password: undefined, statusMsg: undefined}
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
                <div className={styles.sign_confirm} onClick={() => this.performSignUp()}>Registrieren</div>
            </div>
        )
    }

    setStatusMessage(status){

        this.setState({statusMsg: <StatusMessage message={getStatusText(status)}/>})

    }

    async performSignUp(){

        const res = await this.performSignUpRequest();
        if(res.status !== ActionResult.SUCCESS){
            this.setStatusMessage(res.status)
            return;
        }

        if(!("accessToken" in res))
            this.setStatusMessage(ActionResult.INVALID_ACCESS_TOKEN)
        else
            this.props.handleSuccess(res.accessToken);

    }


    async performSignUpRequest(){


        if(this.state.password !== this.state.rep_password)
            return {status: ActionResult.PASSWORDS_NOT_MATCHING};

        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if(this.state.email === undefined || !pattern.test(this.state.email))
            return {status: ActionResult.INVALID_EMAIL};

        if(this.state.username === undefined)
            return {status: ActionResult.INVALID_USERNAME};

        if(this.state.password === undefined)
            return {status: ActionResult.INVALID_PASSWORD};

        const body = JSON.stringify({
            email: this.state.email,
            username: this.state.username,
            password: this.state.password
        })

        const res = await postJson("http://localhost:3000/account/signUp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        })

        if(res === null)
            return {status: ActionResult.FAILED};

        return res;
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