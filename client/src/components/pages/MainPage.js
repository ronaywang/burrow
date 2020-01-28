import React, {Component} from "react";
import PropTypes from "prop-types";
import "../../utilities";
import "../../utilities.css";
import "./MainPage.css";
import PreferenceBar from "../modules/PreferenceBar";
import ListingsFast from "../modules/ListingsFast";
import MapComponent from "../modules/Map";
import { get, post } from "../../utilities";
const has = require("lodash/has");

const isUndefined = require("lodash/isUndefined");

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
    document.body.classList.remove("SplashPage-body");
    this.triggerSearch();
  }

  generateListings = () => {
    let query = {
      userId: this.props.userId, 
      location: this.state.location,
      locationCtr: this.state.locationCtr,
      price: this.state.price,
      startDate: new Date(this.state.startDate),
      durationIndex: this.state.durationIndex,
    }
    post("/api/matchinglistings", query).then((listings) => { // "listings" is an array of form {_id: <blah>, coordinates: <blah}
      this.setState({listingsToDisplay: listings});
    });
    console.log(this.state.locationCtr);
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
    const {locationCtr} = this.state;
    return (
      <div className="MainPage-container">
        <PreferenceBar triggerSearch={() => {this.triggerSearch()}}/>  
        <div className="MainPage-feedMapContainer">
          {/* <div className="MainPage-queryContainer">{`Results for ${location}:`}</div> */}
          {/* <Listings displayedListings={this.state.listingsToDisplay.map(l => l._id)} styleName="MainPage" /> */}
          <ListingsFast displayedListings={this.state.listingsToDisplay} styleName="MainPage" editDeletePerms={false} />
          <div className="MainPage-mapContainer">
            <MapComponent
              initialCenter={locationCtr}
              initialZoom={11}
              markers={this.state.listingsToDisplay.filter(l=>has(l, 'coordinates')).map(l => l.coordinates)}
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