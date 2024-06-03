import React from "react";
import styles from "./Stats.module.css"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { retrieveAccountInfo } from "../../../logic/accountManager";


export default class Stats extends React.Component {


    constructor(props){
        super(props)
    }


    render(){

        return (
            <div className={styles.stats}>
                <div className={this.props.account !== undefined ? styles.fm_expand : styles.invis} onClick={() => this.props.toggleManager()}>Post Manager</div>
                <div className={styles.title}>Stats</div>
                <AccountStats render={this.props.account !== undefined} account={this.props.account}/>
                <div className={styles.alert}>{this.props.account !== undefined ? "" : "Du bist nicht angemeldet; melde dich an, um deine Follower einzusehen"}</div>
            </div>
        )

    }
}


class AccountStats extends React.Component {


    constructor(props){
        super(props)
    }


    render(){

        if(!this.props.render)
            return null;

        return (
            <div className={styles.account_stats}>
                
                <img className={styles.pb} src={this.props.account.profilePicture}/>
                <div className={styles.stat}>Punkte: <span className={styles.stat_value}>{this.props.account.points}</span></div>
                <div className={styles.stat}>Followings: <span className={styles.stat_value}>{this.props.account.followings.length}</span></div>
                <div className={styles.stat}>Followers: <span className={styles.stat_value}>{this.props.account.followers.length}</span></div>                


            </div>
        )

    }

}