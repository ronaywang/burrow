import React, {Component} from "react";
import PropTypes from "prop-types";
import "../../utilities";
import "../../utilities.css";
import "./MainPage.css";
import PreferenceBar from "../modules/PreferenceBar";
import Listings from "../modules/Listings";
import MapComponent from "../modules/Map";
import { get, post } from "../../utilities";
import * as moment from "moment";
// const momentPropTypes = require("react-moment-proptypes");

const mitCoords ={lat: 42.360495, lng: -71.093779 };

class MainPage extends Component{
  constructor(props){
    super(props);
    this.state = {
      doDisplay: false,
      listingsToDisplay: [],
    };
  }
  
  componentDidMount() {
    this.triggerSearch();
  }

  generateListings = () => {
    let query = this.state.lookingForRoom ? {
      userId: this.props.userId, 
      location: this.state.roomLocation,
      lookingForRoom: true,
      price: this.state.roomPrice,
      smoking: this.state.roomSmoking,
      pets: this.state.roomPets,
      startDate: new Date(this.state.roomStartDate),
      endDate: new Date(this.state.roomEndDate),
    } : {
      userId: this.props.userId, 
      location: this.state.roommateLocation,
      lookingForRoom: false,
      price: this.state.roommatePrice,
      smoking: this.state.roommateSmoking,
      pets: this.state.roommatePets,
      startDate: new Date(this.state.roommateStartDate),
      endDate: new Date(this.state.roommateEndDate),
    };
    get("/api/matchinglistings", query).then((listings) => { // "listings" is an array of form {_id: <blah>, coordinates: <blah}
      this.setState({listingsToDisplay: listings});
    });
  }

  triggerSearch = () => {
    get("/api/sessionglobals").then((globals) => {
      this.setState(globals);
      console.log(`Your main page globals are: ${JSON.stringify(globals)}`);
    }).then(() => {
      this.generateListings()
    }).then(() => {
      this.setState({doDisplay: true});
    });
  }

  render(){
    if (!this.state.doDisplay){
      return null;
    }
    let locationCtr = this.state.lookingForRoom ? this.state.roomLocationCtr : this.state.roommateLocationCtr;
    return (
      <div className="MainPage-container">
        <PreferenceBar triggerSearch={() => {this.triggerSearch()}}/>
        <div className="MainPage-feedMapContainer">
          {/* <div className="MainPage-queryContainer">{`Results for ${location}:`}</div> */}
          <Listings displayedListings={this.state.listingsToDisplay.map(l => l._id)} styleName="MainPage" />
          <div className="MainPage-mapContainer">
            <MapComponent
              initialCenter={locationCtr}
              initialZoom={8}
              markers={this.state.listingsToDisplay.map(l => l.coordinates)}
            />
          </div>
        </div>
      </div>
    )
  }
}
MainPage.propTypes = {
  userId: PropTypes.string.isRequired
};


export default MainPage;