import React from "react";
import styles from "./Info.module.css"

export default class Info extends React.Component {


    constructor(props){
        super(props)

        this.state = {currentText: "text"}
    }

    componentDidMount(){
        this.getTextJson();
    }


    render(){

        if(!this.props.render)
            return null;

        return (
            <div className={styles.box}>
                <div className={styles.title}>Information</div>
                <div className={styles.content}>{}</div>
            </div>
        )
    }


    getTextJson(){
    }

    getTitle(name){
        //return this.getTextJson(name).title;
    }


    getContent(name){
        //return this.getTextJson(name).content;
    }


    getRefs(name){
        //return this.getTextJson(name).links;
    }

}