import React from "react";
import styles from "./Home.module.css"
import Follower, { FollowerManager } from "./follower/Follower";
import Stats from "./stats/Stats";
import Feed, { PostManager } from "./feed/Feed";
import { getAuth, onAuthStateChanged } from "firebase/auth";



export default class Home extends React.Component {

    constructor(props){
        super(props)

        this.state = {subPage: SubPage.FEED}
    }


    componentDidUpdate(prevProps){
        if(prevProps.account !== this.props.account && this.props.account === undefined)
            this.setState({subPage: SubPage.FEED})
    }

    render(){

        if(!this.props.render)
            return null;

        return (
            <div className={styles.home}>
                <Follower account={this.props.account} toggleManager={this.toggleFollowerManager.bind(this)}/>
                <FollowerManager account={this.props.account} render={this.state.subPage === SubPage.FOLLOWER_MANAGER}/>
                <Feed account={this.props.account} render={this.state.subPage === SubPage.FEED}/>
                <PostManager account={this.props.account} render={this.state.subPage === SubPage.POST_MANAGER}/>
                <Stats account={this.props.account} toggleManager={this.togglePostManager.bind(this)}/>
            </div>
        )

    }


    setPage(page){
        this.setState({subPage: page}, () => {
            console.log(this.state.subPage)
        })
    }

    toggleFollowerManager(){
        this.setState({subPage: this.state.subPage === SubPage.FOLLOWER_MANAGER ? SubPage.FEED : SubPage.FOLLOWER_MANAGER})
    }
    togglePostManager(){
        this.setState({subPage: this.state.subPage === SubPage.POST_MANAGER ? SubPage.FEED : SubPage.POST_MANAGER})
    }
}


export const SubPage = {
    FEED: "feed",
    FOLLOWER_MANAGER: "followerManager",
    POST_MANAGER: "postManager"
}