import React from "react";
import styles from "./Feed.module.css"
import { getAuth } from "firebase/auth";
import { ActionResult, postJson } from "../../../logic/requestUtils";
import { SusCategory } from "../../../logic/susCategories";
import { createPost } from "../../../logic/accountManager";


export default class Feed extends React.Component {


    constructor(props){
        super(props)

    }

    render(){

        if(!this.props.render)
            return null;

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


export class PostManager extends React.Component {


    constructor(props){
        super(props)

        this.state = {processing: false, hasImage: true, image: undefined, text: undefined, subtitle: undefined, category_q: "", category: undefined, postId: undefined, categoryResults: [], categoriesExpanded: false}
    }

    componentDidMount(){

        const entries = [];

        for(const category in SusCategory){
            entries.push(<CategoryEntry key={category} categoryId={category} desc={SusCategory[category].desc} points={SusCategory[category].points} selectCategory={this.selectCategory.bind(this)}/>)
        }

        this.setState({categoryResults: entries})

    }

    componentDidUpdate(prevProps, prevState){
        if(((prevProps.render !== this.props.render && this.props.render) && this.props.account === undefined) || prevProps.account === undefined && this.props.account !== undefined){
            this.setState({hasImage: false, image: undefined, text: undefined, subtitle: undefined, category: undefined, postId: this.genPostId()});
        }

        if(prevState.category_q !== this.state.category_q)
            this.updateQuery();
    }

    updateQuery(){

        const s = "";
        s.toLowerCase

        const entries = [];
        for(const category in SusCategory){
            if(SusCategory[category].desc.toLowerCase().startsWith(this.state.category_q.toLowerCase()) || this.state.category_q === "")
                entries.push(<CategoryEntry key={category} categoryId={category} desc={SusCategory[category].desc} points={SusCategory[category].points} selectCategory={this.selectCategory.bind(this)}/>)
        }

        this.setState({categoryResults: entries})
    }

    genPostId(){ 
        const date = new Date();
        const id = getAuth().currentUser.uid + "_" + date.getFullYear() + "_" + date.getMonth() + "_" + date.getDay() + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds();
        
        console.log(id)
        return id;
    }

    selectCategory(catId){
        this.setState({category: catId, categoriesExpanded: false})
        document.getElementById("category_selector").value = SusCategory[catId].desc;
    }

    render(){

        if(!this.props.render || this.props.account === undefined)
            return null;

        return (
            <div className={styles.bg}>
                <div className={styles.post_manager}>
                    <div className={styles.pm_title}>Post Manager</div>
                    <div className={styles.flex}>
                        <div className={styles.img_switch} onClick={() => {
                            this.setState({hasImage: !this.state.hasImage})
                        }}>{this.state.hasImage ? "Bild: Ja" : "Bild: Nein"}</div>
                    
                        <div onClick={() => document.getElementById("image_selector").click()} className={this.state.hasImage ? styles.image_selector_fake : styles.invis}>Bild auswählen</div>
                        <input id="image_selector" className={styles.invis} type="file" accept="image/png, image/gif, image/jpeg" onChange={(e) => {
                        this.uploadPostImage(e.target.files[0])
                    }}/>
                    </div>
                    <div className={styles.flex}>
                    <input className={styles.subtitle_selector} type="text" placeholder="Untertitel hinzufügen..." onChange={(e) => {
                        this.setState({subtitle: e.target.value})
                    }}/>
                    <input id="category_selector" className={styles.category_selector} type="text" placeholder="Kategorie wählen..." onChange={(e) => {
                        this.setState({category_q: e.target.value})
                    }} onFocus={() => {
                        this.setState({categoriesExpanded: true})
                    }}/>
                    </div>
                    <div className={this.state.categoriesExpanded ? styles.category_list : styles.invis}>
                        {this.state.categoryResults}
                    </div>
                    <PostPreview hasImage={this.state.hasImage} username={this.props.account.username} date={new Date().toDateString()} pic={this.state.image} text={this.state.category !== undefined ? SusCategory[this.state.category].desc : ""} points={this.state.category !== undefined ? SusCategory[this.state.category].points : ""} subtitle={this.state.subtitle}/>
                    <div className={styles.create_btn} onClick={() => {
                        this.performPostCreation();
                    }}>Post erstellen</div>
                </div>
            </div>
        )

    }


    performPostCreation(){

        if(this.state.processing)
            return;

        this.setState({processing: true})

        if((this.state.hasImage && this.state.image === undefined) || this.state.category === undefined || this.state.subtitle === undefined){
            this.setState({processing: false})
            return;
        }

        console.log("Bamening")
        createPost(this.state.category, this.state.subtitle, this.state.image, SusCategory[this.state.category].points).then(() => {
            this.setState({processing: false});
            this.props.toggleManager();
        });

    }

    async uploadPostImage(pic){


        const res = await postJson("http://localhost:3000/postImage", {
            method: "POST",
            headers: {
                "Content-Type": pic.type,
                "Image-Type": pic.name.split(".")[pic.name.split(".").length - 1],
                "Content-Length": pic.size,
                "postId": this.state.postId

            },
            body: pic
        })

        if(res.status === ActionResult.SUCCESS)
            this.setState({image: res.path})
    }
}

class CategoryEntry extends React.Component {


    constructor(props){
        super(props)
    }


    render(){

        return (
            <div className={styles.category_entry} onClick={() => {
                this.props.selectCategory(this.props.categoryId)
            }}>
                <div className={styles.category_desc}>{this.props.desc}</div>
                <div className={styles.category_points}>{this.props.points}</div>
            </div>
        )
    }

}

class PostPreview extends React.Component {


    constructor(props){
        super(props)
    }


    render(){


        return (
            <div className={styles.post_preview}>
                <div className={styles.username_preview}>{this.props.username}</div>
                <div className={styles.date_preview}>{this.props.date}</div>
                <div className={styles.content_preview_bg}>
                    {this.props.hasImage ? <img className={styles.image_preview} src={this.props.pic}/> : <div className={styles.text_preview}>{this.props.text}</div>}
                    <div className={this.props.hasImage || this.props.points === "" ? styles.invis : styles.points_preview}>Punkte: {this.props.points}</div>
                </div>
                <div className={styles.subtitle_preview}>
                            <div className={styles.subtitle_user_preview}><strong>{this.props.username}</strong>:</div>
                            <div className={styles.subtitle_text_preview}>{this.props.subtitle}</div>
                        </div>
                </div>
        )
    }

}
