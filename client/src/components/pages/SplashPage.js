import React, { Component } from "react";
import {Tabs} from "../modules/Tabs.js";
import {GoogleSearchBar} from "../modules/SearchBar.js";
import DatePicker from "../modules/DatePicker.js";
import "./SplashPage.css";
import "../../utilities.css";
import PropTypes from "prop-types";
import { Link } from "@reach/router";
import moment from "moment";
import {listing_type} from "../modules/enums";

class SplashPage extends Component {

  constructor(props){
    super(props);
    this.state = {
      roomStartDate: moment(),
      roomEndDate: moment().add(1, 'days'),
      roomLocation: "",
      roomLocationCenter: {
        lat: 0,
        lng: 0,
      },
      roomRentLower: 0,
      roomRentUpper: 2000,
      roommateStart: moment(),
      roommateEnd: moment().add(1, 'days'),
      roommateLocation: "",
      roommateLocationCenter: {
        lat: 0,
        lng: 0,
      },
      roommateRentLower: 0,
      roommateRentUpper: 2000,
      roomOrRoommate: listing_type.ROOM,
    };
  }
  
  render(){
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
        this.setState({roomLocationCenter: ctr});
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
      <GoogleSearchBar setSelectedCenter={() => null} styleName="SplashPage" placeIsCity={false} searchBarId="splashPageSearchRoommate" updateQuery={(loc) => this.setState({ roommateLocation: loc })}
      text={this.state.roommateLocation}/>
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


          {roomTrue ? (
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
          )}

            {roomTrue ? roomSearchBar : roommateSearchBar}


          <div className="SplashPage-date SplashPage-input">
            <DatePicker
              startDate={roomTrue ? roomStartDate : roommateStart}
              endDate={roomTrue ? roomEndDate: roommateEnd}
              startDateId="splashpage-startdateid"
              endDateId="splashpage-enddateid"
              handleDateChange={(stdate, edate) => {
                roomTrue ? this.setState({roomStart: stdate, roomEndDate: edate}) :
                  this.setState({roommateStart: stdate, roommateEndDate: edate});
              }}/>
          </div>
          <Link to="/main">
            <button
              className="SplashPage-go SplashPage-input"
              type="submit"
              value="Go!"
              onClick={() => {
                roomTrue ? this.props.passDateLocationToGlobal(roomStartDate, roomEndDate, roomLocation, this.state.roomRentLower, this.state.roomRentUpper, roomTrue) : 
                  this.props.passDateLocationToGlobal(roommateStart, roommateEnd, roommateLocation, this.state.roommateRentLower, this.state.roommateRentUpper, roomTrue);
              }}>Go!</button>
          </Link>
        </div>
      </div>
    );
  }
}

SplashPage.propTypes = {
  passDateLocationToGlobal: PropTypes.func.isRequired,
  setSelectedCenter: PropTypes.func,
};

export default SplashPage;