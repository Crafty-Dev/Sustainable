import React from "react";
import styles from "./Home.module.css"
import Follower from "./follower/Follower";
import Stats from "./stats/Stats";
import Feed from "./feed/Feed";



export default class Home extends React.Component {

    constructor(props){
        super(props)
    }


    render(){

        if(!this.props.render)
            return null;

        return (
            <div className={styles.home}>
                <Follower/>
                <Feed/>
                <Stats/>
            </div>
        )

    }
}