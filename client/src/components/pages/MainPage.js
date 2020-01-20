import React, {Component} from "react";
import PropTypes from "prop-types";
import "../../utilities";
import "../../utilities.css";
import "./MainPage.css";
import PreferenceBar from "../modules/PreferenceBar";
import Listings from "../modules/Listings";

class MainPage extends Component{
  static PropTypes = {
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
  }

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
    if (this.state.pets)
      this.setState({listingsToDisplay: ["5e24e72d0c9734134de5b65e"]});
    else{
      this.setState({listingsToDisplay: ["5e24e81abb1d53136fa4b6b8"]});
    }
  }

  render(){
    const {searchPrefs: {location, lookingForRoom, price, startDate, endDate, smoking, pets}} = this.props;
    return (
      <div className="MainPage-container">
        <PreferenceBar price={price} smoking={smoking} pets={pets} lookingForRoom={lookingForRoom}
        updatePrefs={(price, smoking, pets) => this.setState({price, smoking, pets}, () => this.generateListings())}/>
        <div className="MainPage-feedMapContainer">
          <Listings displayedListings={this.state.listingsToDisplay} styleName="MainPage" />
          {/*<Map 
            center={}
            zoom={}
            markers={}/> {/* Center's gonna be the location search. Zoom's gonna make sure to contain all listings.
                            All listings will appear as markers on the map. */}
        </div>
      </div>
    )
  }
}

export default MainPage;