import "./NewListing.css";
import "../../utilities.css"
import { get, post } from "../../utilities";
import React, {Component} from "react";
import PropTypes from "prop-types";
import {GoogleSearchBar} from "./SearchBar.js";
import MapComponent from "./Map";
import {navigate} from '@reach/router';

class NewListing extends Component {

  constructor(props){
    super(props);
    this.state = {
      locationquery: '',
      locationcenter: '',
      startDate: new Date().toISOString().split("T")[0],
      durationIndex: -1,
      price: 0,
      textBox: "",
      success: false,
      doRender: false,
    };
  }

  componentDidMount() {
    if (this.props.currentId !== "") {
      setTimeout(() => this.setState({doRender: true}), 250);
      get("/api/listing", {listingId: this.props.currentId})
        .then((info) => {
          this.setState({
            locationquery: info.location,
            locationcenter: info.coordinates,
            startDate: info.startDate,
            durationIndex: info.durationIndex,
            price: info.price,
            textBox: info.additionalPrefText,
          })
        })
    }
    else {
      this.setState({doRender: true});
    }
  }
  handleSubmit(){
    if (this.state.durationIndex === -1 || this.state.locationquery === '' || this.state.startDate === undefined ||
        this.state.price === 0 || this.state.price === "" || this.state.textBox.trim().length === 0){
      this.setState({mustfillfields: true});
      return;
    }
    const listingInfo = { 
        coordinates: this.state.locationcenter,
        location: this.state.locationquery,
        price: this.state.price,
        startDate: this.state.startDate,
        durationIndex: this.state.durationIndex,
        additionalPrefText: this.state.textBox,
        currentId: this.props.currentId
    };
    post("/api/listing", listingInfo)
      .then(this.setState({success: true}, () => {
        setTimeout(() => {
          this.props.close();
          if (this.props.userId !== ""){ 
            navigate(`/profile/${this.props.userId}`, {replace: False});
          }
        }, 750);
      })
    );
  }

  render(){
    if (!this.state.doRender)
      return (<div className="NewListing-container">Loading listing info&hellip;</div>);
    let durationOptions = ["1-3 months", "3-6 months", "6-12 months", "more than 1 year"];
    const today = new Date();
    if (this.state.success){
      return (<div className="NewListing-submitted">Listing submitted successfully!</div>);
    }
    return (
      <div className="NewListing-container">
        { this.state.mustfillfields && (
          <span className="warning">You must fill all fields!</span>
          )}
        <h1 className="u-textCenter">{this.props.userId === "" ? "Edit your listing." : "Create a new listing."}</h1>
        <div className="NewListing-inputForm">
          <div className="inputinline">
            <label className = "Reg-input">
            <span className="fieldname">I'm looking for a room near&hellip;</span>
                <GoogleSearchBar styleName="NewListing" //emailClassName
                  placeIsCity={true}
                  searchBarId="newListingSearch"
                  text={this.state.locationquery}
                  updateQuery={(newquery, newcenter)=>{this.setState({locationcenter: newcenter, locationquery: newquery});}}
                />
            </label>
          </div>
          <div className="inputinline">
            <label className = "Reg-input">
              <span className="fieldname">My move-in date is approximately&hellip;</span>
              <input className = "NewListing-moveInDate"
              id="moveindatepicker"
              type="date"
              placeholder = "move-in date"
              name="startdate" 
              value={this.state.startDate.split("T")[0]}
              min={today.toISOString().split("T")[0]}
              onFocus={()=>{document.getElementById("moveindatepicker").placeholder = ""; document.getElementById("moveindatepicker").classList.remove("NewListing-dateinvisible");}}
              onChange={(e) => {this.setState({startDate: e.target.value})}}
              />
            </label>
          </div>
          <div className="inputinline">
            <label className="Reg-input">
              <span className="fieldname">My budget is approximately&hellip;</span>
              <span className="NewListing-price" id="prefbarprice">
                $&nbsp;<input
                  id="prefbarpriceinput"
                  type="number"
                  min="0"
                  max="9999"
                  onChange={(e) => {this.setState({price: e.target.value})}} 
                  className="NewListing-priceInput"
                  onFocus={()=>document.getElementById("prefbarprice").classList.add("NewListing-pricefocus")}
                  onBlur={()=>document.getElementById("prefbarprice").classList.remove("NewListing-pricefocus")}
                  value={this.state.price}
              />/month
              </span>
            </label>
          </div>
          <div className="inputinline">
            <div className="Reg-input">
              <span className="fieldname">I'll be staying for&hellip;</span>
              <div className="NewListing-duration">
                {durationOptions.map((desc, i) => (
                  <button
                  className={this.state.durationIndex !== i ? "durationButton" : "durationButton durationSelect"}
                  onClick={()=>{this.setState({durationIndex: i})}}
                  >{desc}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="inputinline">
            <label className="Reg-input">
              <span className="fieldname">More about me:</span>
              <textarea  
                onChange={(e) => {this.setState({textBox: e.target.value})}} 
                placeholder="Use this space to tell potential roommates about who you are and who you're looking for!" 
                className="NewListing-textBox" 
                value={this.state.textBox}
              />
            </label>
          </div>
          <div className="NewListing-buttons">
            <button
              className="NewListing-submit"
              onClick={(e) => {
                e.preventDefault();
                this.handleSubmit();
              }}
            >submit</button>
            {this.props.currentId ?
            <button
              className="NewListing-submit"
              onClick={() => {
                post("/api/deletelisting", {_id: this.props.currentId})
                  .then(() => {this.props.delete(); this.props.close()});
              }}
            >delete listing</button> : null}
          </div>
        </div>
      </div>
      // BEGIN BULLSHIT
    //   <div className="NewListing-supercontainer">
    //     <div className="NewListing-container">
    //       { this.state.mustfillfields && (
    //         <span className="warning">You must fill all fields!</span>
    //         )}
    //       <div className="NewListing-center">
    //         <h1>Create a new listing.</h1>
    //         <div className="NewListing-locationContainer">
    //           <div className="NewListing-description">
    //             I'm looking for a room near . . .
    //           </div>
    //           <GoogleSearchBar styleName="NewListing"
    //             placeIsCity={true}
    //             searchBarId="newListingSearch"
    //             updateQuery={(newquery, newcenter)=>{this.setState({locationcenter: newcenter, locationquery: newquery});}}
    //           />
    //         </div>
    //       <div className="NewListing-dateContainer">
    //           <div className="NewListing-description">
    //             My move-in date is approximately . . .
    //           </div>
    //       <input className = "NewListing-moveInDate NewListing-dateinvisible"
    //         id="moveindatepicker"
    //         type="date"
    //         placeholder = "move-in date"
    //         name="startdate" 
    //         value={this.state.startDate.split("T")[0]}
    //         min={today.toISOString().split("T")[0]}
    //         onFocus={()=>{document.getElementById("moveindatepicker").placeholder = ""; document.getElementById("moveindatepicker").classList.remove("PreferenceBar-dateinvisible");}}
    //         onChange={(e) => {this.setState({startDate: e.target.value})}}
    //       />
    //     </div>
            
    //         <div className="NewListing-priceContainer">
    //           <div className="NewListing-description">
    //             My budget is approximately . . .
    //           </div>
    //         <span className="NewListing-price" id="prefbarprice">
    //       $&nbsp;<input
    //         id="prefbarpriceinput"
    //         type="number"
    //         min="0"
    //         step="100"
    //         onChange={(e) => {this.setState({price: e.target.value})}} 
    //         className="NewListing-priceInput"
    //         placeholder="budget" 
    //         onFocus={()=>document.getElementById("prefbarprice").classList.add("NewListing-pricefocus")}
    //         onBlur={()=>document.getElementById("prefbarprice").classList.remove("NewListing-pricefocus")}
    //         value={this.state.price}
    //     />/month
    //     </span>
    //     <div className="NewListing-durationContainer">
    //           <div className="NewListing-description">
    //             I'll be staying for . . .
    //           </div>
    //           <div className="NewListing-duration">
    //             {durationOptions.map((desc, i) => (
    //               <button
    //               className={this.state.durationIndex !== i ? "durationButton" : "durationButton durationSelect"}
    //               onClick={()=>{this.setState({durationIndex: i})}}
    //               >{desc}</button>
    //             ))}
    //           </div>
    //         </div>

    //         <div className="NewListing-textBoxContainer">
    //           <div className="NewListing-description">More about me . . .</div>
    //           <textarea  
    //             onChange={(e) => {this.setState({textBox: e.target.value})}} 
    //             placeholder="Use this space to tell potential roommates about who you are and who you're looking for!" 
    //             className="NewListing-textBox" 
    //             value={this.state.textBox}
    //           />
    //         </div>
    //         <button
    //           className="NewListing-submit"
    //           onClick={(e) => {
    //             e.preventDefault();
    //             this.handleSubmit();
    //           }}
    //         >submit</button>
    //         {this.props.currentId ?
    //         <button
    //           className="NewListing-submit"
    //           onClick={() => {
    //             post("/api/deletelisting", {_id: this.props.currentId})
    //               .then(() => {this.props.delete(); this.props.close()});
    //           }}
    //         >delete listing</button> : null}
    //       </div>
    //     </div>
    //   </div>
    // </div>
    );
  }
}


NewListing.propTypes = {
  addNewListing: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
};

export default NewListing;