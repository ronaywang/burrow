import React, { Component } from "react";

import "../../utilities.css"
import "./LoginForm.css"
import { post } from "../../utilities";


class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      buttontext: 'log in'
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
  post("/api/passlogin", this.state).then(() => {
    console.log("hi");
  });
};

  componentDidMount() {
    if (this.props.buttonText) {
      this.setState({buttontext: this.props.buttonText});
    }
  }

  render() {
    return (
      <div>
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

export default LoginForm;