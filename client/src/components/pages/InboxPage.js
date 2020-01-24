import React, {Component} from "react";
import PropTypes from "prop-types";
import "../../utilities";
import "../../utilities.css";
import "./InboxPage.css";

class InboxPage extends Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    return (
    <div className="InboxPage-container">
      <div className="Messages-container">
        <input className="MessageSearch"
          type="text"
          placeholder="Search messages..."
          />

      </div>

      <div className="Chat-container">

        <input className="ChatBox"
        placeholder="Type here"
        />
      </div>
    </div>
    );
  }
}

InboxPage.propTypes = {

};

export default InboxPage;