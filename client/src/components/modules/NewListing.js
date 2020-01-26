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
      startDate: undefined,
      durationIndex: -1,
      price: 0,
      textBox: "",
      success: false
    };
  }

  validate = () => {

  }

  handleSubmit(){
    console.log(this.state.price);
    if (this.state.durationIndex === -1 || this.state.locationquery === '' || this.state.startDate === undefined ||
        this.state.price === 0 || this.state.price === "" || this.state.textBox.trim().length === 0){
      this.setState({mustfillfields: true});
      return;
    }
    const listingInfo = { 
        coordinates: this.state.locationcenter,
        location: this.state.locationquery,
        price: this.state.price,
        startDate: this.state.startDate,
        durationIndex: this.state.durationIndex,
        additionalPrefText: this.state.textBox,
    };
    post("/api/listing", listingInfo)
      .then(this.setState({success: true}, () => {
        setTimeout(() => window.location.pathname = `/profile/${this.props.userId}`, 750);
      })
    );
  }

  render(){
    let durationOptions = ["short (1-3 mos.)", "medium (3-6 mos.)", "long (6-12 mos.)", "indefinite (>12 mos.)"];
    if (this.state.success){
      return (<div className="NewListing-submitted">Listing submitted successfully!</div>);
    }
    return (
      <div className="NewListing-supercontainer">
        <div className="NewListing-container">
          { this.state.mustfillfields && (
            <span className="warning">You must fill all fields!</span>
            )}
          <div className="NewListing-center">
            <div className="NewListing-locationContainer">
              <div className="NewListing-description">
                i'm looking for a room near...
              </div>
              <GoogleSearchBar styleName="NewListing"
                placeIsCity={true}
                searchBarId="newListingSearch"
                updateQuery={(newquery, newcenter)=>{this.setState({locationcenter: newcenter, locationquery: newquery});}}
              />
            </div>
            <div className="NewListing-dateContainer">
              <div className="NewListing-description">
                My move-in date is approximately...
              </div>
              <div className="NewListing-locationInput">
                <input className = "inputbirthdate"
                  type="date"
                  name="birthdate"
                  value={this.state.startDate}
                  onChange={(e) => {this.setState({startDate: e.target.value})}}
                />
              </div>
            </div>
            <div className="NewListing-durationContainer">
              <div className="NewListing-description">
                My stay duration is...
              </div>
              <div className="NewListing-duration">
                {durationOptions.map((desc, i) => (
                  <button
                  className={this.state.durationIndex !== i ? "NewListing-durationButton" : "NewListing-durationButton NewListing-durationSelect"}
                  onClick={()=>{this.setState({durationIndex: i})}}
                  >{desc}</button>
                ))}
              </div>
            </div>
            <div className="NewListing-priceContainer">
              <div className="NewListing-description">
                With approximate budget...
              </div>
              $<input type="number" min="0" step="100" onChange={(e) => {this.setState({price: e.target.value})}} 
                className="NewListing-priceInput" />/month
            </div>
            <div className="NewListing-textBoxContainer">
              <div className="NewListing-description">Tell us about yourself!</div>
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