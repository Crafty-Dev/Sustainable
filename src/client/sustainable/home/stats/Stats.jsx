import React from "react";
import styles from "./Stats.module.css"


export default class Stats extends React.Component {


    constructor(props){
        super(props)
    }



    render(){

        return (
            <div className={styles.stats}>
                <div className={styles.title}>Stats</div>
            </div>
        )

    }
}