import React, { Component } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import MapTestComponent from "./pages/MapTest";
import SplashPage from "./pages/SplashPage";
import TryCard from "./modules/TryCard";
import PhotoUploadPrototype from "./pages/PhotoUploadPrototype";
import DatePicker from "./modules/DatePicker.js";
import NavBar from "./modules/NavBar.js";


/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
      username: undefined,
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ userId: user._id, username: user.username, });
        console.log("you are logged in as " + user.username);
      }
    });
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ userId: user._id });
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  handleLogout= () => {
    this.setState({ userId: undefined, username: undefined});
    post("/api/logout");
  };

  render() {
    return (
      <>
        <NavBar />
        <Router>
          <LoginPage path="/login" userId={this.state.userId} username={this.state.username} handleLogout={this.handleLogout}/>
          <RegistrationPage path="/register" username={this.state.username} userId={this.state.userId} handleLogout={this.handleLogout}/>
          <Skeleton
            path="/"
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            userId={this.state.userId}
          />
          <MapTestComponent
            path="/map"/>
          <NotFound default />
          <SplashPage path="/splash" />
          <TryCard path="/cardsample"/>
          <PhotoUploadPrototype path="/photouploadprototype"/>
          <DatePicker path="/datepicker"/>
        </Router>
      </>
    );
  }
}

export default App;
