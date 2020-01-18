import React, { Component } from "react";
import {Tabs} from "../modules/Tabs.js";
import "./SplashPage.css";
import "../../utilities.css";
import SearchBar from "../modules/SearchBar.js";

class SplashTab extends Component{
  render(){
    return (
      <Tabs styleName="SplashPage">
        <div label="Room">
          {/* TODO <LocationSearchBar defaultText="Enter a city, state, etc." styleName="SplashPage" /> SplashPage-search */}
          {/* TODO <DatePicker styleName="SplashPage" /> SplashPage-date*/}
          <button className="SplashPage-go" value="Go!"/>
        </div>

        <div label="Roommate">
          {/* TODO <LocationSearchBar defaultText="Enter an address" styleName="SplashPage" /> SplashPage-search */}
          {/* TODO <DatePicker styleName="SplashPage" /> SplashPage-date*/}
          <button className="SplashPage-go" value="Go!"/>
        </div>
      </Tabs>
    )
  }
}

class SplashPage extends Component {
  render(){
    return (
      <div className="SplashPage-container">
        <div className="SplashPage-infoContainer">
          <div className="SplashPage-taglineContainer">
            <div className="SplashPage-logo">burrow</div>
            <div className="SplashPage-tagline">i'm looking for a...</div>
          </div>
          <SplashTab />
        </div>
        <SearchBar 
          defaultText="Search here..."
          styleName=""
          searchStringAutocomplete={(currSearchString) => {
            let allResults = ["apple","asian","ape","appian","ase"];
            return allResults.filter((s) => {
              let l = currSearchString.length;
              return s.length >= l && currSearchString.toLowerCase() === s.substring(0,l);
            });
          }
            }
          handleSubmit={()=>null}
          submitButtonExists={false}
        />
      </div>
    );
  }
}

export default SplashPage;