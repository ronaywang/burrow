import React, { Component } from "react";
import "../../utilities.css"
import "./NavBar.css"


class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <nav>
        <div>
          {/* TODO: LOGO */}
          <Search />
        </div>
        <div>
          <Link to="/messages">
            messages
          </Link>
          <Link to="/profile">
            profile
          </Link>
          <Link to="/">
            home
          </Link>
          {/* TODO: ADD LOGIC FOR LOGIN/LOGOUT */}
        </div>
      </nav>
    );
  }

}

export default NavBar;