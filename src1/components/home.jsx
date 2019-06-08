import React, { Component } from "react";
import Posts from "./posts";
import NavBar from "./navbar";

class Home extends Component {
  state = {};
  render() {
    return (
      <div className="intro-body">
        <NavBar />
        <div className="container">
          <Posts />
        </div>
      </div>
    );
  }
}

export default Home;
