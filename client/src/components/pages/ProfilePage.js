import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import "./ProfilePage.css";
import UserSettings from "../modules/UserSettings";
import YourListings from "../modules/YourListings";
import SavedListings from "../modules/SavedListings";



class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0, //0, 1, or 2, depending on which tab to display
    };
  }

  render() {
    if (this.props.userId === "")
      return (<div>Log in to access this feature</div>);
    let TabToDisplay;
    switch(this.state.tabIndex) {
      case 0:
        TabToDisplay = UserSettings;
        break;
      case 1:
        TabToDisplay = YourListings;
        break;
      case 2:
        TabToDisplay = YourProfile;
      default:
        TabToDisplay = YourListings;
        break;
    }
    return (
      <div className="Profile-container">
        <span className = "ProfileBar-tabContainer">
          <span className="ProfileBar-tab" onClick={()=>{this.setState({tabIndex: 0})}}>Your profile</span>
          <span className="ProfileBar-tab" onClick={()=>{this.setState({tabIndex: 1})}}>Your listings</span>
          {/* <span className = "ProfileBar-tab" onClick={()=>{this.setState({tabIndex: 3})}}>Your account</span> */}
        </span>
        <div className="TabToDisplay-container">
          <TabToDisplay userId={this.props.userId}/>
        </div>
      </div>
    )
  }
}

ProfilePage.propTypes = {
  userId: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
}

export default ProfilePage;