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
    this.state = {
      price: this.props.price || 0,
      smoking: this.props.smoking || true,
      pets: this.props.pets || true,
      listingsToDisplay: [],
    };
  }

  componentDidMount(){
    this.generateListings();
  }

  generateListings(){
    get("/api/matchinglistings").then((listings) => {
      console.log(listings);
      this.setState({listingsToDisplay: listings});
    });
  }

  render(){
    const {searchPrefs: {location, lookingForRoom, price, startDate, endDate, smoking, pets}} = this.props;
    return (
      <div className="MainPage-container">
        <PreferenceBar price={price} smoking={smoking} pets={pets} lookingForRoom={lookingForRoom}
        updatePrefs={(price, smoking, pets) => this.setState({price, smoking, pets}, () => this.generateListings())}/>
        <div className="MainPage-feedMapContainer">
          <Listings displayedListings={this.state.listingsToDisplay} styleName="MainPage" />
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