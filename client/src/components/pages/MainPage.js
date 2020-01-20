import React, {Component} from "react";
import PropTypes from "prop-types";
import "../../utilities";
import "../../utilities.css";
import "./MainPage.css"

class MainPage extends Component{
  static PropTypes = {
    userId: PropTypes.string.isRequired,
    
  }
  render(){
    return (<div></div>);
  }
}

export default MainPage;