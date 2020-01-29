import React, { Component } from "react";
import "../../utilities.css";
import "../pages/ProfilePage.css";
//import moment from "moment";
import { get, post } from "../../utilities";
import { genders} from "./enums";
import "./ProfilePicUploader.css";
import ListingsFast from "./ListingsFast";
import axios from 'axios';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

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
      doRender: false,
      profilePicURL: "",
      prefsArray: [1,1,3,1,1],
      isYou: false,
      savedSettings: false,
      uploading: false,
      usersListings: [],
      editMode: false,
    };
    this.saveSettings = this.saveSettings.bind(this);
  }

  componentDidMount() {
    this.getListings();
  }

  getListings = () => {
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
        prefsArray: userObj.prefsArray,
        doRender: true,
      }, () => {
        get("/api/composedlistings", {userId: this.props.userId})
        .then(data=>this.setState({usersListings: data.listings}));
      });
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
    const {isYou, editMode} = this.state;
    const prefsDisagreeArray = ["no pets", "messy", "reserved", "don't smoke", "early bird"];
    const prefsAgreeArray = ["multiple pets", "neat", "outgoing", "frequently smoke", "night owl"];
    console.log(`SRC ${this.state.src}`);
    return (
      <div className="Profile-container">
      <div className="TabToDisplay-container">
        {/*<div className="UserSettings-color"></div>*/}
        <h1 className = "Profile-header">the basics</h1>
        <div className = "UserSettings-aboutContainer">
          {/*<div className="UserSettings-text">Your first name, photo, age and gender are public.</div> commented out because i'm not sure this is necessary*/} 
          <div className="UserSettings-photoContainer">
            <div className="UserSettings-photoUploadContainer">
            <img className ="UserSettings-photo" 
              src={this.state.profilePicURL || "/account.png"}
            />
            {this.state.uploading ? 
              <span className ="UserSettings-uploading">uploading...</span>
              :
              <img className = {`camerasvg ${editMode ? "UserSettings-photoYou" : ""}`} onClick={() => {
                if (editMode)
                  document.getElementById("uploadphoto").click(); }} src = "/photograph.svg" width = "15px"
            />} 
            </div>
            <input className="upload-btn-wrapper" id="uploadphoto" type="file" name="file" accept="image/*" onChange={this.handleChange}/>
          </div>
          <div className = "UserSettings-personalInfoBlock-container">
          <div className="UserSettings-personalInfoBlock UserSettings-personalInfoName">
            <div className="UserSettings-description">Name</div>
            <div className="UserSettings-value">{`${this.state.firstName} ${this.state.lastName}`}</div>
          </div>

          <div className="UserSettings-personalInfoBlock UserSettings-personalInfoGender">
            <div className="UserSettings-description">Gender</div>
            <div className="UserSettings-value">{this.state.gender}</div>
          </div>

          <div className="UserSettings-personalInfoBlock UserSettings-personalInfoAge">
            <div className="UserSettings-description">{isYou ? "Date Of Birth" : "Age"}</div>
            <div className="UserSettings-value">{isYou ? new Date(this.state.birthdate).toLocaleDateString() : this.state.age}</div>
          </div>

          {isYou ? <div className="UserSettings-personalInfoBlock UserSettings-personalInfoEmail">
            <div className="UserSettings-description">E-mail</div>
            <div className="UserSettings-value">{`${this.state.email}`}</div>
          </div> : null}
          
          
          </div>
          <div className="UserSettings-personalInfoBlock UserSettings-personalInfoAbout">
            <div className="UserSettings-description">About Yourself</div>
            {this.state.editMode ? (
              <textarea className="UserSettings-textbox" rows="10"
                placeholder="Add some personality to your profile" value={this.state.textBox} 
                onChange={(e) => {this.setState({textBox: e.target.value})}}
              />
            ) : (
              <div className="UserSettings-value UserSettings-textboxvalue">{this.state.textBox}</div>
            )}
            
          </div>
          {isYou ? (
            <button className="UserSettings-personalInfoEdit"  onClick={() => {
              if (!this.state.editMode)
                this.setState({editMode: true});
              else
                this.setState({editMode: false}, () => this.saveSettings());
            }}>
              {this.state.editMode ? "Save" : "Edit"}
            </button>
          ) : null}
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
                    style={{gridRowStart: 1+2*index, gridRowEnd: 2+2*index, gridColumnStart: 1, gridColumnEnd: 2}}
                  >{prefsDisagreeArray[index]}</span>
                ))}

                {this.state.prefsArray.map((pref, index) => (
                  <span className="UserSettings-prefsAgree"
                    style={{gridRowStart: 1+2*index, gridRowEnd: 2+2*index, gridColumnStart: 3, gridColumnEnd: 4}}
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
                      style={{gridRowStart: 1+2*index, gridRowEnd: 2+2*index, gridColumnStart: 2, gridColumnEnd: 3}}
                      onChange={(e) => { 
                          e.persist();
                          this.setState((prev) => {
                            let arr = prev.prefsArray;
                            arr[index] = parseInt(e.target.value);
                            return {prefsArray: arr};
                          }, () => {this.saveSettings()}) 
                        }}  
                      />
              ))}
              </div>
            </div>   
        </div>
      </div>
      <ListingsFast
        styleName="UserSettings" displayedListings={this.state.usersListings} editDeletePerms={this.state.isYou}/>
    </div>
    );
  }
}

export default UserSettings;