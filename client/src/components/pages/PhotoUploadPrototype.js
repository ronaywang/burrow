import React from "react";
import "../../utilities";
import "../../utilities.css";
import "./PhotoUploadPrototype.css";
import { post } from "../../utilities";
const axios = require("axios");

class PhotoUploadPrototype extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: undefined,
      uploading: false,
      image: undefined,
    };
  }


  handleChange = (event) => {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
      image: event.target.files[0],
    });
    this.doUploadPic(event.target.files[0]);
  };

  doUploadPic = async (file) => {
    this.setState({ uploading: true });

    let formData = new FormData();
    formData.append('photo', file);

    const uploadRes = await axios.post("/api/newProfilePic", formData);

    this.setState({
      uploading: false,
    });
    //const printme = await uploadRes.json();
    console.log(JSON.stringify(uploadRes));

  };


  render() {
    return (
      <div className={"container"}>
      <div className={"upload-btn-wrapper"}>
        <button className={"btn"} >Upload your profile picture</button>
        <input type="file" name="file" accept="image/*" onChange={this.handleChange}/>
      </div>
      <div className={"preview"}>
        <p></p><img src={this.state.file} align="center"/>
      </div>
      </div>
    );
  }
}

export default PhotoUploadPrototype;