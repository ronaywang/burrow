import React, { Component } from "react";
import {Tabs} from "../modules/Tabs.js";
import {LocationSearchBar} from "../modules/SearchBar.js";
import DatePicker from "../modules/DatePicker.js";
import "./SplashPage.css";
import "../../utilities.css";
import PropTypes from "prop-types";

class SplashPage extends Component {
  static PropTypes = {
    passDateLocationToGlobal: PropTypes.func.isRequired
  };

  constructor(props){
    super(props);
    this.state = {
      roomStartDate: undefined,
      roomEndDate: undefined,
      roommateStart: undefined,
      roommateEnd: undefined,
      location: undefined,
      lookingForRoom: true
    };
  }
  componentDidMount(){

  }
  render(){
    const {
      state: {
        roomStartDate, roomEndDate, roommateStart,
        roommateEnd, location, lookingForRoom
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
            <div label="Room" onClick={() => this.setState({lookingForRoom: true})}>
              {/* TODO <LocationSearchBar defaultText="Enter a city, state, etc." styleName="SplashPage" /> SplashPage-search */}
              <div className="SplashPage-date">
                <DatePicker startDate={roomStartDate} endDate={roomEndDate}
                handleDateChange={(startDate, endDate) => this.setState({roomStartDate: startDate, roomEndDate: endDate})}/>
              </div>
              <button className="SplashPage-go" value="Go!"/>
            </div>

            <div label="Roommate" onClick={() => this.setState({lookingForRoom: false})}>
              {/* TODO <LocationSearchBar defaultText="Enter an address" styleName="SplashPage" /> SplashPage-search */}
              <div className="SplashPage-date">
                <DatePicker startDate={roommateStart} endDate={roommateEnd}
                handleDateChange={(startDate, endDate) => this.setState({roommateStart: startDate, roommateEnd: endDate})}/>
              </div>
              <button className="SplashPage-go" value="Go!"></button>
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