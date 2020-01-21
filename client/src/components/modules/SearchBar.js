import React, {Component} from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import "./SearchBar.css";
import { get, g_places_api_url } from "../../utilities";
import Script from "react-load-script";

/* class SearchBar extends Component {


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

SearchBar.propTypes = {
  defaultText: PropTypes.string.isRequired,
  styleName: PropTypes.string.isRequired,
  searchStringAutocomplete: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitButtonExists: PropTypes.bool.isRequired,
};   */

class GoogleSearchBar extends Component {

  // Define Constructor
  constructor(props) {
    super(props);

    // Declare State
    this.state = {
      place: '',
      query: this.props.text || ''
    };
  }

  handleScriptLoad = () => {
    // Declare Options For Autocomplete
    const options = {
      types: [(this.props.placeIsCity ? '(cities)' : 'address')],
    };

    // Initialize Google Autocomplete
    /*global google*/ // To disable any eslint 'google not defined' errors
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById(this.props.searchBarId),
      options,
    );

    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components and formatted
    // address.
    this.autocomplete.setFields(['address_components', 'formatted_address', 'geometry']);

    // Fire Event when a suggested name is selected
    this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
  }
  
  handlePlaceSelect = () => {

    // Extract City From Address Object
    const addressObject = this.autocomplete.getPlace();
    const address = addressObject.address_components;

    // Check if address is valid
    if (address) {
      // Set State
      this.setState(
        {
          place: address[0].long_name,
          query: addressObject.formatted_address,
          center: {
            lat: addressObject.geometry.location.lat(),
            lng: addressObject.geometry.location.lng()
          },
        }
      , () => {
        this.props.setSelectedCenter(this.state.center);
        this.props.updateQuery(this.state.query);
      });
    }
  }

  render() {
    return (
      <div>
        <Script
          url={g_places_api_url}
          onLoad={this.handleScriptLoad}
        />
        <input id={this.props.searchBarId}
          placeholder={this.props.placeIsCity ? "Enter city..." : "Enter address..."} 
          onChange={(e) => {
            this.setState({query: e.target.value})
          }}
          value={this.state.query}
          className={`${this.props.styleName}-search`}
        />
      </div>
    );
  }
}
GoogleSearchBar.propTypes = {
  styleName: PropTypes.string.isRequired,
  placeIsCity: PropTypes.bool.isRequired,
  searchBarId: PropTypes.string.isRequired,
  setSelectedCenter: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  updateQuery: PropTypes.func.isRequired
};

export { GoogleSearchBar };