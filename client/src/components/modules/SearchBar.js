import React, {Component} from "react";
import PropTypes from "prop-types";
import "../../utilities.css";

class SearchBar extends Component {
  static PropTypes = {
    defaultText: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    styleName: PropTypes.string.isRequired,
    submitButtonExists: PropTypes.bool.isRequired,
    submitButtonStyleName: PropTypes.string.isRequired
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
        defaultText, styleName, submitButtonExists
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
          className={`${styleName}`}
          placeholder={defaultText}
          onChange={handleChange}
          value={value}
        />
        {submitButtonExists ? <button
          type="submit"
          value="Submit"
          onClick={handleSubmit}
        /> : ""}
      </div> 
    );
  }
}

export default SearchBar;