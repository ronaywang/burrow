import React, {Component} from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import "./PreferenceBar.css";
import DatePicker from "./DatePicker";
const momentPropTypes = require("react-moment-proptypes");

class PreferenceBar extends Component {


  
  render(){
    const {
      props: {
        lookingForRoom, updatePrefs, price, smoking, pets, startDate, endDate
      }
    } = this;
    return (
      <div className="PreferenceBar-container">
        <div className="PreferenceBar-price">
          {lookingForRoom ? "Budget: " : "Price: "}
          <span className="PreferenceBar-dollarsign">$</span>
          <input type="number" min="0" value={this.props.price} onChange={(e) => {
              updatePrefs(e.target.value, smoking, pets, startDate, endDate);
            }} 
            className="PreferenceBar-priceInput" placeholder={lookingForRoom ? "Enter budget ..." : "Enter price ..."} />/month
        </div>
        <div className="PreferenceBar-dateContainer">
          <DatePicker startDate={startDate} endDate={endDate} handleDateChange={(startDate, endDate) => {
              updatePrefs(price, smoking, pets, startDate, endDate);
            }
          } />
        </div>
        <div className="PreferenceBar-pets">  
          Pet friendly? 
          <input onClick={() => {
              updatePrefs(price, smoking, !pets, startDate, endDate)
          }} type="checkbox" className="PreferenceBar-checkbox" checked={pets}/>
        </div>
        <div className="PreferenceBar-smoking">
          Smoker friendly? 
          <input onClick={() => updatePrefs(price, !smoking, pets, this.props.startDate, this.props.endDate)} 
            type="checkbox" className="PreferenceBar-checkbox" checked={smoking}/>
        </div>
      </div>
    ) 
  }
}
PreferenceBar.propTypes = {
  price: PropTypes.number.isRequired,
  smoking: PropTypes.bool.isRequired,
  pets: PropTypes.bool.isRequired,
  startDate: momentPropTypes.momentObj.isRequired,
  endDate: momentPropTypes.momentObj.isRequired,
  lookingForRoom: PropTypes.bool.isRequired,
  updatePrefs: PropTypes.func.isRequired,
};

export default PreferenceBar;