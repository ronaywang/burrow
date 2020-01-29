import React, { Component } from "react";

import "../../utilities.css"
import { post } from "../../utilities";
import "./LoginRegistration.css";


class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      failed: false,
      succeeded: false,
      buttontext: "login"
    }
  }


e_handleChange = (event) => {
  this.setState({email: event.target.value});
};

p_handleChange = (event) => {
  this.setState({password: event.target.value});
};

handleSubmit = (event) => {
  event.preventDefault();
  console.log(this.state);
  post("/api/login", this.state).then((res) => {
    this.setState({succeeded: true});
    setTimeout(() => {
      window.location.pathname="/profile/" + res._id;
    }, 1000);
  }).catch((err) => {
    this.setState({failed: true});
    console.log(err);
  });
};

  componentDidMount() {
    if (this.props.buttonText) {
      this.setState({buttontext: this.props.buttonText});
    }
  }

  render() {
    if (this.state.succeeded) {
      return (
        <div className="Login-succeed">
          Welcome back!
          <meta http-equiv = "refresh" content = "1; url = /" />
        </div>
      );
    } else if (this.props.userId) {
      return (
        <div>
          {/*<p/>You are logged in as {this.props.username}. to change later*/}
          <p/>
          <button onClick={this.props.handleLogout}>Log out</button>
        </div>
      );
    } else {
      return (
        <div className="LoginContainer">
          <h1 className="u-textCenter" title="get connected">Get connected.</h1>
          { this.state.failed ? "Login failed": null}
          <form className="LoginForm" onSubmit={this.handleSubmit}>
            <label className="Login-input">
              <span className="fieldname" title="Email">Email</span>
              <input className = "inputTextField"
                type="text"
                name="email"
                title="Email"
                value={this.state.email}
                onChange={this.e_handleChange}
              />
            </label>
            <label className="Login-input">
              <span className="fieldname" title="Password">Password</span>
              <input className = "inputTextField" title="Password"
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.p_handleChange}
              />
            </label>
            <button
              type="submit"  onClick={this.handleSubmit} title="Login">
                {this.state.buttontext}</button>
          </form>
        </div>
      );
    }
  }
git 
}

export default LoginPage;