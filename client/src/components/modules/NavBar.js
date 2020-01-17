import React, {Component} from "react";
import PropTypes from "prop-types";
import "./NavBar."
import "../../utilities.css";

class NavBar extends Component {
  static PropTypes = {
    loggedIn: PropTypes.bool.isRequired,
  };
  
  render(){
    return (
      <div className="NavBar-container">
      </div>
    );
  }
}

export default NavBar;