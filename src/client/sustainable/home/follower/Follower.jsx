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
    }



    render(){

        return (
            <div className={styles.followers}>
                <div className={styles.title}>Followings</div>
            </div>
        )

    }
}


class Followers extends React.Component {

    constructor(props){
        super(props)
    }



    render(){

        return (
            <div className={styles.followers}>
                <div className={styles.title}>Followers</div>
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

            </div>
        )
    }


}