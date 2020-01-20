import React, { Component } from "react";
import SingleCard from "./SingleCard";

class TryCard extends Component {
  render() {
    return (
      <div style={{width: '40em', height: '30em'}}>
        <SingleCard />
      </div>
    );
  }
}

export default TryCard;