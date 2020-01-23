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
    this.getListings = this.getListings.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.getListings();
  }

  getListings () {
    get("/api/composedlistings").then(data=>this.setState({usersListings: data}));
  }

  async update () {
    await this.getListings();
    this.setState({
      newListingActive: false,
    });
  }

  render() {
    console.log(`Your listings: ${this.state.usersListings}`);
    return (
      <div className="YourListings-container">
        {!this.state.newListingActive && <button onClick={()=>{this.setState({newListingActive: true});}}>Add new listing</button>}
        {this.state.newListingActive && (
          <NewListing lookingForRoom={false} update={this.update}/>
        )}
        <ListingsFast displayedListings={this.state.usersListings}/>
      </div>
    );
  }
}

export default YourListings;