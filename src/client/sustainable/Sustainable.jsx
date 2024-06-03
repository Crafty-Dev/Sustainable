import React from "react";
import styles from "./Sustainable.module.css"
import Ranking from "./ranking/Ranking.jsx";
import Info from "./info/Info.jsx";
import Home from "./home/Home.jsx";
import Account from "./account/Account.jsx";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { loadPostCache, retrieveAccountInfo } from "../logic/accountManager.js";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../logic/init.js";

export default class Sustainable extends React.Component {


    constructor(props){
        super(props)

        this.state = {page: Pages.HOME, account: undefined, postCache: []}
    }


    componentDidMount(){

        this.stopAuthListener = onAuthStateChanged(getAuth(), async (user) => {
            if(user){
                this.loadAccountData(user.uid)
                this.stopAccountChangeListener = onSnapshot(doc(collection(db, "accounts"), user.uid), (doc) => {
                    this.changeAccountData(doc.data());
                    loadPostCache().then(posts => {
                        this.setState({postCache: posts})
                    })
                })
            } else {
                if(this.stopAccountChangeListener !== undefined)
                    this.stopAccountChangeListener();

                this.setState({account: undefined})
            }
        })

    }

    async loadAccountData(userId){
        const data = (await retrieveAccountInfo(userId)).data;
        this.changeAccountData(data);
    }

    changeAccountData(data){

        if(data["profilePicture"] === undefined || data["profilePicture"] === null)
            data["profilePicture"] = "defaultPP.png";
        
        this.setState({account: data})
    }

    componentWillUnmount(){
        this.stopAuthListener();

        if(this.stopChangeListener !== undefined)
            this.stopAccountChangeListener();
    }


    render(){

        return (
            <div>
                <div className={styles.navbar}>
                    <div className={this.state.page == Pages.RANKING ? styles.ref_selected : styles.ref} onClick={() => this.setState({page: Pages.RANKING})}>Ranking</div>
                    <div className={this.state.page == Pages.HOME ? styles.ref_selected : styles.ref} onClick={() => this.setState({page: Pages.HOME})}>Home</div>
                    <div className={this.state.page == Pages.INFORMATION ? styles.ref_selected : styles.ref} onClick={() => this.setState({page: Pages.INFORMATION})}>Information</div>
                </div>
                <div className={styles.content}>
                    <Ranking render={this.state.page === Pages.RANKING}/>
                    <Home postCache={this.state.postCache} account={this.state.account} render={this.state.page === Pages.HOME}/>
                    <Info render={this.state.page === Pages.INFORMATION}/>
                    <Account account={this.state.account}/>
                </div>
            </div>
        )
    }
}

const Pages = {
    RANKING: "ranking",
    HOME: "home",
    INFORMATION: "info"
}