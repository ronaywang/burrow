import React, { Component } from "react";
import {Tabs} from "../modules/Tabs.js";
import {GoogleSearchBar} from "../modules/SearchBar.js";
import DatePicker from "../modules/DatePicker.js";
import "./SplashPage.css";
import "../../utilities.css";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

class SplashPage extends Component {
  static PropTypes = {
    passDateLocationToGlobal: PropTypes.func.isRequired
  };

  constructor(props){
    super(props);
    this.state = {
      roomStartDate: undefined,
      roomEndDate: undefined,
      roomLocation: undefined,
      roommateStart: undefined,
      roommateEnd: undefined,
      roommateLocation: undefined
    };
  }
  
  render(){
    const {
      state: {
        roomStartDate, roomEndDate, roommateStart,
        roommateEnd, roomLocation, roommateLocation
      }
    } = this;
    return (
      <div className="SplashPage-container">
        <div className="SplashPage-infoContainer">
          <div className="SplashPage-taglineContainer">
            <div className="SplashPage-logo">burrow</div>
            <div className="SplashPage-tagline">i'm looking for a...</div>
          </div>
          <Tabs styleName="SplashPage">
            <div label="Room">
              <GoogleSearchBar styleName="SplashPage" placeIsCity={true}/>
              <div className="SplashPage-date">
                <DatePicker startDate={roomStartDate} endDate={roomEndDate}
                handleDateChange={(startDate, endDate) => this.setState({roomStartDate: startDate, roomEndDate: endDate})}/>
              </div>
              <Link to="/main">
                <input className="SplashPage-go" type="submit" value="Go!" onClick={() => this.props.passDateLocationToGlobal(roomStartDate, roomEndDate, roomLocation, true)}/>
              </Link>
            </div>

            <div label="Roommate">
              <GoogleSearchBar styleName="SplashPage" placeIsCity={false}/>
              <div className="SplashPage-date">
                <DatePicker startDate={roommateStart} endDate={roommateEnd}
                handleDateChange={(startDate, endDate) => this.setState({roommateStart: startDate, roommateEnd: endDate})}/>
              </div>
              <Link to="/main">
                <input className="SplashPage-go" type="submit" value="Go!" onClick={() => this.props.passDateLocationToGlobal(roommateStart, roommateEnd, roommateLocation, false)}/>
              </Link>
            </div>
          </Tabs>
        </div>
        {/* <LocationSearchBar 
          defaultText="Search here..."
          styleName=""
          radius={40000}
          handleSubmit={()=>null}
          submitButtonExists={false}
        /> */}
      </div>
    );
  }
}

export default SplashPage;