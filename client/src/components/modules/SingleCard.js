import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import "../../utilities";
import "./SingleCard.css";
import { formatDate, calculateAge, get } from "../../utilities";

class SingleCard extends Component {
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
      lookingForRoom: false,
      location: "",
      startDate: new Date(),
      endDate: new Date(),
      price: 0,
      smoking: false,
      pets: false,
      additionalText: "",
      profilePicURL: ""
    };
  }

  componentDidMount() {
    get("/api/listing", {listingId: this.props.listingId})
      .then((info) => {
        this.setState({
          location: info.location_ID,
          startDate: info.startDate,
          endDate: info.endDate,
          price: info.price,
          smoking: info.smokerFriendly,
          pets: info.petFriendly,
          lookingForRoom: info.lookingForRoom,
          additionalText: info.additionalPrefText // TODO: implement photo uploading
        })
        return info.creator_ID;
      }).then((userId) => {
        return get("/api/user", {userId: userId});
      }).then((user) => {
        this.setState({
          name: user.firstName + " " + user.lastName, // TODO: firstName and lastName instead.
          age: calculateAge(new Date(user.birthdate)),
          gender: user.gender,
          profilePicURL: user.profilePictureURL,
        });
      });
  }

  render(){
    const {expanded, name, age, gender, location, startDate, endDate, price,
      smoking, pets, additionalText, lookingForRoom, profilePicURL} = this.state;
    return (
      <div className="Card-container" key={this.props.listingId}>
          <img src={profilePicURL} className="Card-profilePic"/>
          <div className="Card-nameAgeGender">
            <span className={SingleCard.genderColorDict[gender]}>{name}</span>{`, ${age}`}
          </div>
          <div className="Card-locationDatePrice">
            <table>
              <tr>
                <th className="ldp-left">{lookingForRoom ? "is moving to . . ." : "is located in . . ."}</th>
                <th className="ldp-right">{location}</th>
              </tr>
              <tr>
                <th className="ldp-left">during . . .</th>
                <th className="ldp-right">{formatDate(startDate)} – {formatDate(endDate)}</th>
              </tr>
              <th className="ldp-left">with a budget of . . .</th>
              <th className="ldp-right">${price}/month</th>
            </table>
          </div>
          <div className="Card-topRight">top right</div>
          <div className="Card-horizontalLine"></div>
          <div className="Card-flags">
            <span className="Card-flag">{smoking ? "" : "NOT "}smoker-friendly </span>
            <span className="Card-flag">{pets ? "" : "NOT "}pet-friendly </span>
          </div>
          <div className="Card-textBox">{additionalText}</div>
      </div>
    );
  }
}

SingleCard.propTypes = {
  listingId: PropTypes.string.isRequired,
};


export default SingleCard;

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