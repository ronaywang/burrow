import React, {Component} from "react";
import PropTypes from "prop-types";
import "../../utilities";
import "../../utilities.css";
import "./MainPage.css";
import PreferenceBar from "../modules/PreferenceBar";
import Listings from "../modules/Listings";
import MapComponent from "../modules/Map";
import { get } from "../../utilities";
const momentPropTypes = require("react-moment-proptypes");

class MainPage extends Component{
  constructor(props){
    super(props);
  }

  render(){
    const {updatePrefs, searchPrefs: {location, lookingForRoom, price, startDate, endDate, smoking, pets}} = this.props;
    return (
      <div className="MainPage-container">
        <PreferenceBar price={price} smoking={smoking} pets={pets} lookingForRoom={lookingForRoom} startDate={startDate} endDate={endDate}
        updatePrefs={updatePrefs}/>
        <div className="MainPage-feedMapContainer">
          <div className="MainPage-queryContainer">{`Results for ${location}:`}</div>
          <Listings displayedListings={this.props.listingsToDisplay} styleName="MainPage" />
          <div className="MainPage-mapContainer">
            <MapComponent />
          </div>
        </div>
      </div>
    )
  }
}
MainPage.propTypes = {
  userId: PropTypes.string.isRequired,
  triggerSearch: PropTypes.func.isRequired,
  updatePrefs: PropTypes.func.isRequired,
  searchPrefs: PropTypes.shape({
    location: PropTypes.string.isRequired,
    lookingForRoom: PropTypes.bool.isRequired,
    price: PropTypes.number.isRequired,
    startDate: momentPropTypes.momentObj.isRequired,
    endDate: momentPropTypes.momentObj.isRequired,
    smoking: PropTypes.bool.isRequired,
    pets: PropTypes.bool.isRequired,
  })
};


export default MainPage;