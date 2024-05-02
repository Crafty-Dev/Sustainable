import React from "react";



export default class Home extends React.Component {

    constructor(props){
        super(props)
    }


    render(){

        if(!this.props.render)
            return null;

        return (
            <div>
                Home
            </div>
        )

    }
}