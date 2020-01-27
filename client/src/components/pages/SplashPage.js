import React, { Component } from "react";
import {Tabs} from "../modules/Tabs.js";
import {GoogleSearchBar} from "../modules/SearchBar.js";
import "./SplashPage.css";
import "../../utilities.css";
import { Link } from "@reach/router";
import {listing_type} from "../modules/enums";
import { post, get } from "../../utilities.js";

class SplashPage extends Component {

  constructor(props){
    super(props);
    this.state = {
      startDate: new Date(),
      location: "",
      locationCtr: {
        lat: 0,
        lng: 0,
      },
      doDisplay: false,
    };
  }

  componentDidMount(){
    document.body.classList.add("SplashPage-body");
    get("/api/sessionglobals").then((globals) => {
      this.setState({
        doDisplay: true,
        startDate: globals.startDate,
        location: globals.location,
        locationCtr: {
          lat: globals.locationCtr.lat,
          lng: globals.locationCtr.lng
        },
      });
    })
  }
  
  render(){
    if (!this.state.doDisplay)
      return null;
    let buttonClassName = "SplashPage-listingtypebutton";

    const {
      state: {
        startDate, location
      }
    } = this;

    let searchBar = (
      <GoogleSearchBar 
      styleName="SplashPage"
      searchBarId={"splashPageSearch"}
      updateQuery={(loc, ctr) => {this.setState({ location: loc, locationCtr: ctr });}}
      text={this.state.location}
      />
    );

    return (
      <div className="SplashPage-container">
        <div className="SplashPage-infoContainer">
          <div className="SplashPage-taglineContainer">
            <div className="SplashPage-logo">Find your roommate.</div>
          </div>
          <div className="SplashPage-searchAndDates">
            <div className="SplashPage-searchContainer">
              <div className="SplashPage-searchDescription">location</div>
              {searchBar}
            </div>
            <div className="SplashPage-dateContainer">
              <div className="SplashPage-dateDescription">move-in date</div>
              <div className="SplashPage-date SplashPage-input">
                <input
                  className="SplashPage-dateInput"
                  type="date"
                  name="startdate"
                  value={startDate}
                  onChange={(e) => this.setState({startDate: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <button
            className="SplashPage-go SplashPage-input"
            type="submit"
            value="Go!"
            onClick={() => {
              let body = {
                location: this.state.location,
                locationCtr: {
                  lat: this.state.locationCtr.lat,
                  lng: this.state.locationCtr.lng,
                },
                startDate: this.state.startDate,
              }
              post("/api/sessionglobals", body).then((res) => {
                window.location.pathname = "/main";
              })
            }}>Go!</button>
        </div>
      </div>
    );
  }
}

export default SplashPage;