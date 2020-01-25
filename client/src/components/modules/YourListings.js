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
      doRender: false
    };
  }

  componentDidMount() {
    this.getListings();
  }

  getListings = () => {
    get("/api/composedlistings").then(data=>this.setState({usersListings: data, doRender: true}));
  }

  render() {
    if (!this.state.doRender)
      return null;
    console.log(`Your listings: ${this.state.usersListings}`);
    return (
      <div className="YourListings-container">
        {(this.state.usersListings.length === 0) ? <div className="YourListings-container">
          No listings here :( 
        </div> : <ListingsFast displayedListings={this.state.usersListings}/>}
      </div>
    );
  }
}

export default YourListings;