import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import "./ProfilePage.css";
import UserSettings from "../modules/UserSettings";
import YourListings from "../modules/YourListings";
import SavedListings from "../modules/SavedListings";
import {get, post} from "../../utilities";


class ProfilePage extends Component {
  

  render() {
    return (
      <div className="Profile-container">
        <UserSettings userId={this.props.userId} key={this.props.userId}/>
      </div>
    )
  }
}

ProfilePage.propTypes = {
  userId: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
}

export default ProfilePage;