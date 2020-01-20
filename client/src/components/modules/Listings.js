import "./Listings.css";
import React, {Component} from "react";
import "../../utilities.css";
import "../../utilities.js";
import SingleCard from "./SingleCard.js";
import PropTypes from "prop-types";


class Listings extends Component {
  static PropTypes = {
    // TODO (post-mvp): make this into some sort of "generator" so you don't have to load every fucking thing, lol
    styleName: PropTypes.string.isRequired,
    displayedListings: PropTypes.instanceOf(Array).isRequired
  };

  render(){
    return (
      <div className={`${this.props.styleName}-listingsContainer`}>
        {this.props.displayedListings.map((listingId) => {return (
          <SingleCard key={listingId} listingId={listingId} />
        );})}
      </div>
    );
  }
}

export default Listings;