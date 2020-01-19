import React, {Component} from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import { get } from "../../utilities";

class SearchBar extends Component {
  static PropTypes = {
    defaultText: PropTypes.string.isRequired,
    styleName: PropTypes.string.isRequired,
    searchStringAutocomplete: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitButtonExists: PropTypes.bool.isRequired,
  };  

  constructor(props) {
    super(props);
    this.state = {
      currSearchString: "",
      suggestionsList: [],
      showSuggestionsList: true,
      suggestionPos: -1 // -1 means the submit button is greyed out!
    };
  }

  mod = (n, m) => ((n % m) + m) % m; // TODO (not important for now): move this to somewhere else.

  handleKeyPress = (event) => {
    const {
      state: {
        suggestionsList, suggestionPos, showSuggestionsList
      },
      props: {
        submitButtonExists, handleSubmit, searchStringAutocomplete
      },
      mod
    } = this;
    if (suggestionsList.length > 0){
      if (event.key === 'Enter'
          && submitButtonExists){
        event.preventDefault();
        this.setState({
          currSearchString: suggestionsList[suggestionPos],
          showSuggestionsList: false,
        });
        handleSubmit(suggestionsList[suggestionPos]);
      }
      else if (event.key === 'ArrowUp'){
        event.preventDefault();
        this.setState({
          suggestionPos: mod(suggestionPos - 1, suggestionsList.length)
        });
      } 
      else if (event.key === 'ArrowDown'){
        event.preventDefault();
        this.setState({
          suggestionPos: mod(suggestionPos + 1, suggestionsList.length)
        });
      }  
      else if (event.key === 'ArrowRight' || event.key === 'Tab'){
        event.preventDefault();
        let currSearchString = suggestionsList[suggestionPos];
        this.setState({
          currSearchString: currSearchString,
          suggestionsList: searchStringAutocomplete(currSearchString)
        });
      }
    }
  }

  handleChange = (event) => {
    const {searchStringAutocomplete} = this.props;
    let currSearchString = event.target.value;
    searchStringAutocomplete(currSearchString).then((suggestions) => {
      suggestions = currSearchString.length > 0 ? suggestions : [];
      this.setState({
        currSearchString: currSearchString,
        suggestionsList: suggestions,
        suggestionPos: suggestions.length > 0 ? 0 : -1,
        showSuggestionsList: true
      });
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    return this.props.handleSubmit(this.state.currSearchString);
  }

  handleClick = (event) => {
    // if (this.node.contains(event.target)){

    // }
    // else {
    //   this.setState({showSuggestionsList: false});
    // }
  }

  componentDidMount(){
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount(){
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  render(){
    const {
      props: {
        defaultText, styleName, submitButtonExists
      },
      handleChange, handleSubmit, handleKeyPress,
      state: {
        currSearchString, suggestionsList, suggestionPos, showSuggestionsList
      }
    } = this;
    return (
      <div className={`${styleName}-searchBarContainer`} onKeyDown={handleKeyPress}>
        <div className={`${styleName}-searchBar`}>
          <input
            type="text"
            className={`${styleName}-searchInput`}
            placeholder={defaultText}
            onChange={handleChange}
            value={currSearchString}
          />
          {showSuggestionsList ? <div 
            className={`${styleName}-suggestionsContainer`}
            ref={node => this.node = node}
          >
            {
              suggestionsList.map((suggestion, index) => {
                let activeClass = (index === suggestionPos) ? 
                    ` ${styleName}-activeSuggestion`: "";
                return (
                  <div className={`${styleName}-suggestion` + activeClass}>{suggestion}</div>
                );
              })
            }
          </div> : ""}
        </div>
        {submitButtonExists ? <button
          className={`${styleName}-submit`}
          type="submit"
          value="Submit"
          onClick={handleSubmit}
        /> : ""}
      </div> 
    );
  }
}

class LocationSearchBar extends Component{
  static PropTypes = {
    defaultText: PropTypes.string.isRequired,
    styleName: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitButtonExists: PropTypes.bool.isRequired,
    radius: PropTypes.number.isRequired
  };  

  render(){
    return (<SearchBar 
      defaultText={this.props.defaultText}
      styleName={this.props.styleName}
      searchStringAutocomplete={(searchString) => {
        return get("/api/locationsuggestions", {
          input: searchString,
          radius: this.props.radius
        }).then((json) => {
          return json.predictions.map(prediction => prediction.description);
        })
      }}
      handleSubmit={this.props.handleSubmit}
      submitButtonExists={this.props.submitButtonExists}
    />);
  }
}


export { LocationSearchBar };