import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import "../pages/ProfilePage.css";
import NewListing from "../modules/NewListing";

class YourListings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newListingActive: false,
    };
  }

  componentDidMount() {

  }

  render() {
    return (
      <div>
        {!this.state.newListingActive && <button onClick={()=>{this.setState({newListingActive: true});}}>Add new listing</button>}
        {this.state.newListingActive && (
          <NewListing/>
        )}
      </div>
    );
  }
}

export default YourListings;