import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import "../pages/ProfilePage.css";
import { SingleDatePicker } from "react-dates";
import moment from "moment";
import { get, post } from "../../utilities";
import genders from "./enums";

class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      birthdate: '',
      email: '',
      fbProfileLink: '',
      datefocused: false,
      textBox: '',
      gender: '',
      maleButtonActive: false,
      femaleButtonActive: false,
      nbButtonActive: false,
    };
  }

  componentDidMount() {
    get("/api/getthisuserinfo").then((userObj) => {
      console.log(userObj);
      this.setState({
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        email: userObj.email,
        birthdate: userObj.birthdate,
        fbProfileLink: userObj.fbProfileLink,
        gender: userObj.gender,
      });
        if (this.state.gender === genders.M) {
          this.setState({maleButtonActive: true});
        } else if (this.state.gender === genders.F) {
          this.setState({femaleButtonActive: true});
        } else if (this.state.gender === genders.NB) {
          this.setState({nbButtonActive: true});
        }
    });
  }

  saveSettings = () => {
    if (this.state.maleButtonActive || this.state.femaleButtonActive || this.state.nbButtonActive) {
      if (this.state.maleButtonActive) {
        this.setState({gender: genders.M});
      } else if (this.state.femaleButtonActive) {
        this.setState({gender: genders.F});
      } else {
        this.setState({gender: genders.NB});
      }
    }
    post("/api/saveusersettings", this.state);
  };

  render() {
    let mbuttonclass = "UserSettings-genderbutton UserSettings-genderbuttonM";
    let fbuttonclass = "UserSettings-genderbutton UserSettings-genderbuttonF";
    let nbbuttonclass = "UserSettings-genderbutton UserSettings-genderbuttonNB";
    if (this.state.maleButtonActive) {
      mbuttonclass += " UserSettings-genderbuttonActive";
    }
    if (this.state.femaleButtonActive) {
      fbuttonclass += " UserSettings-genderbuttonActive";
    }
    if (this.state.nbButtonActive) {
      nbbuttonclass += " UserSettings-genderbuttonActive";
    }

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
          <span className="fieldname">when were ya born, boomer</span>
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
          <span className="fieldname">Which flavor are you</span>
          <button
          className={mbuttonclass}
          onClick={()=>{this.setState({maleButtonActive: true, femaleButtonActive: false, nbButtonActive: false})}}
          >Male</button>
          <button className={fbuttonclass}
          onClick={()=>{this.setState({maleButtonActive: false, femaleButtonActive: true, nbButtonActive: false})}}
          >Female</button>
          <button className={nbbuttonclass}
          onClick={()=>{this.setState({maleButtonActive: false, femaleButtonActive: false, nbButtonActive: true})}}
          >Non-binary</button>
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