import React, {Component} from "react";
import PropTypes from "prop-types";
import "./NavBar.css";
import "../../utilities.css";
import Popup from "reactjs-popup";
import LoginPage from "../pages/LoginPage";
import RegistrationPage from "../pages/RegistrationPage";
import { Link } from "@reach/router";
import { GoogleSearchBar } from "./SearchBar";

class NavBar extends Component {
  static PropTypes = {
    userId: PropTypes.string.isRequired,
  };
  
  render(){
    const {userId} = this.props;
    let linkContainer = userId ? (
      <div className="NavBar-linkContainer-loggedIn NavBar-style">
        <Link to="/main" className="NavBar-link">Home</Link>
        <Link to={`/profile/${this.props.userId}`} className="NavBar-link">Profile</Link> 
        <Link to="/inbox" className="NavBar-link">Inbox</Link> 
        <div className="NavBar-link" onClick={this.props.handleLogout}>Logout</div> 
      </div>
    ) : (
      <div className="NavBar-linkContainer-loggedOut NavBar-style">
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
      <div className="NavBar-container ">
        <div className="NavBar-logoSearchContainer NavBar-style">
          <div className="NavBar-logo">
            burrow
          </div>
          <GoogleSearchBar styleName="NavBar" placeIsCity={true} />
        </div>
        {linkContainer}
      </div>
    );
  }
}

export default NavBar;