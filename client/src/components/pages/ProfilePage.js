import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import "./ProfilePage.css";
import UserSettings from "../modules/UserSettings";
import YourListings from "../modules/YourListings";
import SavedListings from "../modules/SavedListings";
import {get, post} from "../../utilities";


class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0, //0, 1, or 2, depending on which tab to display
      isYou: false,
      firstName: "",
      doRender: false
    };
  }

  componentDidMount () {
    get("/api/getthisuserinfo", {userId: this.props.userId}).then((usr) => {
      this.setState({isYou: usr.isYou, firstName: usr.firstName, doRender: true})
    })
  }

  render() {
    if (!this.state.doRender)
      return null;
    let TabToDisplay;
    switch(this.state.tabIndex) {
      case 0:
        TabToDisplay = UserSettings;
        break;
      case 1:
        TabToDisplay = YourListings;
        break;
      case 2:
      default:
        TabToDisplay = YourListings;
        break;
    }
    return (
      <div className="Profile-container">
        <span className = "ProfileBar-tabContainer">
          <span className="ProfileBar-tab" onClick={()=>{this.setState({tabIndex: 0})}}>
            {this.state.isYou ? "Your" : `${this.state.firstName}'s`} profile
          </span>
          <span className="ProfileBar-tab" onClick={()=>{this.setState({tabIndex: 1})}}>
          {this.state.isYou ? "Your" : `${this.state.firstName}'s`} listings
          </span>
           {/*<span className = "ProfileBar-tab" onClick={()=>{this.setState({tabIndex: 3})}}>Your account</span> */}
        </span>
       <div>
          <TabToDisplay userId={this.props.userId} key={this.props.userId}/>
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