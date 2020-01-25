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
      locationquery: '',
      locationcenter: '',
      startDate: new moment(),
      endDate: new moment().add(1, 'd'),
      price: 0,
      textBox: "",
      success: false
    };
  }

  validate = () => {

  }

  handleSubmit(){
    console.log(this.state.price);
    if (this.state.locationquery === '' || 
        this.state.price === 0 || this.state.price === "" || this.state.textBox.trim().length === 0){
      this.setState({mustfillfields: true});
      return;
    }
    const listingInfo = { 
        photoList: [],
        coordinates: this.state.locationcenter,
        location: this.state.locationquery,
        price: this.state.price,
        startDate: this.state.startDate.toDate(),
        endDate: this.state.endDate.toDate(),
        additionalPrefText: this.state.textBox,
    };
    post("/api/listing", listingInfo)
      .then(this.setState({success: true}, () => {
        setTimeout(() => window.location.pathname = `/profile/${this.props.userId}`, 750);
      })
    );
  }

  render(){
    if (this.state.success){
      return (<div className="NewListing-submitted">Listing submitted successfully!</div>);
    }
    return (
      <div className="NewListing-supercontainer">
      <div className="NewListing-container">
          { this.state.mustfillfields && (
            <span className="warning">You must fill all fields!</span>
            )}
        <div className="NewListing-left">
          <div className="NewListing-profilePicContainer">
          </div>
        </div>
        <div className="NewListing-center">
          <div className="NewListing-locationContainer">
            <div className="NewListing-locationDescription">
              Looking for a room in . . .
            </div>
            <GoogleSearchBar styleName="NewListing"
              placeIsCity={true}
              searchBarId="newListingSearch"
              updateQuery={(newquery, newcenter)=>{this.setState({locationcenter: newcenter, locationquery: newquery});}}
            />
          </div>
          <div className="NewListing-dateContainer">
            <div className="NewListing-locationDescription">
              During . . .
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
              With approximate budget . . .
            </div>
            $<input type="number" min="0" step="100" onChange={(e) => {this.setState({price: e.target.value})}} 
              className="NewListing-priceInput" />/month
          </div>
          <div className="NewListing-textBoxContainer">
            <div className="NewListing-textBoxDescription">Tell us about yourself!</div>
            <textarea rows="10" cols="30" onChange={(e) => {this.setState({textBox: e.target.value})}} className="NewListing-textBox" />
          </div>
          <input
            className="NewListing-submit"
            type="submit"
            value="Submit"
            onClick={(e) => {
              e.preventDefault();
              this.handleSubmit();
            }}
          />
        </div>
      </div>
      </div>
    );
  }
}


NewListing.propTypes = {
  addNewListing: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
};

export default NewListing;