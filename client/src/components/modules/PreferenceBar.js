import React, {Component} from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import { get, post } from "../../utilities";
import "./PreferenceBar.css";
import DatePicker from "./DatePicker";
const momentPropTypes = require("react-moment-proptypes");

class PreferenceBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      doDisplay: false
    };
  }

  componentDidMount(){
    get("/api/sessionglobals").then((globals) => {
      this.setState(globals, () => {
        this.setState({doDisplay: true});
      })
    });
  }
  
  update = (price, smoking, pets, startDate, endDate) => {
    if (this.state.lookingForRoom){
      this.setState({
        roomPrice: price, roomSmoking: smoking, roomPets: pets, roomStartDate: startDate, roomEndDate: endDate,
      }, () => {
        post("/api/sessionglobals", {
          roomPrice: this.state.roomPrice,
          roomSmoking: this.state.roomSmoking,
          roomPets: this.state.roomPets,
          roomStartDate: this.state.roomStartDate,
          roomEndDate: this.state.roomEndDate,
          roommatePrice: this.state.roomPrice,
          roommateSmoking: this.state.roommateSmoking,
          roommatePets: this.state.roommatePets,
          roommateStartDate: this.state.roommateStartDate,
          roommateEndDate: this.state.roommateEndDate,
        })
      })
    }
    else {
      this.setState({
        roommatePrice: price, roommateSmoking: smoking, roommatePets: pets, roommateStartDate: startDate, roommateEndDate: endDate,
      }, () => {
        post("/api/sessionglobals", {
          roomPrice: this.state.roomPrice,
          roomSmoking: this.state.roomSmoking,
          roomPets: this.state.roomPets,
          roomStartDate: this.state.roomStartDate,
          roomEndDate: this.state.roomEndDate,
          roommatePrice: this.state.roomPrice,
          roommateSmoking: this.state.roommateSmoking,
          roommatePets: this.state.roommatePets,
          roommateStartDate: this.state.roommateStartDate,
          roommateEndDate: this.state.roommateEndDate,
        })
      })
    }
  }

  render(){
    if (!this.state.doDisplay)
      return null;
    const {
      state: {
        lookingForRoom, roomPrice, roomSmoking, roomPets, roomStartDate, roomEndDate,
        roommatePrice, roommateSmoking, roommatePets, roommateStartDate, roommateEndDate
      }
    } = this;
    let price = lookingForRoom ? roomPrice : roommatePrice;
    let smoking = lookingForRoom ? roomSmoking: roommateSmoking;
    let pets = lookingForRoom ? roomPets : roommatePets;
    let startDate = lookingForRoom ? roomStartDate : roommateStartDate;
    let endDate = lookingForRoom ? roomEndDate : roommateEndDate;
    return (
      <div className="PreferenceBar-container">
        <div className="PreferenceBar-price">
          {lookingForRoom ? "Budget: " : "Price: "}
          <span className="PreferenceBar-dollarsign">$</span>
          <input type="number" min="0" value={price} onChange={(e) => {
              this.update(parseInt(e.target.value), smoking, pets, startDate, endDate)
            }} 
            className="PreferenceBar-priceInput" placeholder={lookingForRoom ? "Enter budget ..." : "Enter price ..."} 
          />/month
        </div>
        <div className="PreferenceBar-dateContainer">
          <DatePicker startDate={startDate} endDate={endDate} handleDateChange={async (newstartDate, newendDate) => {
              await this.update(price, smoking, pets, newstartDate, newendDate); 
              this.props.triggerSearch();
            }
          } />
        </div>
        <div className="PreferenceBar-pets">  
          Pet friendly? 
          <input onClick={async () => {
              await this.update(price, smoking, !pets, startDate, endDate);
              this.props.triggerSearch();
          }} type="checkbox" className="PreferenceBar-checkbox" checked={pets}/>
        </div>
        <div className="PreferenceBar-smoking">
          Smoker friendly? 
          <input onClick={async () => {
            await this.update(price, !smoking, pets, startDate, endDate);
            this.props.triggerSearch();
          }
          } 
            type="checkbox" className="PreferenceBar-checkbox" checked={smoking}/>
        </div>
        <div>
          <button className="PreferenceBar-gobutton" onClick={this.props.triggerSearch}>Update!</button>
        </div>
      </div>
    ) 
  }
}
PreferenceBar.propTypes = {
  triggerSearch: PropTypes.func.isRequired,
};

export default PreferenceBar;