import React, {Component} from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import "./PreferenceBar.css";
import DatePicker from "./DatePicker";

class PreferenceBar extends Component {


  constructor(props){
    super(props);
    this.state = {
      price: this.props.price,
      smoking: this.props.smoking,
      pets: this.props.pets,
      startDate: this.props.startDate,
      endDate: this.props.endDate
    };
  }
  render(){
    const {
      props: {
        lookingForRoom, updatePrefs
      },
      state: {
        price, smoking, pets
      }
    } = this;
    return (
      <div className="PreferenceBar-container">
        <div className="PreferenceBar-price">
          <span className="PreferenceBar-dollarsign">$</span>
          <input type="number" min="0" onChange={(e) => {
              this.setState({price: e.target.value}, () => {
                updatePrefs(price, smoking, pets, this.state.startDate, this.state.endDate);
              })
            }} 
            className="PreferenceBar-priceInput" placeholder={lookingForRoom ? "Enter budget ..." : "Enter price ..."} />/month
        </div>
        <div className="PreferenceBar-dateContainer">
          <DatePicker handleDateChange={(startDate, endDate) => {
            this.setState({startDate: startDate._d, endDate: endDate._d}, () => {
              updatePrefs(price, smoking, pets, this.state.startDate, this.state.endDate);
            })
          }} />
        </div>
        <div className="PreferenceBar-pets">  
          Pet friendly? 
          <input onClick={() => {
            this.setState((prev) => {return {pets: !prev.pets};}, () => {
              updatePrefs(price, smoking, pets, this.props.startDate, this.props.endDate);
            })
          }} type="checkbox" className="PreferenceBar-checkbox"/>
        </div>
        <div className="PreferenceBar-smoking">
          Smoker friendly? 
          <input onClick={() => {this.setState((prev) => {return {smoking: !prev.smoking};}, () => {
            updatePrefs(price, smoking, pets, this.props.startDate, this.props.endDate);
          })}} type="checkbox" className="PreferenceBar-checkbox"/>
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