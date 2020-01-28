import React, { Component } from "react";
import "../../utilities.css";
import "./ProfilePage.css";
import UserSettings from "../modules/UserSettings";


class ProfilePage extends Component {
  render() {
    return (
      <UserSettings userId={this.props.userId} key={this.props.userId}/>
    )
  }
}

export default ProfilePage;