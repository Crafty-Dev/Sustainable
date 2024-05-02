import React from "react";



export default class Ranking extends React.Component {


    constructor(props){
        super(props)
    }


    render(){

        if(!this.props.render)
            return null;

        return (
            <div>
                Ranking
            </div>
        )
    }

}