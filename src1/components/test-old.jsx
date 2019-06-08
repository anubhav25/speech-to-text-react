import React, { Component } from "react";
import { ReactMic } from "./react-mic/lib/index";

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false
    };
  }

  startRecording = () => {
    this.setState({
      record: true
    });
  };

  stopRecording = () => {
    this.setState({
      record: false
    });
  };

  onData(recordedBlob) {
    console.log("chunk of real-time data is: ", recordedBlob);
  }

  async onStop(recordedBlob) {
    console.log(recordedBlob);
    var reader = new FileReader();
    reader.readAsDataURL(recordedBlob.blob);
    reader.onload = async function() {
      var data = reader.result.replace(/^data:.+;base64,/, "");
      console.log(reader.result);
      let res = await fetch("http://localhost:4000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data })
      });
      res = await res.json();
      console.log(res);
    };

    reader.onerror = function(error) {
      console.log("Error: ", error);
    };
  }

  render() {
    return (
      <div>
        <ReactMic
          record={this.state.record}
          className="sound-wave"
          onStop={this.onStop}
          onData={this.onData}
          strokeColor="#000000"
          backgroundColor="#FF4081"
          audioBitsPerSecond={16000}
          mimeType="audio/wav; base64"
        />
        <button
          onMouseDown={this.startRecording}
          onMouseUp={this.stopRecording}
          type="button"
        >
          Audio
        </button>
      </div>
    );
  }
}

export default Test;
