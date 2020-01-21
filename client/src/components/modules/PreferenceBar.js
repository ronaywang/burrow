import React, {Component} from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import "./PreferenceBar.css";
import DatePicker from "./DatePicker";

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
          <span className="PreferenceBar-dollarsign">$</span>
          <input type="number" min="0" onChange={(e) => {
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
            this.setState((prev) => {return {pets: !prev.pets};}, () => {
              updatePrefs(price, smoking, pets, startDate, endDate);
            })
          }} type="checkbox" className="PreferenceBar-checkbox" checked={pets}/>
        </div>
        <div className="PreferenceBar-smoking">
          Smoker friendly? 
          <input onClick={() => {this.setState((prev) => {return {smoking: !prev.smoking};}, () => {
            updatePrefs(price, smoking, pets, this.props.startDate, this.props.endDate);
          })}} type="checkbox" className="PreferenceBar-checkbox" checked={smoking}/>
        </div>
      </div>
    ) 
  }
}
PreferenceBar.propTypes = {
  price: PropTypes.number.isRequired,
  smoking: PropTypes.bool.isRequired,
  pets: PropTypes.bool.isRequired,
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
  lookingForRoom: PropTypes.bool.isRequired,
  updatePrefs: PropTypes.func.isRequired,
};

export default PreferenceBar;