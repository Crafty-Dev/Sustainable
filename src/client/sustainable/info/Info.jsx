import React from "react";
import styles from "./Info.module.css"

export default class Info extends React.Component {


    constructor(props){
        super(props)

        this.state = {currentText: undefined, availableTexts: [], availableTextEntries: []}
        this.generalInformation = this.generalInfo();
    }

    componentDidMount(){
        this.loadTexts();

        fetch("http://localhost:3000/information").then((res) => {

            res.json().then((data) => {
                localStorage.setItem("data_information_texts", JSON.stringify(data))
                this.loadTexts();
            })

        })

    }

    generalInfo(){
        return <InfoText title="Informationen" content={
            "Dies ist eine allgemeine Information."
        } refs={[]}/>
    }

    loadTexts(){


        let available = [];
        let availableNavEntries = [];

        const json = JSON.parse(localStorage.getItem("data_information_texts"))
        const texts = json["texts"];

        for(var i = 0; i < texts.length; i++){
            const text = texts[i];
            available.push(<InfoText key={text.id} id={text.id} title={text.title} content={text.content} refs={text.links}/>)
            availableNavEntries.push(<TextEntry key={text.id} id={text.id} sel_id={i} selected={this.isTextSelected(text.id)} selectText={this.selectText.bind(this)} title={text.title}/>)
        }

        this.setState({availableTexts: available, availableTextEntries: availableNavEntries})
    }

    updateTextNavbar(){

        const updated = [];
        for(var i = 0; i < this.state.availableTextEntries.length; i++){
            const entry = this.state.availableTextEntries[i];
            const props = entry.props;
            console.log(props.id)

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
                <div className={styles.text_navbar}>
                    <div className={styles.text_navbar_title} onClick={() => this.selectText(-1)}>Infos</div>
                    {this.state.availableTextEntries}
                    </div>
                <div className={styles.content}>{this.isTextDisplayed() ? this.state.currentText : this.generalInformation}</div>
            </div>
        )
    }
}

class InfoText extends React.Component {

    constructor(props){
        super(props)
    }



    render(){
        
        return (
            <div>
                <div className={styles.text_title}>{this.props.title}</div>
                <div className={styles.text_content}>{this.props.content}</div>
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
            <div className={this.props.selected ? styles.text_entry_selected : styles.text_entry} onClick={() => this.props.selectText(this.props.sel_id)}>{this.props.title}</div>
        )
    }

}