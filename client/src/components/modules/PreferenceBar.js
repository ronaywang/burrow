import React, {Component} from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import "./PreferenceBar.css";

class PreferenceBar extends Component {
  static PropTypes = {
    price: PropTypes.number.isRequired,
    smoking: PropTypes.bool.isRequired,
    pets: PropTypes.bool.isRequired,
    lookingForRoom: PropTypes.bool.isRequired,
    updatePrefs: PropTypes.func.isRequired,
  };
  
  constructor(props){
    super(props);
    this.state = {
      price: this.props.price,
      smoking: this.props.smoking,
      pets: this.props.pets
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
          <div className="PreferenceBar-priceDescription">
            {lookingForRoom ? "Budget?" : "Price?"}
          </div>
          $<input type="number" min="0" onChange={(e) => {
              this.setState({price: e.target.value}, () => {
                updatePrefs(price, smoking, pets);
              })
            }} 
            className="PreferenceBar-priceInput" placeholder={lookingForRoom ? "Enter budget..." : "Enter price..."} />/month
        </div>
        <div className="PreferenceBar-pets">  
          Pet friendly? 
          <input onClick={() => {
            this.setState((prev) => {return {pets: !prev.pets};}, () => {
              updatePrefs(price, smoking, pets);
            })
          }} type="checkbox" className="PreferenceBar-checkbox"/>
        </div>
        <div className="PreferenceBar-smoking">
          Smoker friendly? 
          <input onClick={() => {this.setState((prev) => {return {smoking: !prev.smoking};}, () => {
            updatePrefs(price, smoking, pets);
          })}} type="checkbox" className="PreferenceBar-checkbox"/>
        </div>
      </div>
    ) 
  }
}
export default PreferenceBar;