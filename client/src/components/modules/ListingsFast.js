import "./Listings.css";
import React, {Component} from "react";
import "../../utilities.css";
import "../../utilities.js";
import SingleCardFast from "./SingleCardFast.js";
import PropTypes from "prop-types";


class ListingsFast extends Component {
  render(){
    return (
      <div className={`${this.props.styleName}-listingsContainer`}>
        {this.props.displayedListings.map((listing) => {return (
          <SingleCardFast listing={listing} key={listing._id}/>
        );})}
      </div>
    );
  }
}

ListingsFast.propTypes = {
  // TODO (post-mvp): make this into some sort of "generator" so you don't have to load every fucking thing, lol
  styleName: PropTypes.string.isRequired,
  displayedListings: PropTypes.instanceOf(Array).isRequired
};


export default ListingsFast;