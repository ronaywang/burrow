import React, { Component } from "react";
import PropTypes from "prop-types";
import { get, post } from "../../utilities";
import ProfilePicUploader from "../modules/ProfilePicUploader";
import "../../utilities.css";
import "./ProfilePage.css";

class ProfilePrototype extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePicURL: "",
    };
  }

  async componentDidUpdate() {
    if (!this.state.profilePicURL) {
      const myres = await  post("/api/getProfilePic", {userId: this.props.userId});
      this.setState({profilePicURL: myres.photoURL});
    }
  }

  render() {
    return (
      <>
      <div>
        {this.state.profilePicURL && (
        <img className = "avatar" src={this.state.profilePicURL}/>
        )}
      </div>
      <ProfilePicUploader/>
      </>
    );
  }
}

export default ProfilePrototype;