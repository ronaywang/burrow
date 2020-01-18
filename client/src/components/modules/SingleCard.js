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
      <div className="card">
        <div className="card-top">
          <img src={require("../../public/assets/account.png")} className="card-profilepic"/>
          <div className="card-topmiddle">
            <span className={"card-name card-blue u-textCenter"}
              >Goodman Brown</span>
              <div className="card-basicinfo">
                <ul>
                  <li>Hello</li>
                  <li>Two</li>
                </ul>
              </div>
          </div>
          <div className="card-topright">
            <div className="card-toprightmenu">
              <ul>
                <li>one</li>
                <li>two</li>
              </ul>
            </div>
          </div>
        </div>
        <hr/>
        <div className="card-bottom">
          <div className="card-introtextbox">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </div>
      </div>
    );
  }
}

export default SingleCard;