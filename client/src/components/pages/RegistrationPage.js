import React, { Component } from "react";

import "../../utilities.css"
import { post } from "../../utilities";
const validator = require("email-validator");

class RegistrationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailold: '',
      firstName: '',
      lastName: '',
      birthdate: undefined,
      gender: '',
      password: '',
      verifypassword: '',
      buttontext: "register",
      failed: false,
      succeeded: false,
      mustfillfields: false,
      validemail: null,
      validemailmessage: false,
    }
  }

e_handleChange = (event) => {
  this.setState({email: event.target.value});
  this.setState({validemail: validator.validate(this.state.email)});
};

e_validate = (event) => {
  this.setState({validemail: validator.validate(this.state.email)});
}

p_handleChange = (event) => {
  this.setState({password: event.target.value});
};

vp_handleChange = (event) => {
  this.setState({verifypassword: event.target.value});
}
fn_handleChange = (event) => {
  this.setState({firstName: event.target.value});
}

ln_handleChange = (event) => {
  this.setState({lastName: event.target.value});
}

bd_handleChange = (event) => { 
  this.setState({birthdate: event.target.value});
}

g_handleChange = (event) => {
  this.setState({gender: event.target.value}); 
}


handleSubmit = (event) => {
  event.preventDefault();
  if (this.state.validemail === false) {
    this.setState({validemailmessage: true});
  } else {
    this.setState({validemailmessage: false});
  }
  if (this.state.gender === '' || this.state.birthdate === undefined || this.state.email === '' || this.state.firstName === '' || this.state.lastName === '' || this.state.password == '' || this.state.verifypassword !== this.state.password) {
    this.setState({mustfillfields: true});
    return;
  }
  if (this.state.validemailmessage || !this.state.validemail) {
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
  let gender = ["male", "female", "non-binary"];
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
      let emailClassName = "inputTextField";
      if (this.state.validemail === true) {
        emailClassName += " validemail";
      } else if (this.state.validemail === false) {
        emailClassName += " invalidemail";
      }
      return (
        <div className="u-flexColumn u-flex-alignCenter u-flex-spaceEvenly">
          { this.state.mustfillfields && (
            <span className="warning" title="you must fill all fields">You must fill all fields!</span>
            )}
          { (this.state.validemailmessage) && (
            <span className="warning" title="please enter a valid email">Please enter a valid email.</span>
          )}
          { this.state.failed ? "Registration failed. Email already taken": null}
          <h1 className="u-textCenter" title="join your burrow today">Join your burrow today.</h1>
          <div className="reg-container">
           <label className = "Reg-input" style={{gridRowStart: 1, gridRowEnd: 2, gridColumnStart: 1, gridColumnEnd: 3}} >
           {/*<i class="mail-icon"></i> icon stuff, will edit after Milestone 2*/}
           <span className="fieldname" title="Email">Email</span>
              <input className = {emailClassName}
                type="text"
                name="email"
                title="Email"
                value={this.state.email}
                onChange={this.e_handleChange}
                onBlur={this.e_validate}
                onFocus={this.e_validate}
              />
            </label>
            <label className = "Reg-input" style={{gridRowStart: 2, gridRowEnd: 3, gridColumnStart: 1, gridColumnEnd: 2}}>
              <span className="fieldname" title="First name">First name</span>
              <input className = "inputTextField-small"
                type="text"
                name="firstname"
                title="First name"
                value={this.state.firstName}
                onChange={this.fn_handleChange}
              />
            </label>
            <label className = "Reg-input" style={{gridRowStart: 2, gridRowEnd: 3, gridColumnStart: 2, gridColumnEnd: 3}}>
              <span className="fieldname" title="Last name">Last name</span>
              <input className = "inputTextField-small"
                type="text"
                name="lastname"
                title="Last name"
                value={this.state.lastName}
                onChange={this.ln_handleChange}
              />
            </label>
          <label className = "Reg-input" style={{gridRowStart: 3, gridRowEnd: 4, gridColumnStart: 1, gridColumnEnd: 2}}>
            <span className="fieldname" title="Birthdate">Birthdate</span>
              <input className = "inputbirthdate"
                type="date"
                name="birthdate"
                title="Birthdate"
                value={this.state.birthdate}
                onChange={this.bd_handleChange}
              />
          </label>
          <label className = "Reg-input" style={{gridRowStart: 3, gridRowEnd: 4, gridColumnStart: 2, gridColumnEnd: 3}}>
            <span className="fieldname" title="Gender">Gender</span>
              <select title="Gender" className = "dropbtn reg-dropbtn" 
              name = "gender" 
              value = {this.state.gender}
              onChange={this.g_handleChange}>
                <option value="" disabled selected>choose . . .</option>
                <option value = "Male">male</option>
                <option value = "Female">female</option>
                <option value = "Non-binary">non-binary</option>
              </select>
            </label>
            <label className = "Reg-input" style={{gridRowStart: 4, gridRowEnd: 5, gridColumnStart: 1, gridColumnEnd: 3}}>
              <span className="fieldname" title="Password">Password</span>
              <input className = "inputTextField"
                type="password"
                name="password"
                title="Password"
                value={this.state.password}
                onChange={this.p_handleChange}
              />
            </label>
            <label className = "Reg-input" style={{gridRowStart: 5, gridRowEnd: 6, gridColumnStart: 1, gridColumnEnd: 3}}>
              <span className="fieldname" title="Verify password">Verify password</span>
              <input className = "inputTextField" title="Verify password"
                type="password"
                name="verifypassword"
                value={this.state.verifypassword}
                onChange={this.vp_handleChange}
              />
            </label>
            <div className = "pwverify">
              {
                this.state.password && ((this.state.password === this.state.verifypassword) ? (
                  <div className="approval">passwords match</div>
                ) : (
                  <div className="error">passwords do not match</div>
                ))
              }
            </div>
            </div>
            <button
              title="Register your account"
              type="submit"
              onClick={this.handleSubmit}>
              {this.state.buttontext}</button>
            
        </div>
      );
    }
  }

}

export default RegistrationPage;