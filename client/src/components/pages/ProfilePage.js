import React, { Component } from "react";
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

  async componentDidUpdate() {
    if (!this.state.profilePicURL) {
      const myres = await  post("/api/getProfilePic", {userId: this.props.userId});
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

export default ProfilePage;