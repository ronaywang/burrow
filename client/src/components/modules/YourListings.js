import React, { Component } from "react";
import "../../utilities.css";
import "../pages/ProfilePage.css";
import NewListing from "../modules/NewListing";
import ListingsFast from "./ListingsFast";
import {get} from "../../utilities";

class YourListings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newListingActive: false,
      usersListings: [],
    };
  }

  componentDidMount() {
    get("/api/composedlistings").then(data=>this.setState({usersListings: data}));
  }

  render() {
    return (
      <div>
        {!this.state.newListingActive && <button onClick={()=>{this.setState({newListingActive: true});}}>Add new listing</button>}
        {this.state.newListingActive && (
          <NewListing userId={this.props.userId} lookingForRoom={false}/>
        )}
        <ListingsFast displayedListings={this.state.usersListings}/>
      </div>
    );
  }
}

export default YourListings;