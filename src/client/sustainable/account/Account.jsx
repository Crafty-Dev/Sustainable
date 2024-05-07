import React from "react";
import styles from "./Account.module.css"

export default class Account extends React.Component {


    constructor(props){
        super(props)

        this.state = {loggedIn: false, expanded: true}
    }


    render(){


        return (
            <div>
                <div id="account_btn" className={this.state.expanded ? styles.account_expanded : styles.account} onClick={() => this.setState({expanded: !this.state.expanded})} onMouseEnter={() => {
                        
                        if(this.state.expanded)
                            return;
                        
                        document.getElementById("account_btn").animate([
                            {
                                color: "rgb(92, 116, 92) "
                            },
                            {
                                color: "rgb(184, 184, 184)"
                            }
                        ], 500)
                }}>
                {this.state.loggedIn ? <UserLoggedIn/> : <UserLoggedOut/>}
                </div>
                <LoginScreen render={this.state.expanded}/>
            </div>

        )
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
                <div className={styles.loggedIn_username}>Bernd</div>
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
                <SignIn render={!this.state.signUp}/>
                <SignUp render={this.state.signUp}/>
            </div>
        )
    }

}

class SignIn extends React.Component {

    constructor(props){
        super(props)

        this.state = {email: undefined, password: undefined}
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
                <div className={styles.sign_confirm} onClick={() => this.performLogin()}>Anmelden</div>
            </div>
        )
    }

    performLogin(){
        console.log("Moin")
    }

}

class SignUp extends React.Component {

    constructor(props){
        super(props)

        this.state = {email: undefined, username: undefined, password: undefined, rep_password: undefined}
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
                <div className={styles.sign_confirm}>Registrieren</div>
            </div>
        )
    }


    performSignUp(){

    }

}