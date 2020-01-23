import "./NewListing.css";
import "../../utilities.css"
import { get, post } from "../../utilities";
import React, {Component} from "react";
import PropTypes from "prop-types";
import {GoogleSearchBar} from "./SearchBar.js";
import DatePicker from "./DatePicker.js";
import MapComponent from "./Map";
import moment from "moment";

class NewListing extends Component {

  constructor(props){
    super(props);
    this.state = {
      location: "",
      locationquery: '',
      locationcenter: '',
      startDate: new moment(),
      endDate: new moment().add(1, 'd'),
      price: 0,
      pets: false,
      smoking: false,
      textBox: ""
    };
  }

  handleSubmit(){
    const listingInfo = { 
        photoList: [],
        lookingForRoom: this.props.lookingForRoom,
        coordinates: this.state.locationcenter,
        location: this.state.locationquery,
        price: this.state.price,
        startDate: this.state.startDate.toDate(),
        endDate: this.state.endDate.toDate(),
        smokingFriendly: this.state.smoking,
        petFriendly: this.state.pets,
        additionalPrefText: this.state.textBox,
    };
    post("/api/listing", listingInfo).then(newListingId => this.props.update());
  }

  render(){
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
          <div className="NewListing-locationContainer">
            <div className="NewListing-locationDescription">
              {this.props.lookingForRoom ? "Looking for a room in..." : "Looking for a roommate for the following address..."}
            </div>
            <GoogleSearchBar styleName="NavBar"
            placeIsCity={this.props.lookingForRoom}
            setSelectedCenter={(center)=>{this.setState({locationcenter: center})}}
            searchBarId="newListingSearch"
            updateQuery={(newquery)=>{this.setState({locationquery: newquery});}}/>
            {/* <LocationSearchBar styleName="NewListing" /> */}
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
              {this.props.lookingForRoom ? "With maximum budget..." : "With the following price:"}
            </div>
            $<input type="number" min="0" onChange={(e) => {this.setState({price: e.target.value})}} 
              className="NewListing-priceInput" placeholder={this.props.lookingForRoom ? "" : ""} />/month
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
            onClick={() => {
              this.handleSubmit();
              // this.props.close();
            }}
          />
        </div>
      </div>
      {this.state.locationcenter && (
      <MapComponent
      path="/map"
      initialCenter={{lat: 42.360495, lng: -71.093779 }}
      newCenter = {this.state.locationcenter}
      initialZoom={14}
      width={300}
      height={640}
      />
      )}
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