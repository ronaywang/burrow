import React from "react";
import "../../utilities.css";
import "./PhotoUploadPrototype.css";

class PhotoUploadPrototype extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: undefined
    };
  }


  handleChange = (event) => {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
    });
  };

  render() {
    return (
      <div className={"container"}>
      <div className={"upload-btn-wrapper"}>
        <button className={"btn"} >Upload your profile picture</button>
        <input type="file" name="myfile" accept="image/*" onChange={this.handleChange}/>
      </div>
      <div className={"preview"}>
        <p></p><img src={this.state.file} align="center"/>
      </div>
      </div>
    );
  }
}

export default PhotoUploadPrototype;