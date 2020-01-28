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
    };
  }
  
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
         <Popup
         contentStyle={{backgroundColor: 'rgba(255,255,255,0)', border: 'none'}}
         modal trigger={
          <button className="NavBar-newListing">new listing</button>
        }>
          {close => (<NewListing userId={userId} close={close}/>) }
        </Popup> 
        <Link to="/main" className="NavBar-link">browse</Link>
        {/* <Link to={`/profile/${userId}`} className="NavBar-link">
          account
        </Link>  */}
        <Link to="/inbox/*" className="NavBar-link">message</Link>
        <div className="NavBar-link" onClick={() => {
          navigate(`/profile/${userId}`, {replace: true});
        }}>account</div>   
        <div className="NavBar-link" onClick={this.props.handleLogout}>logout</div> 
       
      </div>

    ) : (
      <div className="NavBar-linkContainer-loggedOut NavBar-style">
        <Popup modal trigger={
          <div className="NavBar-link">
            register
          </div>
        }
        contentStyle={{borderRadius: 'var(--borderradius)'}}
        >
          <RegistrationPage />
        </Popup>
        
        <Popup modal trigger={
        <div className="NavBar-link">
          login
        </div>
        }
        contentStyle={{ borderRadius: 'var(--borderradius)'}}
        >
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