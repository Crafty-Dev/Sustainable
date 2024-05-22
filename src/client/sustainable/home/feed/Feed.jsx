import React from "react";
import styles from "./Feed.module.css"


export default class Feed extends React.Component {


    constructor(props){
        super(props)

    }



    render(){

        return (
            <div className={styles.feed}>
                    <Post username="Bernd" subtitle="Ein Vorbild für vegane Ernährung!" pic="test.jpg" date={new Date().toLocaleDateString()}/>
            </div>
        )

    }
}



class Post extends React.Component {


    constructor(props){
        super(props)
    }



    render(){


        return (
            <div className={styles.post}>
                <div className={styles.prev}><img src="arrow.png"/></div>
                <div className={styles.content_bg}>
                    <div className={styles.content}>
                        <div className={styles.user}>Gepostet von: <strong>{this.props.username}</strong></div>
                        <div className={styles.date}>{this.props.date}</div>
                        <div className={styles.content_pic_bg}>
                        <img className={styles.content_pic_blured_top} src={this.props.pic}/>
                        <img className={styles.content_pic_blured_bottom} src={this.props.pic}/>
                        <img className={styles.content_pic} src={this.props.pic}/>
                        </div>
                        <div className={styles.subtitle}>
                            <div className={styles.subtitle_user}><strong>{this.props.username}</strong>:</div>
                            <div className={styles.subtitle_text}>{this.props.subtitle}</div>
                        </div>
                        </div>
                    </div>
                <div className={styles.next}><img src="arrow.png"/></div>
            </div>
        )

    }

}