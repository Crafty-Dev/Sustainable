import React, { createElement } from "react";
import styles from "./Info.module.css"
import { parseHTML } from "jquery";
import { requestJson } from "../../logic/requestUtils.js";

export default class Info extends React.Component {


    constructor(props){
        super(props)

        this.state = {currentText: undefined, availableTexts: [], availableTextEntries: [], generalInformation: undefined, navbar_expanded: false}
    }

    componentDidMount(){
        this.loadTexts();

    
        requestJson("http://localhost:3000/information").then((data) => {
            localStorage.setItem("data_information_texts", JSON.stringify(data))
            this.loadTexts();
        })


    }


    loadTexts(){


        let available = [];
        let availableNavEntries = [];

        if(localStorage.getItem("data_information_texts") === null || localStorage.getItem("data_information_texts") === undefined)
            return;

        const json = JSON.parse(localStorage.getItem("data_information_texts"))
        const texts = json["texts"];

        for(var i = 0; i < texts.length; i++){
            const text = texts[i];
            available.push(<InfoText key={text.id} id={text.id} title={text.title} content={text.content} refs={text.links}/>)
            availableNavEntries.push(<TextEntry key={text.id} id={text.id} sel_id={i} selected={this.isTextSelected(text.id)} selectText={this.selectText.bind(this)} title={text.title}/>)
        }

        const generalInformation = json["generalInformation"];

        this.setState({availableTexts: available, availableTextEntries: availableNavEntries, generalInformation: <InfoText title={generalInformation.title} content={generalInformation.content} refs={generalInformation.links}/>})
    }

    updateTextNavbar(){

        const updated = [];
        for(var i = 0; i < this.state.availableTextEntries.length; i++){
            const entry = this.state.availableTextEntries[i];
            const props = entry.props;

            updated.push(<TextEntry key={props.id} id={props.id} sel_id={props.sel_id} selected={this.isTextSelected(props.id)} selectText={props.selectText} title={props.title}/>)
        }
        this.setState({availableTextEntries: updated})

    }

    isTextSelected(id){
        return this.state.currentText !== undefined && this.state.currentText.props.id === id;
    }

    selectText(sel_id){
        this.setState({currentText: sel_id < 0 ? undefined : this.state.availableTexts[sel_id]}, () => {
            this.updateTextNavbar();
        })
    }



    isTextDisplayed(){
        return this.state.currentText !== undefined;
    }

    render(){

        if(!this.props.render)
            return null;

        return (
            <div>
                <TextNavbar render={this.state.navbar_expanded} entries={this.state.availableTextEntries} selectText={this.selectText.bind(this)}/>
                <div id="extender" className={`${styles.navbar_extender} ${this.state.navbar_expanded ? styles.navbar_extender_active : ""}`} onClick={() => this.setState({navbar_expanded: !this.state.navbar_expanded})}>{">"}</div>
                <div className={styles.content}>{this.isTextDisplayed() ? this.state.currentText : this.state.generalInformation}</div>
            </div>
        )
    }

}

class TextNavbar extends React.Component {

    constructor(props){
        super(props)

    }


    render(){

        if(!this.props.render)
            return null;


        return (
            <div className={styles.text_navbar}>
                <div className={styles.text_navbar_title} onClick={() => this.props.selectText(-1)}>Infos</div>
                {this.props.entries}
            </div>
        )
    }

}

class InfoText extends React.Component {

    constructor(props){
        super(props)
    }

    componentDidMount(){

        const nodes = parseHTML(this.props.content)
        for(var i = 0; i < nodes.length; i++){
            document.getElementById("moin").append(nodes[i])
        }
    }


    render(){
        
        return (
            <div className={styles.border}>
                <div className={styles.text_title}>{this.props.title}</div>
                <div id="moin" className={styles.text_content}></div>
                <div className={styles.text_refs}>{this.props.refs}</div>
            </div>
        )
    }

}


class TextEntry extends React.Component {

    constructor(props){
        super(props)
    }


    render(){


        return (
            <div name="text_entry" className={this.props.selected ? styles.text_entry_selected : styles.text_entry} onClick={() => this.props.selectText(this.props.sel_id)}>{this.props.title}</div>
        )
    }

}