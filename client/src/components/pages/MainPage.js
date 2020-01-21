import React, {Component} from "react";
import PropTypes from "prop-types";
import "../../utilities";
import "../../utilities.css";
import "./MainPage.css";
import PreferenceBar from "../modules/PreferenceBar";
import Listings from "../modules/Listings";
import { get } from "../../utilities";

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
          {/* <Map 
            center={}
            zoom={}
            markers={}/>  */}
        </div>
      </div>
    )
  }
}
MainPage.propTypes = {
  userId: PropTypes.string.isRequired,
  updatePrefs: PropTypes.func.isRequired,
  searchPrefs: PropTypes.shape({
    location: PropTypes.string.isRequired,
    lookingForRoom: PropTypes.bool.isRequired,
    price: PropTypes.number.isRequired,
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    smoking: PropTypes.bool.isRequired,
    pets: PropTypes.bool.isRequired,
  })
};


export default MainPage;