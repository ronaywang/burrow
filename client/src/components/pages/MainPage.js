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
  
  async componentDidMount() {
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
    post("/api/matchinglistings", query).then((listings) => { 
      this.setState({listingsToDisplay: listings}, () => {
        if (this.state.location.length == 0 && this.state.listingsToDisplay.length > 0)
          this.setState({locationCtr: this.state.listingsToDisplay[0].coordinates});
      });
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
    
    const {locationCtr, listingsToDisplay} = this.state;
    console.log(`NEW LOCATION CENTER: ${JSON.stringify(locationCtr)}`)
    return (
      <div className="MainPage-container">
        <PreferenceBar triggerSearch={() => {this.triggerSearch()}}/>  
        <div className="MainPage-feedMapContainer">
          {/* <div className="MainPage-queryContainer">{`Results for ${location}:`}</div> */}
          {/* <Listings displayedListings={this.state.listingsToDisplay.map(l => l._id)} styleName="MainPage" /> */}
          <ListingsFast styleName="MainPage" displayedListings={listingsToDisplay} editDeletePerms={false} 
            setCenter={(coords) => {
              this.setState({locationCtr: coords});
            }}/>
          <div className="MainPage-mapContainer">
            <MapComponent
              initialCenter={locationCtr}
              newCenter={locationCtr}
              initialZoom={8}
              markers={listingsToDisplay.filter(l=>has(l, 'coordinates')).map(l => {return {coordinates: l.coordinates, markertitle: l.location};})}
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