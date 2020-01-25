import React, { Component } from "react";
import {Tabs} from "../modules/Tabs.js";
import {GoogleSearchBar} from "../modules/SearchBar.js";
import DatePicker from "../modules/DatePicker.js";
import "./SplashPage.css";
import "../../utilities.css";
import { Link } from "@reach/router";
import moment from "moment";
import {listing_type} from "../modules/enums";
import { post, get } from "../../utilities.js";
import Toggle from 'react-toggle';
import "react-toggle/style.css";

class SplashPage extends Component {

  constructor(props){
    super(props);
    this.state = {
      startDate: moment(),
      endDate: moment().add(1, 'days'),
      location: "",
      locationCtr: {
        lat: 0,
        lng: 0,
      },
      doDisplay: false,
    };
  }

  componentDidMount(){
    get("/api/sessionglobals").then((globals) => {
      this.setState({
        doDisplay: true,
        startDate: globals.startDate,
        endDate: globals.endDate,
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
        startDate, endDate, location
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
            <div className="SplashPage-logo">Find fellow roommates near you.</div>
          </div>
          <div className="SplashPage-searchContainer">
            <div className="SplashPage-searchDescription">location</div>
            {searchBar}
          </div>
          <div className="SplashPage-dateContainer">
            <div className="SplashPage-dateDescription">dates</div>
            <div className="SplashPage-date SplashPage-input">
              <DatePicker
                startDate={startDate}
                endDate={endDate}
                startDateId="splashpage-startdateid"
                endDateId="splashpage-enddateid"
                handleDateChange={(stdate, edate) => {
                  this.setState({startDate: stdate, endDate: edate})
                }}/>
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
                endDate: this.state.endDate
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