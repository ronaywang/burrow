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

class SplashPage extends Component {

  constructor(props){
    super(props);
    this.state = {
      roomStartDate: moment(),
      roomEndDate: moment().add(1, 'days'),
      roomLocation: "",
      roommateStart: moment(),
      roommateEnd: moment().add(1, 'days'),
      roommateLocation: "",
      roomOrRoommate: listing_type.ROOM,
      doDisplay: false,
    };
  }

  componentDidMount(){
    get("/api/sessionglobals").then((globals) => {
      this.setState({
        doDisplay: true,
        roomStartDate: globals.roomStartDate,
        roomEndDate: globals.roomEndDate,
        roomLocation: globals.roomLocation,
        roomLocationCtr: {
          lat: globals.roomLocationCtr.lat,
          lng: globals.roomLocationCtr.lng
        },
        roommateStart: globals.roommateStartDate,
        roommateEnd: globals.roommateEndDate,
        roommateLocation: globals.roommateLocation,
        roommateLocationCtr: {
          lat: globals.roommateLocationCtr.lat,
          lng: globals.roommateLocationCtr.lng
        },
      });
    })
  }
  
  render(){
    if (!this.state.doDisplay)
      return null;
    let roomButtonClassName = "SplashPage-listingtypebutton";
    let roommateButtonClassName = "SplashPage-listingtypebutton";
    switch(this.state.roomOrRoommate) {
      case(listing_type.ROOM):
      roomButtonClassName += " SplashPage-listingtypebuttonactive";
        break;
      case(listing_type.ROOMMATE):
      roommateButtonClassName += " SplashPage-listingtypebuttonactive";
        break;
    }

    const roomTrue = (this.state.roomOrRoommate === listing_type.ROOM);

    const {
      state: {
        roomStartDate, roomEndDate, roommateStart,
        roommateEnd, roomLocation, roommateLocation
      }
    } = this;

    let roomSearchBar = (
      <div>
      <GoogleSearchBar
      setSelectedCenter={(ctr) => {
        this.setState({roomLocationCtr: ctr});
      }} 
      styleName="SplashPage"
      placeIsCity={true}
      searchBarId={"splashPageSearchRoom"}
      updateQuery={(loc) => {this.setState({ roomLocation: loc });}}
      text={this.state.roomLocation}
      />
      </div>
    );

    let roommateSearchBar = (
      <div>
      <GoogleSearchBar
      setSelectedCenter={(ctr) => {
        this.setState({roommateLocationCtr: ctr});
      }} 
      styleName="SplashPage"
      placeIsCity={false}
      searchBarId={"splashPageSearchRoommate"}
      updateQuery={(loc) => {this.setState({ roommateLocation: loc });}}
      text={this.state.roommateLocation}
      />
      </div>
    );

    return (
      <div className="SplashPage-container">
        <div className="SplashPage-infoContainer">
          <div className="SplashPage-taglineContainer">
            <div className="SplashPage-logo">burrow</div>
            {roomTrue ? (
            <div className="SplashPage-tagline">I&apos;m looking for a</div>
            ) : (
            <div className="SplashPage-tagline">I&apos;ve GOT a room and am looking for a</div>
            )}
          </div>

          <div>
            <button
            className={roomButtonClassName}
            onClick={()=>this.setState({roomOrRoommate: listing_type.ROOM})}>Room</button>
            <button
            className={roommateButtonClassName}
            onClick={()=>this.setState({roomOrRoommate: listing_type.ROOMMATE})}>Roommate</button>
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

            {roomTrue ? roomSearchBar : roommateSearchBar}


          <div className="SplashPage-date SplashPage-input">
            <DatePicker
              startDate={roomTrue ? roomStartDate : roommateStart}
              endDate={roomTrue ? roomEndDate: roommateEnd}
              handleDateChange={(stdate, edate) => {
                roomTrue ? this.setState({roomStart: stdate, roomEndDate: edate}) :
                  this.setState({roommateStart: stdate, roommateEndDate: edate});
              }}/>
          </div>
          <button
            className="SplashPage-go SplashPage-input"
            type="submit"
            value="Go!"
            onClick={() => {
              let lookingForRoom = (this.state.roomOrRoommate == listing_type.ROOM);
              let body = lookingForRoom ? {
                lookingForRoom: true,
                roomLocation: this.state.roomLocation,
                roomLocationCtr: {
                  lat: this.state.roomLocationCtr.lat,
                  lng: this.state.roomLocationCtr.lng,
                },
                roomStartDate: this.state.roomStartDate,
                roomEndDate: this.state.roomEndDate
              } : {
                lookingForRoom: false,
                roommateLocation: this.state.roommateLocation,
                roommateLocationCtr: {
                  lat: this.state.roommateLocationCtr.lat,
                  lng: this.state.roommateLocationCtr.lng,
                },
                roommateStartDate: this.state.roommateStart,
                roommateEndDate: this.state.roommateEnd
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