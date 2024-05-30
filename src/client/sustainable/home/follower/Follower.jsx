import React from "react";
import styles from "./Follower.module.css"


export default class Follower extends React.Component {


    constructor(props){
        super(props)
    }



    render(){

        return (
            <div className={styles.follower}>
                <Followings/>
                <Followers/>
            </div>
        )

    }
}

class Followings extends React.Component {

    constructor(props){
        super(props)

        this.state = {followings: []}
    }

    componentDidMount(){
        this.loadFollowings();
    }


    loadFollowings(){

        const list = [];
        for(var i = 0; i < 10; i++){
            list.push(<FollowerEntry username={`Test Mensch - ${i}`} pb={"defaultPP.png"}/>)
        }

        this.setState({followings: list})
    }


    render(){

        return (
            <div className={styles.followers}>
                <div className={styles.title}>Followings</div>
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


    componentDidMount(){
        this.loadFollowings();
    }


    loadFollowings(){

        const list = [];
        for(var i = 0; i < 10; i++){
            list.push(<FollowerEntry username={`Test Mensch - ${i}`} pb={"defaultPP.png"}/>)
        }

        this.setState({followers: list})
    }


    render(){

        return (
            <div className={styles.followers}>
                <div className={styles.title}>Followers</div>
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
            </div>
        )
    }


}


class FollowerManager extends React.Component {


    constructor(props){
        super(props)
    }

    render(){

        if(!this.props.render)
            return null;

        return (
            <div className={styles.follower_manager}>
                
            </div>
        )

    }

}