import React, {Component} from "react";
import "../../utilities.css";
import "./splash.css";

class Splash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: "",
            startDate: 0,
            endDate: 0,
        };
    }

    componentDidMount(){

    }

    render(){
        /* IF the browser has seen you before, just go to the main page 
           IF not, then go through the splash */
        return (
            <>
                <span className="splash-title">find your burrow</span>
                <div>
                    <TextInput loc={this.state.location} onSubmit={}/>
                </div>
                <div>
                    <DatePicker date={this.state.start}/>
                    <span className="splash-text">to</span>
                    <DatePicker date={this.state.end}/>
                </div>
                <span className="splash-Button">Go!</span>
            </>
        )
    }
}
export default Splash;