import React, { Component } from "react";
import "../../utilities.css";
import "../pages/ProfilePage.css";
//import moment from "moment";
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
      age: 0,
      email: '',
      /*fbProfileLink: '',*/
      datefocused: false,
      textBox: '',
      gender: '',
      maleButtonActive: false,
      femaleButtonActive: false,
      nbButtonActive: false,
      doRender: false,
      profilePicURL: "",
      prefsArray: [1,1,3,1,1],
      isYou: false,
      savedSettings: false,
      uploading: false,
    };
    this.saveSettings = this.saveSettings.bind(this);
  }

  componentDidMount() {
    get("/api/getthisuserinfo", {userId: this.props.userId}).then((userObj) => {
      this.setState({
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        email: userObj.email,
        birthdate: userObj.birthdate,
        age: userObj.age,
        /*fbProfileLink: userObj.fbProfileLink,*/
        gender: userObj.gender,
        textBox: userObj.aboutMe,
        userId: userObj._id,
        profilePicURL: userObj.profilePictureURL,
        isYou: userObj.isYou,
        prefsArray: userObj.prefsArray
      });
      if (this.state.gender === genders.M) {
        this.setState({gender: "Male"});
      } else if (this.state.gender === genders.F) {
        this.setState({gender: "Female"});
      } else if (this.state.gender === genders.NB) {
        this.setState({gender: "Non-binary"});
      }
      this.setState({doRender: true});
    })
  }

  handleChange = (event) => {
    this.doUploadPic(event.target.files[0]);
  };

  doUploadPic = async (file) => {

    let formData = new FormData();
    formData.append('photo', file);

    const uploadRes = await axios.post("/api/newProfilePic", formData);
    console.log(JSON.stringify(uploadRes));
    setTimeout(() => {
      this.setState({
        profilePicURL: uploadRes.data.url,
        uploading: false,
      });
    }, 1000);
    this.setState({ uploading: true });
  };


  async saveSettings () {
    console.log(this.state);
    post("/api/saveusersettings", this.state).then((result)=>{
      this.setState({savedSettings: true});
    }).catch((err)=> {
      console.log(err);
    });
  }

  render() {
    if (!this.state.doRender)
      return null;
    const {isYou} = this.state;

    const prefsDescriptionArray = ["I have a lot of pets.", "I value cleanliness in a roommate.", "I tend to be outgoing.",
                                  "I smoke frequently.", "I am an early bird."];
    const prefsDisagreeArray = ["no pets", "messy", "reserved", "don't smoke", "early bird"];
    const prefsAgreeArray = ["multiple pets", "neat", "outgoing", "frequently smoke", "night owl"];
    console.log(`PROFILE PIC URL: ${this.state.profilePicURL}`);
    return (
      <div>
      <div className="TabToDisplay-container">
        {/*<div className="UserSettings-color"></div>*/}
        <h1 className = "Profile-header">the basics</h1>
        <div className = "UserSettings-aboutContainer">
          {/*<div className="UserSettings-text">Your first name, photo, age and gender are public.</div> commented out because i'm not sure this is necessary*/} 
          <div className="UserSettings-photoContainer">
            <div className="UserSettings-photoUploadContainer">
            <img className ="UserSettings-photo" 
              src={this.state.profilePicURL || require("../../public/assets/account.png")}
            />
            {this.state.uploading ? 
              <span className ="UserSettings-uploading">uploading...</span>
              :
              <img className = {`camerasvg ${isYou ? "UserSettings-photoYou" : ""}`} onClick={() => {
                if (isYou)
                  document.getElementById("uploadphoto").click(); }} src = "/photograph.svg" width = "15px"
            />} 
            </div>
            <input className="upload-btn-wrapper" id="uploadphoto" type="file" name="file" accept="image/*" onChange={this.handleChange}/>
          </div>
          <div className="UserSettings-personalInfo">
            <div className="UserSettings-personalInfoBlock UserSettings-personalInfoName">
              <div className="UserSettings-description">Name</div>
              <div className="UserSettings-value">{`${this.state.firstName} ${this.state.lastName}`}</div>
            </div>

            <div className="UserSettings-personalInfoBlock UserSettings-personalInfoGender">
              <div className="UserSettings-description">Gender</div>
              <div className="UserSettings-value">{this.state.gender}</div>
            </div>

            {isYou ? <div className="UserSettings-personalInfoBlock UserSettings-personalInfoEmail">
              <div className="UserSettings-description">E-mail</div>
              <div className="UserSettings-value">{`${this.state.email}`}</div>
            </div> : null}
            
            <div className="UserSettings-personalInfoBlock UserSettings-personalInfoAge">
              <div className="UserSettings-description">{isYou ? "Date Of Birth" : "Age"}</div>
              <div className="UserSettings-value">{isYou ? new Date(this.state.birthdate).toLocaleDateString() : this.state.age}</div>
            </div>
            
          </div>
        </div>
      </div>

      <div className="TabToDisplay-container">

      <h1 className = "Profile-header">more about you</h1>
          <div className="UserSettings-moreContainer">
            <div className="UserSettings-prefsContainer">
              <div className="UserSettings-prefsGrid">
                {/*this.state.prefsArray.map((pref, index) => (
                  <label
                    style={{gridRowStart: 1+2*index, gridRowEnd: 2+2*index, gridColumnStart: 2, gridColumnEnd: 3}}
                  >{prefsDescriptionArray[index]}</label>
                ))*/}

                {this.state.prefsArray.map((pref, index) => (
                  <span className="UserSettings-prefsDisagree"
                    style={{gridRowStart: 2+2*index, gridRowEnd: 3+2*index, gridColumnStart: 1, gridColumnEnd: 2}}
                  >{prefsDisagreeArray[index]}</span>
                ))}

                {this.state.prefsArray.map((pref, index) => (
                  <span className="UserSettings-prefsAgree"
                    style={{gridRowStart: 2+2*index, gridRowEnd: 3+2*index, gridColumnStart: 3, gridColumnEnd: 4}}
                  >{prefsAgreeArray[index]}</span>
                ))}
                  {this.state.prefsArray.map((pref, index) => (
                      <input
                      key={index+400}
                      className="UserSettings-prefsSlider"
                      disabled={!isYou}
                      type="range"
                      min="1"
                      max="3"
                      value={pref}
                      style={{gridRowStart: 2+2*index, gridRowEnd: 3+2*index, gridColumnStart: 2, gridColumnEnd: 3}}
                      onChange={(e) => { 
                          e.persist();
                          this.setState((prev) => {
                            let arr = prev.prefsArray;
                            arr[index] = parseInt(e.target.value);
                            return {prefsArray: arr};
                          }, () => {console.log(this.state.prefsArray)}) 
                        }}  
                      />
              ))}
              </div>
{/*            {this.state.prefsArray.map((pref, index) => (
              <div key={index+100} className="UserSettings-prefsBlock">
                <div key={index+200} className="UserSettings-prefsDesciption">
                  <label>{prefsDescriptionArray[index]}</label>
                </div>
                <div key={index+300} className="UserSettings-prefsSliderContainer">
            <span className="UserSettings-prefsDisagree">{prefsDisagreeArray[index]}</span>
                  <input key={index+400} className="UserSettings-prefsSlider" disabled={!isYou} type="range" min="1" max="3" value={pref} 
                    onChange={(e) => { 
                      e.persist();
                      this.setState((prev) => {
                        let arr = prev.prefsArray;
                        arr[index] = parseInt(e.target.value);
                        return {prefsArray: arr};
                      }, () => {console.log(this.state.prefsArray)}) 
                    }}  
                  />
                  <span className="UserSettings-prefsAgree">{prefsAgreeArray[index]}</span>
                </div>
            </div>
                  ))}
                  */}
          </div>
        {/*{isYou ? (
          <div>
            <span className="pro-fieldname">Link your FB profile</span>
            <input
            type="text"
            name="fblink"
            value={this.state.fbProfileLink}
            onChange={(event)=>{this.setState({fbProfileLink: event.target.value})}}/>
          </div>
        ) : (p
          this.state.fbProfileLink.trim().length === 0 ? null : (
            <div>
              <div className="UserSettings-description">Facebook</div>
              <div className="UserSettings-value">{this.state.fbProfileLink}</div>
            </div>
          )
          )} i feel bad commenting all this out but i think for now it's best to get rid of it*/}
        <div className="UserSettings-aboutMe">
        {isYou ? (
          <div>
            <div className="UserSettings-description">Tell us about yourself!</div>
              <textarea className="UserSettings-textbox" rows="10" value={this.state.textBox} onChange={(e) => {this.setState({textBox: e.target.value})}}/>
          </div>
        ) : (
          <div>
            <div className="UserSettings-description"></div>
            <div className="UserSettings-value">{this.state.textBox.trim().length === 0 ? "This user has not filled out their profile yet!" : 
            this.state.textBox}</div>
          </div>
        )}
        {isYou ? (
          <div className="UserSettings-save">
            <button id="savebutton"
            name="Save!"
            onClick={this.saveSettings}>Save!</button>
            <span className="UserSettings-saveSuccess">
              {this.state.savedSettings ? "Settings successfully saved" : null}
            </span>
          </div>
        ) : null}
        </div>
      </div>
    </div>
    </div>
    );
  }
}

export default UserSettings;