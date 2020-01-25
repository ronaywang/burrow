import React from "react";
import "../../utilities";
import "../../utilities.css";
import "./ProfilePicUploader.css";
const axios = require("axios");

class ProfilePicUploader extends React.Component {
  constructor(props) {
    super(props);
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


  render() {
    return (
      <div className={"upload-btn-wrapper"}>
        <button className={"btn"} >upload photo</button>
        <input type="file" name="file" accept="image/*" onChange={this.handleChange}/>
      </div>
    );
  }
}

export default ProfilePicUploader;