import React, { Component } from "react";
import "../../utilities.css";
import "../pages/ProfilePage.css";
import ListingsFast from "./ListingsFast";
import {get, post} from "../../utilities";

class YourListings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersListings: [],
      isYou: false,
      doRender: false
    };
  }

  componentDidMount() {
    this.getListings();
  }

  getListings = () => {
    get("/api/composedlistings", {userId: this.props.userId}).then(data=>this.setState({isYou: data.isYou, usersListings: data.listings, doRender: true}));
  }

  render() {
    if (!this.state.doRender)
      return null;
    console.log(`Your listings: ${this.state.usersListings}`);
    return (
      <div className="YourListings-container">
        {(this.state.usersListings.length === 0) ? <div className="YourListings-container">
          No listings yet!
          <img src = "/sad bunny.png" width = "30%"/>
        </div> : <ListingsFast displayedListings={this.state.usersListings} editDeletePerms={this.state.isYou}/>}
      </div>
    );
  }
}

export default YourListings;