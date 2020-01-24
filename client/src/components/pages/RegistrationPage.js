import React, { Component } from "react";

import "../../utilities.css"
import { post } from "../../utilities";


class RegistrationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      /*birthdate: undefined,
      gender: '',*/
      password: '',
      verifypassword: '',
      
      buttontext: 'Register',
      failed: false,
      succeeded: false,
      mustfillfields: false,
    }
  }

e_handleChange = (event) => {
  this.setState({email: event.target.value});
};

p_handleChange = (event) => {
  this.setState({password: event.target.value});
};

vp_handleChange = (event) => {
  this.setState({verifypassword: event.target.value});
}
fn_handleChange = (event ) => {
  this.setState({firstName: event.target.value});
}

ln_handleChange = (event ) => {
  this.setState({lastName: event.target.value});
}


handleSubmit = (event) => {
  event.preventDefault();
  if (this.state.email === '' || this.state.firstName === '' || this.state.lastName === '' || this.state.password == '' || this.state.verifypassword !== this.state.password) {
    this.setState({mustfillfields: true});
    return;
  }
  post("/api/makeuser", this.state).then((res) => {
    return post("/api/login", this.state);
  }).then((res) => {
    this.setState({succeeded: true}, () => {
      setTimeout(() => window.location.pathname="/profile/" + res._id, 1000);
    });
  }).catch((err) => {
    this.setState({failed: true});
    console.log("error");
    console.log(err);
  });
  
  // then(() => {
  //   return post("/api/login", this.state);
  // }).then((res) => {
  //   this.setState({succeeded: true});
  //   console.log("user has registered and loggged in");
  //   console.log(res);
  //   window.location.pathname="/profile";
  // })
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
    } else if (this.props.email && this.props.userId) {
      return (
        <div>
          {/*You are logged in as {this.props.username}.*/}
          <button onClick={this.props.handleLogout}>Log out</button>
        </div>
      );
    } else {
      return (
        <div className="u-flexColumn u-flex-alignCenter u-flex-spaceEvenly">
          { this.state.mustfillfields && (
            <span className="warning">You must fill all fields!</span>
            )}
          { this.state.failed ? "Registration failed. Email already taken": null}
          <h1 className="u-textCenter">Registration</h1>
          <form className="u-flexColumn u-flex-alignEnd">
           <label className = "Reg-input">
           {/*<i class="mail-icon"></i> icon stuff, will edit after Milestone 2*/}
           <span className="fieldname">Email</span>
              <input className = "inputTextField"
                type="text"
                name="email"
                value={this.state.email}
                onChange={this.e_handleChange}
              />
            </label>
            <label className = "Reg-input">
              <span className="fieldname">First name</span>
              <input className = "inputTextField"
                type="text"
                name="firstname"
                value={this.state.firstName}
                onChange={this.fn_handleChange}
              />
            </label>
            <label className = "Reg-input">
              <span className="fieldname">Last name</span>
              <input className = "inputTextField"
                type="text"
                name="lastname"
                value={this.state.lastName}
                onChange={this.ln_handleChange}
              />
            </label>
            <label className = "Reg-input">
              <span className="fieldname">Password</span>
              <input className = "inputTextField"
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.p_handleChange}
              />
            </label>
            <label className = "Reg-input">
              <span className="fieldname">Verify password</span>
              <input className = "inputTextField"
                type="password"
                name="verifypassword"
                value={this.state.verifypassword}
                onChange={this.vp_handleChange}
              />
            </label>
            <button
              className = "u-button" 
              type="submit"
              onClick={this.handleSubmit}>
              {this.state.buttontext}</button>
            <div>
              {
                this.state.password && ((this.state.password === this.state.verifypassword) ? (
                  <div className="bkgreen">Passwords match</div>
                ) : (
                  <div className="bkred">Passwords do not match</div>
                ))
              }
            </div>
          </form>
        </div>
      );
    }
  }

}

export default RegistrationPage;