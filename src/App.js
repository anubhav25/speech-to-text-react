import React, { Component } from "react";
import "./css/App.scss";
import Chat from "./components/chat";

class App extends Component {
  render() {
    return (
      <div className="intro-body">
        <div className="container">
          <div className="row m-0" style={{ height: "95%", width: "100%" }}>
            <div className=" col-12 p-0 chatbox">
              <Chat />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
