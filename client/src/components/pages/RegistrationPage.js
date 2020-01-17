import React, { Component } from "react";

import "../../utilities.css"
import { post } from "../../utilities";


class RegistrationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      buttontext: 'Register',
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
  post("/api/makeuser", this.state).then((res) => {
    this.setState({succeeded: true});
    console.log(res);
    post("/api/login", this.state).then((res) => {
      console.log("logged in.");
    });
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
        </div>
      );
    } else if (this.props.userId) {
      return (
        <div>
          You are logged in as {this.props.userId}.
        </div>
      );
    } else {
      return (
        <div>
          { this.state.failed ? "Registration failed. Username already taken": null}
          <form onSubmit={this.handleSubmit}>
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
                type="text"
                name="password"
                value={this.state.password}
                onChange={this.p_handleChange}
              />
            </label>
            <input
              type="submit"
              value={this.state.buttontext}/>
          </form>
        </div>
      );
    }
  }

}

export default RegistrationPage;