import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import "../pages/ProfilePage.css";
import { SingleDatePicker } from "react-dates";
import moment from "moment";
import { get, post } from "../../utilities";

class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      birthdate: '',
      fbProfileLink: '',
      datefocused: false,
      textBox: '',
    };
  }

  componentDidMount() {
    get("/api/getthisuserinfo").then((userObj) => {
      console.log(userObj);
      this.setState({
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        birthdate: userObj.birthdate,
        fbProfileLink: userObj.fbProfileLink,
      });
    });
  }

  saveSettings = () => {
    post("/api/saveusersettings", this.state).then((response) => {

    });
  };

  render() {
    return (
      <div className="UserSettings-container">
        <div>
          <span className="fieldname">Name</span>
          <input
          type="text"
          name="firstname"
          placeholder = "First name"
          value={this.state.firstName}
          onChange={(event)=>{this.setState({firstName: event.target.value})}}/>
          <input
          type="text"
          name="lastname"
          placeholder = "Last name"
          value={this.state.lastName}
          onChange={(event)=>{this.setState({lastName: event.target.value})}}/>
        </div>
        <div>
          <span className="fieldname">Birthday</span>
          <SingleDatePicker
          date={this.state.birthdate}
          onDateChange={date => this.setState({birthdate: date})}
          id="profile-date-picker"
          focused={this.state.datefocused}
          onFocusChange={({ focused }) => this.setState({ datefocused: focused })}
          isOutsideRange={(date)=>{return false;}}
          initialVisibleMonth={() => moment().subtract(25, "Y")}
          displayFormat="MMM DD, YYYY"/>
        </div>
        <div>
          <span className="fieldname">Link your FB profile</span>
          <input
          type="text"
          name="fblink"
          value={this.state.fbProfileLink}
          onChange={(event)=>{this.setState({fbProfileLink: event.target.value})}}/>
        </div>
        <div>
          <div className="fieldname">Tell us about yourself!</div>
            <textarea rows="10" cols="30" onChange={(e) => {this.setState({textBox: e.target.value})}}/>
        </div>

        <button id="savebutton"
        name="Save"
        onClick={this.saveSettings}>Save</button>
      </div>
    );
  }
}

export default UserSettings;