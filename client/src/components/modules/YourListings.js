import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import "../pages/ProfilePage.css";

class YourListings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
    };
  }

  componentDidMount() {

  }

  render() {
    return (
      <div>
        Your Listings
      </div>
    );
  }
}

export default YourListings;