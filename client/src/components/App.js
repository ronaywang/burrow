import React, { Component } from "react";
import { Router, Redirect } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import MapComponent from "./modules/Map";
import SplashPage from "./pages/SplashPage";
import TryCard from "./modules/TryCard";
//import PhotoUploadPrototype from "./pages/PhotoUploadPrototype";
//import NavBar from "./modules/NavBar";
import ProfilePicUploader from "./modules/ProfilePicUploader";

import DatePicker from "./modules/DatePicker.js";
import NavBar from "./modules/NavBar.js";
import NewListing from "./modules/NewListing.js";
import MainPage from "./pages/MainPage.js";
import ProfilePage from "./pages/ProfilePage";
import InboxPage from "./pages/MainPage.js";
import * as moment from "moment";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      username: "",
      searchPrefs: { 
        location: "",
        lookingForRoom: true,
        price: 0,
        startDate: new Date(),
        endDate: new Date(),
        smoking: true,
        pets: true,
      },
      mapCenter: {
        lat: 0,
        lng: 0
      },
      listingsToDisplay: []
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        console.log("you are logged in as " + user.username);
        this.setState({ userId: user._id, username: user.username, });
      }
    }).then(() => this.generateListings());
  }

  generateListings = () => {
    console.log(this.state.userId);
    let query = {
      userId: this.state.userId, 
      location: this.state.searchPrefs.location,
      lookingForRoom: this.state.searchPrefs.lookingForRoom,
      price: this.state.searchPrefs.price,
      smoking: this.state.searchPrefs.smoking,
      pets: this.state.searchPrefs.pets,
      startDate: this.state.searchPrefs.startDate,
      endDate: this.state.searchPrefs.endDate,
    };
    console.log(query);
    get("/api/matchinglistings", query).then((listings) => {
      this.setState({listingsToDisplay: listings});
    });
  }

  updateSearchPrefs = (price, smoking, pets, startDate, endDate) => {
    this.setState({searchPrefs: {
      price: price, smoking: smoking, pets: pets, startDate: startDate, endDate: endDate 
    }});
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ userId: user._id });
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  handleLogout = () => {
    post("/api/logout").then(() => {
      window.location.pathname="/";
      this.setState({ userId: "", username: ""});
    })
  };

  setSelectedCenter = (center) => {
    this.setState({ mapCenter: center });
  };

  render() {
    console.log("hi");
    return (
      <>
        <NavBar location={this.state.searchPrefs.location} username={this.state.username} userId={this.state.userId} handleLogout={this.handleLogout} setSelectedCenter={this.setSelectedCenter}/>
        <Router>
          <LoginPage path="/login" userId={this.state.userId} username={this.state.username} handleLogout={this.handleLogout}/>
          <RegistrationPage path="/register" username={this.state.username} userId={this.state.userId} handleLogout={this.handleLogout}/>
          <Skeleton
            path="/skeleton"
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            userId={this.state.userId}
          />
          <MapComponent
            path="/map"
            initialCenter={{lat: 42.360495, lng: -71.093779 }}
            newCenter = {this.state.mapCenter}
            initialZoom={14}
            />
          <NotFound default />
          <SplashPage path="/" passDateLocationToGlobal={(startDate, endDate, location, lookingForRoom) =>
            this.setState({
              searchPrefs: {
                startDate: startDate,
                endDate: endDate,
                location: location,
                lookingForRoom: lookingForRoom,
                price: lookingForRoom ? 99999 : 0,
                pets: true,
                smoking: true,
              }
            })
          }
          setSelectedCenter={this.setSelectedCenter}          
          />
          <TryCard path="/cardsample"/>
          <ProfilePicUploader path="/profilepicuploader"/>
          <DatePicker path="/datepicker/" handleDateChange={(s,d) => null} />
          <NewListing path="/newlistingprototype/" userId={this.state.userId} addNewListing={(listingInfo) => null} lookingForRoom={true}/>
          <MainPage path="/main" userId={this.state.userId}
          searchPrefs={this.state.searchPrefs}
          updatePrefs={this.updateSearchPrefs}
          listingsToDisplay={this.state.listingsToDisplay}
          />
          <ProfilePage path={`/profile/${this.state.userId}`}
          userId={this.state.userId}
          />
          <InboxPage path="/inbox" />
        </Router>
      </>
    );
  }
}

export default App;
