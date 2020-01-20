import "./NewListing.css";
import "../../utilities.css"
import { get, post } from "../../utilities";
import React, {Component} from "react";
import PropTypes from "prop-types";
import {LocationSearchBar} from "./SearchBar.js";
import DatePicker from "./DatePicker.js";

class NewListing extends Component {
  static PropTypes = {
    // close: PropTypes.func.isRequired, // NewListing will be a popup. That's why.
    userId: PropTypes.string.isRequired,
    lookingForRoom: PropTypes.bool.isRequired,
    addNewListing: PropTypes.func.isRequired,
  };

  constructor(props){
    super(props);
    this.state = {
      location: "",
      startDate: undefined,
      endDate: undefined,
      price: 0,
      pets: false,
      smoking: false,
      textBox: ""
    };
  }

  handleSubmit(){
    get("/api/user", {userId: this.props.userId}).then((userInfo) =>{
      return {
        creator_ID: this.props.userId,
        photoList: [],
        type: this.props.lookingForRoom,
        location_ID: this.state.location,
        price: this.state.price,
        startDate: this.state.startDate._d,
        endDate: this.state.endDate._d,
        smokingFriendly: this.state.smoking,
        petFriendly: this.state.pets,
        additionalPrefText: this.state.textBox,
      };
    }).then((listingInfo) => {
      post("/api/listing", listingInfo);
      this.props.addNewListing(listingInfo);
    });
  }

  render(){
    return (
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
            <input type="text" onChange={(e) => this.setState({location: e.target.value})} className="NewListing-locationInput" /> 
            {/* <LocationSearchBar styleName="NewListing" /> */}
          </div>
          <div className="NewListing-dateContainer">
            <div className="NewListing-locationDescription">
              During...
            </div>
            <div className="NewListing-locationInput">
              <DatePicker handleDateChange={(startDate, endDate) => this.setState({startDate, endDate})} />
            </div>
          </div>
          <div className="NewListing-priceContainer">
            <div className="NewListing-priceDescription">
              {this.props.lookingForRoom ? "With maximum budget..." : "With the following price:"}
            </div>
            <input type="number" min="0" onChange={(e) => {this.setState({price: e.target.value})}} 
              className="NewListing-priceInput" placeholder={this.props.lookingForRoom ? "$ USD" : "$ USD"} />/month
          </div>
          <div className="NewListing-prefsContainer">
            <div className="NewListing-pets">
              Pet friendly? 
              <input onClick={() => {this.setState((prev) => {return {pets: !prev.pets};})}} type="checkbox" className="NewListing-checkbox"/>
            </div>
            <div className="NewListing-smoking">
              Smoker friendly? 
              <input onClick={() => {this.setState((prev) => {return {smoking: !prev.smoking};})}} type="checkbox" className="NewListing-checkbox"/>
            </div>
          </div>
          <div className="NewListing-textBoxContainer">
            <div className="NewListing-textBoxDescription">Tell us about yourself!</div>
            <input type="text" onChange={(e) => {this.setState({textBox: e.target.value})}} className="NewListing-textBox" />
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
    );
  }
}

export default NewListing;