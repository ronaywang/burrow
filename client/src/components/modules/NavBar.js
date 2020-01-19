import React, {Component} from "react";
import PropTypes from "prop-types";
import "./NavBar.css";
import "../../utilities.css";
import Popup from "reactjs-popup";
import LoginPage from "../pages/LoginPage";
import RegistrationPage from "../pages/RegistrationPage";

class NavBar extends Component {
  static PropTypes = {
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
  };
  
  render(){
    const {loggedIn} = this.props;
    let linkContainer = loggedIn ? (
      <div className="NavBar-linkContainer-loggedIn">
        {/* <div className="NavBar-link"></div> TODO: INSERT LINKS HERE */}
      </div>
    ) : (
      <div className="NavBar-linkContainer-loggedOut">
        <Popup modal trigger={
          <div className="NavBar-link">
            Signup
          </div>
        }>
          <RegistrationPage />
        </Popup>
        
        <Popup modal trigger={
        <div className="NavBar-link">
          Login
        </div>
        }>
          <LoginPage />
        </Popup>
        
      </div>
    );
    return (
      <div className="NavBar-container">
        <div className="NavBar-logoSearchContainer">
          <div className="NavBar-logo">
            burrow
          </div>
          {/* <LocationSearchBar /> className="NavBar-search" */}
        </div>
        {linkContainer}
      </div>
    );
  }
}

export default NavBar;