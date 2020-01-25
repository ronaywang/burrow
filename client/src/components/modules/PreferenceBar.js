import React, {Component} from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import { get, post } from "../../utilities";
import "./PreferenceBar.css";
import DatePicker from "./DatePicker";
import Toggle from 'react-toggle';
const momentPropTypes = require("react-moment-proptypes");

const houseIcon = (
  <img src="/house_icon.svg" width="13px"/>
);
const roommateIcon = (
  <img src="/roommate_icon.svg" width="13px"/>
);

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
  
  update = (price, smoking, pets, startDate, endDate, lookingForRoom) => {
    this.setState({
      price, smoking, pets, startDate, endDate, lookingForRoom
    }, () => {
      post("/api/sessionglobals", {
        price, smoking, pets, startDate, endDate, lookingForRoom
      })
    })
  }

  render(){
    if (!this.state.doDisplay)
      return null;
    const {
      state: {
        lookingForRoom, price, smoking, pets, startDate, endDate
      }
    } = this;
    return (
      <div className="PreferenceBar-container">
        <div className="PreferenceBar-toggleContainer">
          <Toggle
            id="lookingForRoom" 
            className="PreferenceBar-toggleSwitch" defaultChecked={lookingForRoom} 
            onChange={() => this.update(price, smoking, pets, startDate, endDate, !lookingForRoom)}
            icons={{checked: houseIcon, unchecked: roommateIcon}}
          />
        </div>
        <div className="PreferenceBar-price">
          {lookingForRoom ? "Budget: " : "Price: "}
          <span className="PreferenceBar-dollarsign">$</span>
          <input type="number" min="0" value={price} onChange={(e) => {
              this.update(parseInt(e.target.value), smoking, pets, startDate, endDate, lookingForRoom)
            }} 
            className="PreferenceBar-priceInput" placeholder={lookingForRoom ? "Enter budget ..." : "Enter price ..."} 
          />/month
        </div>
        <div className="PreferenceBar-dateContainer">
          <DatePicker startDate={startDate} endDate={endDate} handleDateChange={async (newstartDate, newendDate) => {
              await this.update(price, smoking, pets, newstartDate, newendDate, lookingForRoom); 
              this.props.triggerSearch();
            }
          } />
        </div>
        <div className="PreferenceBar-pets">  
          Pet friendly? 
          <input onClick={async () => {
              await this.update(price, smoking, !pets, startDate, endDate, lookingForRoom);
              this.props.triggerSearch();
          }} type="checkbox" className="PreferenceBar-checkbox" checked={pets}/>
        </div>
        <div className="PreferenceBar-smoking">
          Smoker friendly? 
          <input onClick={async () => {
            await this.update(price, !smoking, pets, startDate, endDate, lookingForRoom);
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