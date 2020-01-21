import React, { Component } from "react";

import "../../utilities.css"
import { post } from "../../utilities";
import "./LoginRegistration.css";


class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      buttontext: 'Log in',
      failed: false,
      succeeded: false
    }
  }


u_handleChange = (event) => {
  this.setState({username: event.target.value});
};

p_handleChange = (event) => {
  this.setState({password: event.target.value});
};

handleSubmit = (event) => {
  event.preventDefault();
  console.log(this.state);
  post("/api/login", this.state).then((res) => {
    this.setState({succeeded: true});
    console.log(res);
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
        <div>
          You have logged in successfully.
          <meta http-equiv = "refresh" content = "1; url = /" />
        </div>
      );
    } else if (this.props.userId) {
      return (
        <div>
          <p/>You are logged in as {this.props.username}.
          <p/>
          <button onClick={this.props.handleLogout}>Log out</button>
        </div>
      );
    } else {
      return (
        <div className="u-flexColumn u-flex-alignCenter u-flex-spaceEvenly">
          <h1 className="u-textCenter">Log in</h1>
          { this.state.failed ? "Login failed": null}
          <form className="u-flexColumn u-flex-alignEnd" onSubmit={this.handleSubmit}>
            <label className="Login-input">
              <span className="fieldname">Username</span>
              <input 
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.u_handleChange}
              />
            </label>
            <label className="Login-input">
              <span className="fieldname">Password</span>
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.p_handleChange}
              />
            </label>
            <input
              className="u-button"
              type="submit"
              value={this.state.buttontext}/>
          </form>
        </div>
      );
    }
  }

}

export default LoginPage;