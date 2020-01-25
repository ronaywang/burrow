import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import "../../utilities";
import "./SingleCard.css";
import { formatDate, calculateAge, get, post } from "../../utilities";

class SingleCardFast extends Component {
  static genderColorDict = {
    'm': 'Card-blue',
    'f': 'Card-pink',
    'nb': 'Card-purple'
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      name: "",
      age: 0,
      gender: "m",
      location: "",
      startDate: new Date(),
      endDate: new Date(),
      price: 0,
      additionalText: "",
      profilePicURL: "",
      doRender: false,
      longTerm: false,
    };
  }

  async componentDidMount() {
    this.setState({
      location: this.props.listing.location,
      startDate: this.props.listing.startDate,
      endDate: this.props.listing.endDate,
      price: this.props.listing.price,
      additionalText: this.props.listing.additionalPrefText, // TODO: implement photo uploading
      name: this.props.listing.creator_ID.firstName, 
      age: calculateAge(new Date(this.props.listing.creator_ID.birthdate)),
      gender: this.props.listing.creator_ID.gender,
      profilePicURL: this.props.listing.creator_ID.profilePictureURL,
      doRender: true
    });
  }

  render() {
    const {expanded, name, age, gender, location, startDate, endDate, price,
      smoking, pets, additionalText, lookingForRoom, profilePicURL} = this.state;
    if (!this.state.doRender)
      return null;
    return (
      <div className="Card-container" key={this.props.listingId}>
        <div className="Card-top">
          <div className="Card-profilePicContainer">
            <img src={profilePicURL} className="Card-profilePic"/>
          </div>
          <div className="Card-aboutContainer">
            <div className="Card-nameAgeGender">
              <span className={SingleCardFast.genderColorDict[gender]}>{name}</span>{`, ${age}`}
            </div>
            <div className="Card-viewProfileContainer">
              <button type="submit" className="Card-viewProfile">View profile</button>
            </div>
          </div>
          <div className="Card-locationDateContainer">
            <div className="Card-date">
              {formatDate(startDate)} to {formatDate(endDate)}
            </div>
            <div className="Card-location">
              {location}
            </div>
          </div>
          <div className="Card-topRight"></div>
        </div>
        <div className="Card-bottom">
          <div className="Card-textBox">{additionalText}</div>
        </div>
        {/* {this.props.listing.creator_ID._id === "0" ? ( */}
        {/* <div className="Card-editDeleteContainer" >
          <input className="Card-editContainer" type="submit" value="Edit" />
          <input className="Card-deleteContainer bkred" type="submit" value="Delete" 
            onClick={() => {
              this.setState({doRender: false}, () => {
                post("/api/deletelisting", {_id: this.props.listing._id});
              })
            }}
          />
        </div> */}
        {/* ) : null*/}
      </div>
    );
  }
}

SingleCardFast.propTypes = {
  listing: PropTypes.object.isRequired,
};


export default SingleCardFast;

const oldreturn2 = () => {
  return (
    <div className="Card-container">
        <img src={require("../../public/assets/account.png")} className="Card-profilePic"/>
        <div className="Card-nameAgeGender"><span className={SingleCard}>Name</span>  Age Gender</div>
        <div className="Card-locationDatePrice">
          <table>
            <tr>
              <th className="ldp-left">is moving to . . .</th>
              <th className="ldp-right">Flagstaff, AZ</th>
            </tr>
            <tr>
              <th className="ldp-left">during . . .</th>
              <th className="ldp-right">Jan 1 – June 1</th>
            </tr>
            <th className="ldp-left">with a budget of . . .</th>
            <th className="ldp-right">$2020/month</th>
          </table>
        </div>
        <div className="Card-topRight">top right</div>
        <div className="Card-horizontalLine"></div>
        <div className="Card-flags">Flags</div>
        <div className="Card-textBox">Text Box</div>
    </div>
  );
}

const oldreturn = () => {
    return (
      <div className="Card-container">
        <div className="Card-top">
          <img src={require("../../public/assets/account.png")} className="Card-profilePic"/>
          <div className="Card-topMiddle">
            <span className={"Card-nameAgeGender u-textCenter"}
              >
                <span className="Card-blue">Goodman Brown, </span>
                  20
                </span>
              <div className="Card-locationDatePrice">
                <ul>
                  <li>Hello</li>
                  <li>Two</li>
                </ul>
              </div>
          </div>
          <div className="Card-topRight">
              <ul>
                <li>one</li>
                <li>two</li>
              </ul>
          </div>
        </div>
        <hr/>
        <div className="Card-bottom">
          <div className="Card-flags">

          </div>
          <div className="Card-textBox">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </div>
      </div>
    );
}