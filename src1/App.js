import React from "react";
import Chat from "./components/chat";
import "./App.css";
import { Provider } from "react-redux";
import store from "./store";

function App() {
  return (
    <Provider store={store}>
      <header className="masthead">
        <div className="intro-body">
          <div className="container">
            <div className="row m-0" style={{ height: "100%", width: "100%" }}>
              <div className=" col-12 p-0 chatbox">
                <Chat />
              </div>
            </div>
          </div>
        </div>
      </header>
    </Provider>
  );
}

export default App;
