import React from "react";
import styles from "./Sustainable.module.css"
import Ranking from "./ranking/Ranking.jsx";
import Info from "./info/Info.jsx";
import Home from "./home/Home.jsx";
import Account from "./account/Account.jsx";

export default class Sustainable extends React.Component {


    constructor(props){
        super(props)

        this.state = {page: Pages.INFORMATION}
    }



    render(){

        return (
            <div>
                <div className={styles.navbar}>
                    <div className={this.state.page == Pages.RANKING ? styles.ref_selected : styles.ref} onClick={() => this.setState({page: Pages.RANKING})}>Ranking</div>
                    <div className={this.state.page == Pages.HOME ? styles.ref_selected : styles.ref} onClick={() => this.setState({page: Pages.HOME})}>Home</div>
                    <div className={this.state.page == Pages.INFORMATION ? styles.ref_selected : styles.ref} onClick={() => this.setState({page: Pages.INFORMATION})}>Information</div>
                </div>
                <div className={styles.content}>
                    <Ranking render={this.state.page === Pages.RANKING}/>
                    <Home render={this.state.page === Pages.HOME}/>
                    <Info render={this.state.page === Pages.INFORMATION}/>
                    <Account/>
                </div>
            </div>
        )
    }
}

const Pages = {
    RANKING: "ranking",
    HOME: "home",
    INFORMATION: "info"
}