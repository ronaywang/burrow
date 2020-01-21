import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import "../pages/ProfilePage.css";

class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      birthdate: '',
    };
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="UserSettings-container">
        <div>
          <span>Name</span>
          <input
          type="text"
          name="firstname"
          value={this.state.firstName}/>
          <input
          type="text"
          name="lastname"
          value={this.state.lastName}/>
        </div>
        <div>
          <span>Birthday</span>
          <input
          type="text"
          name="birthdate"
          value={this.state.birthdate}/>
        </div>
      </div>
    );
  }
}

export default UserSettings;