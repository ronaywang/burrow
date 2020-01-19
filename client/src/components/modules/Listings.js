import "./Listings.css";
import React, {Component} from "react";
import "../../utilities.css";
import "../../utilities.js";
import SingleCard from "./SingleCard.js";


class Listings extends Component {
  static PropTypes = {
    generateListings: PropTypes.func.isRequired // e.g. the matching function!
  };

  constructor(props){
    super(props);
    this.state = {
      displayedListings: []
    };
  }

  componentDidMount(){
    this.setState((prevState) => {

    });
  }

  render(){
  }
}