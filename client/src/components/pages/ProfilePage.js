import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import { post } from "../../utilities";
import ProfilePicUploader from "../modules/ProfilePicUploader";
import "../../utilities.css";
import "./ProfilePage.css";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePicURL: "",
    };
  }

  async componentDidMount() {
    if (!this.state.profilePicURL) {
      const myres = await post("/api/getProfilePic", {userId: this.props.userId});
      this.setState({profilePicURL: myres.photoURL});
    }
  }

  render() {
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
      <div className = "ProfileBar-middle"></div>
      </>
    )
  }
}

ProfilePage.propTypes = {
  userId: PropTypes.string.isRequired,
}

export default ProfilePage;