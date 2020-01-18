import React, { Component } from "react";
import "../../utilities.css";
import "../../utilities";
import "./SingleCard.css";

class SingleCard extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render(){
    return (
      <div className="Card-container">
          <img src={require("../../public/assets/account.png")} className="Card-profilePic"/>
          <div className="Card-nameAgeGender"><span className="Card-blue">Name</span>  Age Gender</div>
          <div className="Card-locationDatePrice">
            <table>
              <tr>
                <th>location</th>
                <th>Flagstaff, AZ</th>
              </tr>
              <tr>
                <th>date</th>
                <th>Jan 2020–June 2020</th>
              </tr>
              <th>price</th>
              <th>$2020</th>
            </table>
          </div>
          <div className="Card-topRight">top right</div>
          <div className="Card-horizontalLine"></div>
          <div className="Card-flags">Flags</div>
          <div className="Card-textBox">Text Box</div>
      </div>
    );
  }
}

export default SingleCard;

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