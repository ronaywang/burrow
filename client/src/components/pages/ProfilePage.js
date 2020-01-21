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

  async componentDidMount() {
    if (!this.state.profilePicURL) {
      const myres = await post("/api/getProfilePic", {userId: this.props.userId});
      this.setState({profilePicURL: myres.photoURL});
    }
  }

  render() {
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
      default:
        TabToDisplay = UserSettings;
        break;
    }
    return (
      <>
      <div className = "ProfileBar-container">
      <div>
        {this.state.profilePicURL && (
        <img className = "ProfileBar-photo" src={this.state.profilePicURL}/>
        )}
      </div>
      <ProfilePicUploader/>
      
      </div>
      <div className = "ProfileBar-middle">
        <span className="ProfileBar-tab" onClick={()=>{this.setState({tabIndex: 0})}}>User settings</span>
        <span className="ProfileBar-tab" onClick={()=>{this.setState({tabIndex: 2})}}>Saved listings</span>
        <span className="ProfileBar-tab" onClick={()=>{this.setState({tabIndex: 1})}}>Your listings</span>
      </div>
      <div className="TabToDisplay-container">
        <TabToDisplay/>
      </div>
      </>
    )
  }
}

ProfilePage.propTypes = {
  userId: PropTypes.string.isRequired,
}

export default ProfilePage;