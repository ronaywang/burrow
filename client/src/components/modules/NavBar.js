import React, {Component} from "react";
import PropTypes from "prop-types";
import "./NavBar."
import "../../utilities.css";

class NavBar extends Component {
  static PropTypes = {
    loggedIn: PropTypes.bool.isRequired,
  };
  
  render(){
    const {loggedIn} = this.props;
    let linkContainer = loggedIn ? (
      <div className="NavBar-linkContainer-loggedIn">
        {/* <div className="NavBar-link"></div> TODO: INSERT LINKS HERE */}
      </div>
    ) : (
      <div className="NavBar-linkContainer-loggedIn">
        {/* <div className="NavBar-link"></div> TODO: INSERT LINKS HERE */}
      </div>
    )
    return (
      <div className="NavBar-container">
        <div className="NavBar-logoSearchContainer">
          <div className="NavBar-logo">
          </div>
          {/* <LocationSearchBar /> */}
        </div>
        {linkContainer}
      </div>
    );
  }
}

export default NavBar;