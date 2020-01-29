import React, {Component} from "react";
import PropTypes from "prop-types";
import "./NavBar.css";
import "../../utilities.css";
import Popup from "reactjs-popup";
import LoginPage from "../pages/LoginPage";
import RegistrationPage from "../pages/RegistrationPage";
import { Link,  navigate } from "@reach/router";
import { GoogleSearchBar } from "./SearchBar";
import { get, post } from "../../utilities";
import NewListing from "../modules/NewListing";

class NavBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      doDisplay: false,
      location: null,
      locationCtr: null,
      /*showMenu: false,*/
    };
  }

  /*setShowMenu = (new) => {
    this.setState({ showMenu: new });
  } */

  componentDidMount(){
    get("/api/sessionglobals").then((globals) => {
      this.setState({
        location: globals.location,
        locationCtr: globals.locationCtr,
        doDisplay: true,
      })
    });
  }

  

  render(){
    if (!this.state.doDisplay)
      return null;
    console.log(`You are logged in as ${this.props.userId}`);
    const {userId} = this.props;
    let linkContainer = userId ? (
      <div className="NavBar-linkContainer-loggedIn NavBar-style">
        {/*<img
          className="hamburger"
          alt="hamburger menu"
          src="/menu.svg"
          onClick={() => setShowMenu(true)}
        />
        <div className={`menu ${showMenu && "show"}`}>
          <div className="close" onClick={() => setShowMenu(false)}>
            close menu
          </div>
          <Link to = ""> new listing</Link>
          <Link to ="/main" className="ignore">browse</Link>
          <Link to = "inbox/*" className="ignore">message</Link>
          <div className="ignore" onClick={() => {
          navigate(`/profile/${userId}`, {replace: true});
        }}>account</div>   
          <div className="NavBar-link" onClick={this.props.handleLogout}>logout</div> 
      </div>*/}
         <Popup
         contentStyle={{backgroundColor: 'rgba(255,255,255,0)', border: 'none', width: '90%', maxWidth: '30rem'}}
         modal trigger={
          <button className="NavBar-newListing" title="Make new listing">new listing</button>
        }>
          {close => (<NewListing userId={this.props.userId} currentId="" close={close}/>) }
        </Popup> 
        <Link to="/main" className="NavBar-link" title="Browse listings">browse</Link>
        {/* <Link to={`/profile/${userId}`} className="NavBar-link">
          account
        </Link>  */}
        <Link to="/inbox/*" className="NavBar-link" title="Message other rabbits">message</Link>
        <div className="NavBar-link" onClick={() => {
          navigate(`/profile/${userId}`, {replace: true});
        }} title="View your account">account</div>   
        <div className="NavBar-link" onClick={this.props.handleLogout} title="Logout">logout</div> 
       
      </div>

    ) : (
      <div className="NavBar-linkContainer-loggedOut NavBar-style">
        <Popup modal trigger={
          <div className="NavBar-link" title="Register">
            register
          </div>
        }
        contentStyle={{borderRadius: 'var(--borderradius)', width: '90%', maxWidth: '30rem'}}
        >
          <RegistrationPage />
        </Popup>
        
        <Popup modal trigger={
        <div className="NavBar-link" title="Login">
          login
        </div>
        }
        contentStyle={{borderRadius: 'var(--borderradius)', width: '90%', maxWidth: '20rem'}}
        >
          <LoginPage />
        </Popup>
      </div>
    );
    return (
      <div className="NavBar-container ">
        <div className="NavBar-logoSearchContainer NavBar-style">
          <div className="NavBar-logo" title="Tip: Clear the location query and press enter to see ALL listings :)">
            <Link to="/" className="NavBar-logo-link">burrow</Link>
          </div>
          <div className="NavBar-searchContainer">
            <GoogleSearchBar styleName="NavBar" text={this.state.location} 
              searchBarId="navBarSearch" updateQuery={(query, ctr) => {
                post("/api/sessionglobals", {location: query, locationCtr: ctr})
                  .then(() => { window.location.pathname = "/main"; });
                }}
            />
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