import React, { Component } from "react";
import "../../utilities.css";
import "../pages/ProfilePage.css";
import { SingleDatePicker } from "react-dates";
import moment from "moment";
import { get, post } from "../../utilities";
import { genders} from "./enums";
import "./ProfilePicUploader.css";

const axios = require("axios");

class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      birthdate: undefined,
      email: '',
      fbProfileLink: '',
      datefocused: false,
      textBox: '',
      gender: '',
      maleButtonActive: false,
      femaleButtonActive: false,
      nbButtonActive: false,
      doRender: false,
      profilePicURL: "",
      prefsArray: [1,1,3,1,1],
    };
    this.saveSettings = this.saveSettings.bind(this);
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
        textBox: userObj.aboutMe,
        userId: userObj._id
      });
      if (this.state.gender === genders.M) {
        this.setState({gender: "Male"});
      } else if (this.state.gender === genders.F) {
        this.setState({gender: "Female"});
      } else if (this.state.gender === genders.NB) {
        this.setState({gender: "Non-binary"});
      }
      this.setState({doRender: true});
    }).then(() => {
      if (this.state.profilePicURL.length == 0) {
        post("/api/getProfilePic", {userId: this.state.userId}).then((myres) => {
          this.setState({profilePicURL: myres.photoURL});
        });
      }
    })
  }

  handleChange = (event) => {
    this.doUploadPic(event.target.files[0]);
  };

  doUploadPic = async (file) => {
    this.setState({ uploading: true });

    let formData = new FormData();
    formData.append('photo', file);

    const uploadRes = await axios.post("/api/newProfilePic", formData);
    console.log(JSON.stringify(uploadRes));
    window.location.reload();

  };


  async saveSettings () {
    console.log(this.state);
    post("/api/saveusersettings", this.state).then((result)=>{
      console.log(result);
    }).catch((err)=> {
      console.log(err);
    });
    console.log(this.state.birthdate);
  }

  render() {
    if (!this.state.doRender)
      return null;
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

    let dispdate;
    if (this.state.birthdate) {
      dispdate = moment(this.state.birthdate);
    } else {
      dispdate = '';
    }

    let prefsDescriptionArray = ["I have a lot of pets.", "I value cleanliness in a roommate.", "I tend to be outgoing.",
                                  "I smoke frequently.", "I am an early bird."];
    return (
      <div className="UserSettings-container">
        <div className="UserSettings-text">Only your first name, age and gender are shown to the public.</div>
        <div className = "UserSettings-aboutContainer">
          <div className="UserSettings-photoContainer">
            <img className = "UserSettings-photo" onClick={() => {
              document.getElementById("uploadphoto").click();
            }} 
              src={this.state.profilePicURL || require("../../public/assets/account.png")}
            />
            <input className="upload-btn-wrapper" id="uploadphoto" type="file" name="file" accept="image/*" onChange={this.handleChange}/>
          </div>
          <div className="UserSettings-personalInfo">
            <div className="UserSettings-personalInfoBlock UserSettings-personalInfoName">
              <div className="UserSettings-description">Name</div>
              <div className="UserSettings-value">{`${this.state.firstName} ${this.state.lastName}`}</div>
            </div>
            <div className="UserSettings-personalInfoBlock UserSettings-personalInfoEmail">
              <div className="UserSettings-description">E-mail</div>
              <div className="UserSettings-value">{`${this.state.email}`}</div>
            </div>
            <div className="UserSettings-personalInfoBlock UserSettings-personalInfoAge">
              <div className="UserSettings-description">Birthdate</div>
              <div className="UserSettings-value">{`${new Date(this.state.birthdate).toLocaleDateString()}`}</div>
            </div>
            <div className="UserSettings-personalInfoBlock UserSettings-personalInfoGender">
              <div className="UserSettings-description">Gender</div>
              <div className="UserSettings-value">{this.state.gender}</div>
            </div>
          </div>
        </div>
        <div className="UserSettings-prefsContainer">
          {this.state.prefsArray.map((pref, index) => (
            <div className="UserSettings-prefsBlock">
              <div className="UserSettings-prefsDesciption">
                <label>{prefsDescriptionArray[index]}</label>
              </div>
              <div className="UserSettings-prefsSlider"> 
                <input type="range" min="1" max="3" value={this.state.prefsArray[index]} 
                  onChange={(e) => { 
                    e.persist();
                    this.setState((prev) => {
                      let arr = prev.prefsArray;
                      arr[index] = parseInt(e.target.value);
                      return {prefsArray: arr};
                    }, () => {console.log(this.state.prefsArray)}) 
                  }}  
                />
              </div>
            </div>
          ))}
        </div>
        <div>
          <span className="pro-fieldname">Link your FB profile</span>
          <input
          type="text"
          name="fblink"
          value={this.state.fbProfileLink}
          onChange={(event)=>{this.setState({fbProfileLink: event.target.value})}}/>
        </div>
        <div>
          <div className="pro-fieldname">Tell us about yourself!</div>
            <textarea className="pro-textbox" rows="10" cols="30" value={this.state.textBox} onChange={(e) => {this.setState({textBox: e.target.value})}}/>
        </div>

        <button id="savebutton"
        name="Save"
        onClick={this.saveSettings}>Save</button>
      </div>
    );
  }
}

export default UserSettings;