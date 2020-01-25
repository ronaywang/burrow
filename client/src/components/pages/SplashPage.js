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
      <div>
      <GoogleSearchBar 
      styleName="SplashPage"
      searchBarId={"splashPageSearch"}
      updateQuery={(loc, ctr) => {this.setState({ location: loc, locationCtr: ctr });}}
      text={this.state.location}
      />
      </div>
    );

    return (
      <div className="SplashPage-container">
        <div className="SplashPage-infoContainer">
          <div className="SplashPage-taglineContainer">
            <div className="SplashPage-logo">burrow</div>
            Enter location:
          </div>
          
          {/* {roomTrue ? (
            <div>
              <input type="number" step="100" className="SplashPage-rentinput"
              max={roomTrue ? this.state.roomRentUpper : this.state.roommateRentUpper}
              value={roomTrue ? this.state.roomRentLower : this.state.roommateRentLower}
              onChange={(event)=>{
                roomTrue ? this.setState({roomRentLower: event.target.value}) : 
                  this.setState({roommateRentLower: event.target.value});
                }}/> 
              <span className="fieldname">≤ Rent ≤</span>
              <input type="number" step="100" className="SplashPage-rentinput"
              min={roomTrue ? this.state.roomRentLower : this.state.roommateRentLower}
              value={roomTrue ? this.state.roomRentUpper : this.state.roommateRentUpper}
              onChange={(event)=>{
                roomTrue ? this.setState({roomRentUpper: event.target.value}) : 
                  this.setState({roommateRentUpper: event.target.value});
                }}/> 
              <span className="fieldname">(USD / mo.)</span>
            </div>
          ) : (
            <div>
              <span className="fieldname">Rent is</span>
              <input type="number" step="100" className="SplashPage-rentinput"
              value={this.state.roommateRentLower}
              onChange={(event)=>{
                  this.setState({roommateRentLower: event.target.value});
                }}/> 
              <span className="fieldname">(USD / mo.)</span>
            </div>
          )} */}
          {searchBar}
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