import React, { Component } from "react";

import "../../utilities.css"
import { post } from "../../utilities";


class RegistrationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
      verifypassword: '',
      buttontext: 'Register',
      failed: false,
      succeeded: false,
      mustfillfields: false,
    }
  }


u_handleChange = (event) => {
  this.setState({username: event.target.value});
};

e_handleChange = (event) => {
  this.setState({email: event.target.value});
};

p_handleChange = (event) => {
  this.setState({password: event.target.value});
};

vp_handleChange = (event) => {
  this.setState({verifypassword: event.target.value});
}

handleSubmit = (event) => {
  event.preventDefault();
  if (this.state.email === '' || this.state.username === '' || this.state.password == '' || this.state.verifypassword !== this.state.password) {
    this.setState({mustfillfields: true});
    return;
  }
  console.log(this.state);
  post("/api/makeuser", this.state).then((res) => {
    this.setState({succeeded: true});
    console.log(res);
    console.log(this.state);
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
          Registration succeeded!
          <meta http-equiv = "refresh" content = "1; url = /login" />
        </div>
      );
    } else if (this.props.username && this.props.userId) {
      return (
        <div>
          You are logged in as {this.props.username}.
          <button onClick={this.props.handleLogout}>Log out</button>
        </div>
      );
    } else {
      return (
        <div>
          { this.state.mustfillfields && "You must fill all fields"}
          { this.state.failed ? "Registration failed. Username already taken": null}
          <form>
           <label>
              Email
              <input
                type="text"
                name="email"
                value={this.state.email}
                onChange={this.e_handleChange}
              />
            </label>
            <label>
              Username
              <input
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.u_handleChange}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.p_handleChange}
              />
            </label>
            <label>
              Verify password
              <input
                type="password"
                name="verifypassword"
                value={this.state.verifypassword}
                onChange={this.vp_handleChange}
              />
            </label>
            <button
              onClick={this.handleSubmit}>
              {this.state.buttontext}</button>
          </form>
          <div>
            {
              (this.state.password === this.state.verifypassword) ? (
                <div className="bkgreen">Passwords match</div>
              ) : (
                <div className="bkred">Passwords do not match</div>
              )
            }
          </div>
        </div>
      );
    }
  }

}

export default RegistrationPage;