import React, {Component} from "react";
import PropTypes from "prop-types";
import "./NavBar.css";
import "../../utilities.css";
import Popup from "reactjs-popup";
import LoginPage from "../pages/LoginPage";
import RegistrationPage from "../pages/RegistrationPage";
import { Link } from "@reach/router";
import { GoogleSearchBar } from "./SearchBar";
import { get, post } from "../../utilities";

class NavBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      doDisplay: false,
      lookingForRoom: null,
      roomLocation: null,
      roomLocationCtr: null,
      roommateLocation: null,
      roommateLocationCtr: null,
    };
  }
  
  componentDidMount(){
    get("/api/sessionglobals").then((globals) => {
      this.setState({
        doDisplay: true,
        lookingForRoom: globals.lookingForRoom,
        roomLocation: globals.roomLocation,
        roomLocationCtr: globals.roomLocationCtr,
        roommateLocation: globals.roommateLocation,
        roommateLocationCtr: globals.roommateLocationCtr,
      })
    })
  }

  render(){
    if (!this.state.doDisplay)
      return null;
    const {userId} = this.props;
    let linkContainer = userId ? (
      <div className="NavBar-linkContainer-loggedIn NavBar-style">
        <Link to="/main" className="NavBar-link">Home</Link>
        <Link to={`/profile/${userId}`} className="NavBar-link">Profile</Link> 
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
            <Link to="/" className="NavBar-logo-link">burrow</Link>
          </div>
          <div className="NavBar-searchContainer">
            {this.state.lookingForRoom ? 
            <GoogleSearchBar styleName="NavBar" text={this.state.roomLocation} 
              placeIsCity={true}
              searchBarId="navBarSearch" updateQuery={(query, ctr) => {
                post("/api/sessionglobals", {roomLocation: query, lookingForRoom: true, roomLocationCtr: ctr})
                  .then(() => { window.location.pathname = "/main"; });
                }}
            /> : null}
          </div>
          <div className="NavBar-searchContainer" visibility={this.state.lookingForRoom ? "hidden" : "visible"}>
            {this.state.lookingForRoom ? null : 
            <GoogleSearchBar styleName="NavBar" text={this.state.roommateLocation} 
              placeIsCity={false}
              searchBarId="navBarSearch" updateQuery={(query, ctr) => {
                post("/api/sessionglobals", {roommateLocation: query, lookingForRoom: false, roommateLocationCtr: ctr})
                  .then(() => { window.location.pathname = "/main"; });
                }}
            />}
          </div>  
          <div className="NavBar-modeContainer">
            <button type="submit" className="NavBar-modeButton" checked={this.state.lookingForRoom} 
              onClick={() => this.setState((prev) => ({lookingForRoom: !prev.lookingForRoom}), () => {
                post("/api/sessionglobals", {lookingForRoom: this.state.lookingForRoom});
              })}>
              {this.state.lookingForRoom ? "I am looking for a ROOM" : "I have a ROOM and am looking for SOMEONE"}
            </button>
          </div>
        </div>
        {linkContainer}
      </div>
    );
  }
}

NavBar.propTypes = {
  userId: PropTypes.string.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default NavBar;