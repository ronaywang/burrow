import "./Listings.css";
import React, {Component} from "react";
import "../../utilities.css";
import "../../utilities.js";
import SingleCard from "./SingleCard.js";


class Listings extends Component {
  static PropTypes = {
    // TODO (post-mvp): make this into some sort of "generator" so you don't have to load every fucking thing, lol
    generateListings: PropTypes.func.isRequired // e.g. the matching function! or your bookmarked listings!
  };

  constructor(props){
    super(props);
    this.state = {
      displayedListings: []
    };
  }

  componentDidMount(){
    this.setState({displayedListings: generateListings()});
  }

  render(){
    
  }
}