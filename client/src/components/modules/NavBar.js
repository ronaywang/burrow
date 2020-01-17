import React, {Component} from "react";
import PropTypes from "prop-types";
import "./NavBar.css";
import "../../utilities.css";

class NavBar extends Component {
  static PropTypes = {
    loggedIn: PropTypes.bool.isRequired,
  };
  
  render(){
    return (
      <></>
    );
  }
}

export default NavBar;