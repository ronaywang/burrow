import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import "../../utilities";
import "./SingleCard.css";
import { formatDate, calculateAge, get, post } from "../../utilities";
//import { duration } from "../../../../node_modules/moment";
import { Link } from "@reach/router";


class SingleCardFast extends Component {
  /*static genderColorDict = {
    'm': 'Card-blue',
    'f': 'Card-pink',
    'nb': 'Card-purple'
  };*/

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      name: "",
      age: 0,
      /*gender: "m",*/
      location: "",
      startDate: new Date(),
      endDate: new Date(),
      price: 0,
      additionalText: "",
      profilePicURL: "",
      doRender: false,
      durationIndex: 0,
    };
  }

  async componentDidMount() {
    this.setState({
      location: this.props.listing.location,
      startDate: this.props.listing.startDate,
      price: this.props.listing.price,
      additionalText: this.props.listing.additionalPrefText, // TODO: implement photo uploading
      name: this.props.listing.creator_ID.firstName, 
      age: calculateAge(new Date(this.props.listing.creator_ID.birthdate)),
      /*gender: this.props.listing.creator_ID.gender,*/
      profilePicURL: this.props.listing.creator_ID.profilePictureURL,
      durationIndex: this.props.listing.durationIndex,
      doRender: true
    });
  }

  render() {
    const {expanded, name, age, /*gender,*/ location, startDate, endDate, price,
      smoking, pets, additionalText, lookingForRoom, profilePicURL} = this.state;
    if (!this.state.doRender)
      return null;

    let durationOptions = ["for 1-3 months", "for 3-6 months", "for 6-12 months", "for over a year"]
    return (
      <div className="Card-container" key={this.props.listingId}>
        <div className="Card-top">
          <div className="Card-profilePicContainer">
            <img src={this.state.profilePicURL || "/account.png"} className="Card-profilePic"/>
          </div>
          <div className="Card-topMiddle">
            <div className="Card-nameAgeGender">
              <span /*className={SingleCardFast.genderColorDict[gender]}*/>{name}</span>{`, ${age}`}
            </div>
            <div className="Card-date">{formatDate(startDate)}</div>
            <div className="Card-duration">{durationOptions[this.state.durationIndex]}</div>
            <div className="Card-location">
              {location}
            </div>
              
            <div className="Card-inbox">
              <Link to={"/inbox/"+this.props.listing.creator_ID._id}><img src = "/envelope.svg" width = "20px"></img></Link>
            </div>
            <div className="Card-expand" onClick={() => this.setState((prev) => ({expanded: !prev.expanded}))}>
              {expanded ? "collapse" : "expand"}
            </div>
          </div>
        </div>
        {expanded ? <div className="Card-bottom">
          {additionalText}
        </div> : null}
        {this.props.editDeletePerms ? ( 
          <div className="Card-editDeleteContainer" >
            <input className="Card-editContainer" type="submit" value="Edit" />
            <input className="Card-deleteContainer bkred" type="submit" value="Delete" 
              onClick={() => {
                this.setState({doRender: false}, () => {
                  post("/api/deletelisting", {_id: this.props.listing._id});
                })
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

SingleCardFast.propTypes = {
  listing: PropTypes.object.isRequired,
};


export default SingleCardFast;