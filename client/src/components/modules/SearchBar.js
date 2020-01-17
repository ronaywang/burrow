import React, {Component} from "react";
import PropTypes from "prop-types";
import "../../utilities.css";

class SearchBar extends Component {
  static PropTypes = {
    defaultText: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      currSearchText: ""
    };
  }

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
  }

  render(){
    const {
      props: {
        defaultText
      },
      handleChange, handleSubmit,
      state: {
        value,
      }
    } = this;

    return (
      <div>
        <input
          type="text"
          placeholder={defaultText}
          onChange={handleChange}
          value={value}
        />
        <button
          type="submit"
          value="Submit"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div> 
    );
  }
}

export default SearchBar;