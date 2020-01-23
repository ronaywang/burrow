import React, { Component } from "react";
import "../../utilities.css";
import "../pages/ProfilePage.css";
import NewListing from "../modules/NewListing";
import ListingsFast from "./ListingsFast";
import {get, post} from "../../utilities";
import Popup from "reactjs-popup";

class YourListings extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
  }

  render() {
    console.log(`Your listings: ${this.state.usersListings}`);
    return (
      <div className="YourListings-container">
        <Popup modal trigger={
          <button className="YourListings-newListing">Add new listing</button>
        }>
          {close => (<NewListing update={this.update} close={close}/>) }
        </Popup>
        <ListingsFast displayedListings={this.state.usersListings}/>
      </div>
    );
  }
}

export default YourListings;