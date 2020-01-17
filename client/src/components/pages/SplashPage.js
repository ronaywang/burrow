import React, { Component } from "react";
import {Tabs} from "../modules/Tabs.js";
import "../../utilities.css";

class SplashPage extends Component {
  render(){
    return (
      <div>
        <h1>Burrow</h1>
        <h2>i'm looking for a...</h2>
        <Tabs>
          <div label="Room">
            hi this is tab 0 room oc do not steal
          </div>

          <div label="Roommate">
            hi this is tab 1 roommate oc do not steal
          </div>
        </Tabs>
      </div>
    );
  }
}

export default SplashPage;