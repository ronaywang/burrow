import "./NewListing.css";
import "../../utilities.css"
import { get, post } from "../../utilities";
import React, {Component} from "react";
import PropTypes from "prop-types";
import {GoogleSearchBar} from "./SearchBar.js";
import DatePicker from "./DatePicker.js";
import MapComponent from "./Map";
import moment from "moment";
import Toggle from 'react-toggle';

class NewListing extends Component {

  constructor(props){
    super(props);
    this.state = {
      lookingForRoom: true,
      locationquery: '',
      locationcenter: '',
      startDate: new moment(),
      endDate: new moment().add(1, 'd'),
      price: 0,
      pets: false,
      smoking: false,
      textBox: "",
      success: false
    };
  }

  handleSubmit(){
    const listingInfo = { 
        photoList: [],
        lookingForRoom: this.state.lookingForRoom,
        coordinates: this.state.locationcenter,
        location: this.state.locationquery,
        price: this.state.price,
        startDate: this.state.startDate.toDate(),
        endDate: this.state.endDate.toDate(),
        smokingFriendly: this.state.smoking,
        petFriendly: this.state.pets,
        additionalPrefText: this.state.textBox,
    };
    post("/api/listing", listingInfo).then(() => this.props.update());
  }

  render(){
    if (this.state.success){
      return (<div className="NewListing-submitted">Listing submitted successfully!</div>);
    }
    let petsclassName = "NewListing-boolbutton";
    let smokclassName = "NewListing-boolbutton";
    let petText;
    let smokText;
    if (this.state.pets) {
      petsclassName += " NewListing-boolbutton-true";
      petText = "Pet friendly ✓";
    } else {
      petsclassName += " NewListing-boolbutton-false";
      petText = "Pet friendly ✗";
    }
    if (this.state.smoking) {
      smokclassName += " NewListing-boolbutton-true";
      smokText = "Smoker friendly ✓";
    } else {
      smokclassName += " NewListing-boolbutton-false";
      smokText = "Smoker friendly ✗";
    }

    return (
      <div className="NewListing-supercontainer">
      <div className="NewListing-container">
        <div className="NewListing-left">
          <div className="NewListing-profilePicContainer">
          </div>
        </div>
        <div className="NewListing-center">
          <div className="NewListing-toggleContainer">
            Roommate
            <Toggle
              className="NewListing-toggleSwitch" defaultChecked={this.state.lookingForRoom} 
              onChange={() => this.setState((prev) => ({lookingForRoom: !prev.lookingForRoom}))}
            />
            Room
          </div>
          <div className="NewListing-locationContainer">
            <div className="NewListing-locationDescription">
              {this.state.lookingForRoom ? "Looking for a room in..." : "Looking for a roommate for the following address..."}
            </div>
            {this.state.lookingForRoom ? <GoogleSearchBar styleName="NewListing"
              placeIsCity={true}
              searchBarId="newListingSearch"
              updateQuery={(newquery, newcenter)=>{this.setState({locationcenter: newcenter, locationquery: newquery});}}
            /> : null}
            {this.state.lookingForRoom ? null : <GoogleSearchBar styleName="NewListing"
              placeIsCity={false}
              searchBarId="newListingSearch"
              updateQuery={(newquery, newcenter)=>{this.setState({locationcenter: newcenter, locationquery: newquery});}}
            />}
          </div>
          <div className="NewListing-dateContainer">
            <div className="NewListing-locationDescription">
              During...
            </div>
            <div className="NewListing-locationInput">
              <DatePicker
              handleDateChange={(startDate, endDate) => this.setState({startDate: startDate, endDate: endDate})}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              startDateId="newl-startdateid"
              endDateId="newl-enddateid"
              />
            </div>
          </div>
          <div className="NewListing-priceContainer">
            <div className="NewListing-priceDescription">
              {this.state.lookingForRoom ? "With maximum budget..." : "With the following price:"}
            </div>
            $<input type="number" min="0" onChange={(e) => {this.setState({price: e.target.value})}} 
              className="NewListing-priceInput" />/month
          </div>
          <div className="NewListing-prefsContainer">
              <button className={petsclassName} onClick={()=>{this.setState({pets: !this.state.pets});}}>{petText}</button>
              <button className={smokclassName} onClick={()=>{this.setState({smoking: !this.state.smoking});}}>{smokText}</button>
          </div>
          <div className="NewListing-textBoxContainer">
            <div className="NewListing-textBoxDescription">Tell us about yourself!</div>
            <textarea rows="10" cols="30" onChange={(e) => {this.setState({textBox: e.target.value})}} className="NewListing-textBox" />
          </div>
          <input
            className="NewListing-submit"
            type="submit"
            value="Submit"
            onClick={async () => {
              await this.handleSubmit();
              this.setState({success: true}, () => {
                setTimeout(() => this.props.close(), 750);
              })
            }}
          />
        </div>
      </div>
      {/* {this.state.locationcenter && (
      <MapComponent
      path="/map"
      initialCenter={{lat: 42.360495, lng: -71.093779 }}
      newCenter = {this.state.locationcenter}
      initialZoom={14}
      width={300}
      height={640}
      />
      )} */}
      </div>
    );
  }
}

NewListing.propTypes = {
  // close: PropTypes.func.isRequired, // NewListing will be a popup. That's why.
  lookingForRoom: PropTypes.bool.isRequired,
  addNewListing: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
};

export default NewListing;