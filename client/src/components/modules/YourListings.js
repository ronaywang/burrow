import React, { Component } from "react";
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
          <NewListing userId={this.props.userId} lookingForRoom={false}/>
        )}
      </div>
    );
  }
}

export default YourListings;