import React from "react";
import styles from "./Follower.module.css"
import { follow, retrieveAccountInfo, searchUsers } from "../../../logic/accountManager";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../logic/init";


export default class Follower extends React.Component {


    constructor(props){
        super(props)

    }



    render(){

        return (
            <div className={styles.follower}>
                <div className={this.props.account !== undefined ? styles.fm_expand : styles.invis} onClick={() => this.props.toggleManager()}>Follower Manager</div>
                <Followings account={this.props.account} loggedIn={this.loggedIn()}/>
                <Followers account={this.props.account} loggedIn={this.loggedIn()}/>
            </div>
        )

    }

    loggedIn(){
        return this.props.account !== undefined;
    }
}

class Followings extends React.Component {

    constructor(props){
        super(props)

        this.state = {followings: []}
    }


    getSnapshotBeforeUpdate(prevProps){

        if(prevProps.account !== this.props.account){
            if(this.props.loggedIn)
                this.loadFollowings();
            else
                this.setState({followings: []})
        }

        return null;
    }

    componentDidUpdate(){

    }


    async loadFollowings(){

        const entries = [];

        const data = (await retrieveAccountInfo(getAuth().currentUser.uid)).data;
        for(var i = 0; i < data.followings.length; i++){
            const userId = data.followings[i];
            
            const userData = (await retrieveAccountInfo(userId)).data;

            if(userData["profilePicture"] === undefined || userData["profilePicture"] === null)
                userData["profilePicture"] = "defaultPP.png";

            entries.push(<FollowerEntry key={userId} uid={userId} pb={userData.profilePicture} username={userData.username} points={userData.points}/>)

        }
        this.setState({followings: entries})
    }


    render(){

        return (
            <div className={styles.followers}>
                <div className={styles.title}>Followings</div>
                <div className={styles.alert}>{this.props.loggedIn ? "" : "Du bist nicht angemeldet; melde dich an, um deine Follower einzusehen"}</div>
                <div className={styles.list}>{this.state.followings}</div>
            </div>
        )

    }
}


class Followers extends React.Component {

    constructor(props){
        super(props)

        this.state = {followers: []}
    }


    getSnapshotBeforeUpdate(prevProps){

        if(prevProps.account !== this.props.account){
            if(this.props.loggedIn)
                this.loadFollowers();
            else
                this.setState({followers: []})
        }

        return null;
    }

    componentDidUpdate(){

    }


    async loadFollowers(){

        const entries = [];

        const data = (await retrieveAccountInfo(getAuth().currentUser.uid)).data;
        for(var i = 0; i < data.followers.length; i++){
            const userId = data.followers[i];
            
            const userData = (await retrieveAccountInfo(userId)).data;

            if(userData["profilePicture"] === undefined || userData["profilePicture"] === null)
                userData["profilePicture"] = "defaultPP.png";

            entries.push(<FollowerEntry key={userId} uid={userId} pb={userData.profilePicture} username={userData.username} points={userData.points}/>)

        }
        this.setState({followers: entries})
    }


    render(){

        return (
            <div className={styles.followers}>
                <div className={styles.title}>Followers</div>
                <div className={styles.alert}>{this.props.loggedIn ? "" : "Du bist nicht angemeldet; melde dich an, um deine Follower einzusehen"}</div>
                <div className={styles.list}>{this.state.followers}</div>
            </div>
        )

    }
}


class FollowerEntry extends React.Component {

    constructor(props){
        super(props)
    }


    render(){

        return (
            <div className={styles.follower_entry}>
                <div className={styles.profile_pic}><img src={this.props.pb}/></div>
                <div className={styles.username}>{this.props.username}</div>
                <div className={styles.points}>{`(${this.props.points})`}</div>
            </div>
        )
    }


}


export class FollowerManager extends React.Component {


    constructor(props){
        super(props)

        this.state = {currentQuery: "", results: []}
    }


    componentDidUpdate(prevProps){

        if(!prevProps.render && this.props.render){
            const element = document.getElementById("searchbar");
        
            element.addEventListener("keyup", (e) => {
                if(e.key === "Enter")
                    this.performSearch();
            })
        }

    }

    componentDidMount(){
        if(this.props.render){
            const element = document.getElementById("searchbar");
        
            element.addEventListener("keyup", (e) => {
                if(e.key === "Enter")
                    this.performSearch();
            })
        }

    }

    render(){

        if(!this.props.render)
            return null;

        return (
            <div className={styles.bg}>
                <div className={styles.follower_manager}>
                    <div className={styles.fm_title}>Follower Manager</div>
                    <input id="searchbar" className={styles.fm_query} type="text" placeholder="Nutzer suchen..." onChange={(e) => {
                        this.setState({currentQuery: e.target.value})
                    }}/>
                    <div className={this.state.results.length > 0 ? styles.fm_result : styles.fm_result_invis}>
                        {this.state.results}
                    </div>
                </div>
            </div>
        )

    }

    performSearch(){
        
        this.setState({results: []})
        const entries = [];
        const selfId = getAuth().currentUser.uid;

        if(this.state.currentQuery !== "")
            searchUsers(this.state.currentQuery).then((users) => {
            for(var i = 0; i < users.length; i++){
                const user = users[i];
                console.log(user)
                entries.push(<ResultEntry key={user.uid} pp={user.profilePicture} uid={user.uid} username={user.username} points={user.points} date={new Date(Date.parse(user.created)).toDateString()} isSelf={selfId === user.uid} followes={this.followesUser.bind(this)}/>)
            }

            if(entries.length !== 0)
                this.setState({results: entries})
        })

    }

    followesUser(uid){
        return this.props.account.followings.includes(uid)
    }
}


class ResultEntry extends React.Component {


    constructor(props){
        super(props)

        this.state = {hovered: false}
    }

    componentDidUpdate(){
        console.log("Bamening: " + this.props.followes(this.props.uid))
    }

    render(){

        return(
            <div className={styles.fm_result_entry} onMouseOver={() => this.setState({hovered: true})} onMouseOut={() => this.setState({hovered: false})}>
                <img className={styles.re_pp} src={this.props.pp}/>
                <div className={styles.re_left}>
                    <div className={styles.re_name}>{this.props.username}</div>
                    <div className={styles.re_uid}>{this.props.uid}</div>
                </div>
                <div className={styles.re_right}>
                    <div className={styles.re_date}>Created: {this.props.date}</div>
                    <div className={styles.re_points}>Punkte: {this.props.points}</div>
                </div>
                <div onClick={() => this.performFollow()} className={this.state.hovered ? styles.follow_screen : styles.invis}><strong>{this.props.followes(this.props.uid) ? "Gefolgt!" : this.props.isSelf ? "Das bist du!" : `${this.props.username} folgen...`}</strong></div>
            </div>
        )

    }

    performFollow(){

        if(this.props.isSelf || this.props.followes(this.props.uid))
            return;

        follow(this.props.uid).then(() => this.setState({hovered: this.state.hovered}));

    }

}
