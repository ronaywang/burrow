import "./Listings.css";
import React, {Component} from "react";
import "../../utilities.css";
import "../../utilities.js";
import SingleCard from "./SingleCard.js";
import PropTypes from "prop-types";


class Listings extends Component {
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

Listings.propTypes = {
  // TODO (post-mvp): make this into some sort of "generator" so you don't have to load every fucking thing, lol
  styleName: PropTypes.string.isRequired,
  displayedListings: PropTypes.instanceOf(Array).isRequired
};


export default Listings;