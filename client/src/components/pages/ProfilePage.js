import React, {Component} from "react";
import PropTypes from "prop-types";
import "../../utilities";
import "../../utilities.css";
import "./ProfilePage.css";

class ProfilePage extends Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log("mounted");
    myres = get("/api/getProfilePic", {userId : this.props.userId});
    console.log(myres);
  }

  render() {
    return (
      <div>
        hi
      </div>
    );
  }
}

export default ProfilePage;