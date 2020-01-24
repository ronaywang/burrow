import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import { post } from "../../utilities";
import ProfilePicUploader from "../modules/ProfilePicUploader";
import "./ProfilePage.css";
import UserSettings from "../modules/UserSettings";
import YourListings from "../modules/YourListings";
import SavedListings from "../modules/SavedListings";



class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePicURL: "",
      tabIndex: 0, //0, 1, or 2, depending on which tab to display
    };
  }

  componentDidMount() {
    if (this.state.profilePicURL.length == 0) {
      post("/api/getProfilePic", {userId: this.props.userId}).then((myres) => {
        this.setState({profilePicURL: myres.photoURL});
      });
    }
  }

  render() {
    if (this.props.userId === "")
      return (<div>Log in to access this feature</div>);
    console.log(this.state.profilePicURL);
    let TabToDisplay;
    switch(this.state.tabIndex) {
      case 0:
        TabToDisplay = UserSettings;
        break;
      case 1:
        TabToDisplay = YourListings;
        break;
      case 2:
        TabToDisplay = SavedListings;
        break;
      case 3:
        TabToDisplay = YourProfile;
      default:
        TabToDisplay = YourProfile;
        break;
    }
    return (
      <>
      <div className = "ProfileBar-container">
      <div>
        <img className = "ProfileBar-photo" src={this.state.profilePicURL || require("../../public/assets/account.png")}/>
      </div>
      {/*<div>
        Profile page for <b>{this.props.username}</b>
      </div>*/}
      <ProfilePicUploader/>
      
      </div>
      <span className = "ProfileBar-tabContainer">
        {/*<span className = "ProfileBar-tab" onClick={()=>{this.setState({tabIndex: 3})}}>Your profile</span>*/}
        <span className="ProfileBar-tab" onClick={()=>{this.setState({tabIndex: 0})}}>Your settings</span>
        <span className="ProfileBar-tab" onClick={()=>{this.setState({tabIndex: 2})}}>Your favorites</span>
        <span className="ProfileBar-tab" onClick={()=>{this.setState({tabIndex: 1})}}>Your listings</span>
      </span>
      <div className="TabToDisplay-container">
        <TabToDisplay userId={this.props.userId}/>
      </div>
      </>
    )
  }
}

ProfilePage.propTypes = {
  userId: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
}

export default ProfilePage;