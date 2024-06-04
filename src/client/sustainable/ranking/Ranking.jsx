import React from "react";
import styles from "./Ranking.module.css";
import { loadTopRanks } from "../../logic/accountManager";



export default class Ranking extends React.Component {


    constructor(props){
        super(props)


        this.state = {topRanks: []}
    }


    componentDidMount(){
        this.loadTopRanks();
    }

    componentDidUpdate(prevProps){
        if(prevProps.render !== this.props.render && this.props.render)
            this.loadTopRanks();
    }

    async loadTopRanks(){

        const entries = [];

        const ranks = await loadTopRanks();
        for(var i = 0; i < ranks.length; i++){
            const rankData = ranks[i];
            entries.push(<RankEntry key={rankData.uid} rank={i + 1} uid={rankData.uid} username={rankData.username} profilePicture={rankData.profilePicture} points={rankData.points}/>)
        }

        console.log(entries)
        this.setState({topRanks: entries})

    }

    render(){

        if(!this.props.render)
            return null;

        return (
            <div className={styles.ranking}>
                <div className={styles.title}>Ranking</div>
                <div className={styles.rank_list}>
                    {this.state.topRanks}
                </div>
            </div>
        )
    }

}


class RankEntry extends React.Component {


    constructor(props){
        super(props)
    }


    render(){

        return (
            <div className={styles.rank_entry}>
                <div className={styles.rank_number}>{this.props.rank}.</div>
                <img className={styles.profilePic} src={this.props.profilePicture}/>
                <div>
                <div className={styles.username}>{this.props.username}</div>
                <div className={styles.uid}>{this.props.uid}</div>
                </div>
                <div className={styles.points}>{this.props.points} Punkte</div>
            </div>
        )

    }
}