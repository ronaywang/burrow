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
import Toggle from 'react-toggle'

const houseIcon = (
  <img src="house_icon.svg" width="13px"/>
);
const roommateIcon = (
  <img src="roommate_icon.svg" width="13px"/>
);

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
            <Link to="/" className="NavBar-logo-link">god javascript is awful</Link>
          </div>
          <div className="NavBar-toggleContainer">
            <Toggle
            id="lookingForRoom" 
            className="NavBar-toggleSwitch" defaultChecked={this.state.lookingForRoom} 
              onChange={() => this.setState((prev) => ({lookingForRoom: !prev.lookingForRoom}), () => {
                post("/api/sessionglobals", {lookingForRoom: this.state.lookingForRoom});
              })}
              icons={{checked: houseIcon, unchecked: roommateIcon}}
              />
               <label className="NavBar-toggleSwitchLabel" htmlFor = {this.state.lookingForRoom ? "I want a room" : "I want a roommate"}>
               <span className="toggle-switch-inner" />
              <span className="toggle-switch-switch" />
              </label>
    
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
         
          <div className="NavBar-searchContainer">
            {this.state.lookingForRoom ? null : 
            <GoogleSearchBar styleName="NavBar" text={this.state.roommateLocation} 
              placeIsCity={false}
              searchBarId="navBarSearch" updateQuery={(query, ctr) => {
                post("/api/sessionglobals", {roommateLocation: query, lookingForRoom: false, roommateLocationCtr: ctr})
                  .then(() => { window.location.pathname = "/main"; });
                }}
            />}
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