import React, { Component } from "react";
import "./chat.scss";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "anubhav",
      messages: [],
      recording: false
    };
  }
  chunks = [];
  mediaRecorder = null;
  myStream = null;
  getUserMedia = () => {
    console.log("getUserMedia supported.");
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { audio: true },
        stream => {
          var mstream = new MediaStream(stream);
          console.log("stream", mstream.getAudioTracks()[0]);

          this.mediaRecorder = new MediaRecorder(stream, {
            audioBitsPerSecond: 16000
          });

          this.myStream = this.mediaRecorder.stream;
          console.log("myStream", this.myStream);
          this.mediaRecorder.start();
          this.mediaRecorder.onstart = e => {
            console.log("mediaRecorder.onstart", e);
            console.log(
              "audioBitsPerSecond",
              this.mediaRecorder.audioBitsPerSecond
            );
          };
        },
        err => {
          console.log("err", err);
        }
      );
    } else {
      console.log("not supported browser..");
    }
  };
  stopMedia = () => {
    this.mediaRecorder.onstop = async e => {
      console.log(
        "mediaRecorder.onstop : data available after MediaRecorder.stop() called."
      );
      console.log("audioBitsPerSecond", this.mediaRecorder.audioBitsPerSecond);

      var blob = new Blob(this.chunks, {
        type: "audio/wav; base64"
      });
      //var audioURL = window.URL.createObjectURL(blob);

      console.log("blob", blob);
      const formData = new FormData();
      formData.append("blob", blob, "test1.wav");
      console.log(formData);

      let res = await fetch("http://localhost:4000/voice", {
        method: "POST",
        body: formData
      });
      res = await res.json();
      console.log(res);
    }; // end mediaRecorder.onstop

    this.mediaRecorder.ondataavailable = e => {
      this.chunks.push(e.data);
      console.log("ondataavailable e", e);
    }; // end mediaRecorder.ondataavailable

    this.mediaRecorder.stop();
  };
  render() {
    return (
      <div className="chat">
        <div className="chat-header clearfix">
          <img
            className="rounded-circle"
            src="/assets/img/chat.jpg"
            alt="avatar"
          />
          <div className="chat-with mx-auto">{this.state.title}</div>
        </div>
        <div className="chat-history">
          <ul>
            {this.state.messages.length > 0 &&
              this.state.messages.map(msg => {
                return (
                  (msg.from === "me" && (
                    <li>
                      <div className="message-data align-right">
                        <span className="message-data-time">{msg.time}</span>{" "}
                        &nbsp; &nbsp;
                        <span className="message-data-name">
                          {msg.from}
                        </span>{" "}
                        <i className="fa fa-circle me" />
                      </div>
                      <div className="message other-message float-right">
                        <p>{msg.message}</p>
                      </div>
                    </li>
                  )) || (
                    <li>
                      <div className="message-data">
                        <span className="message-data-name">
                          <i className="fa fa-circle online" /> {msg.from}
                        </span>
                        <span className="message-data-time">{msg.time}</span>
                      </div>
                      <div className="message my-message">
                        <p>{msg.message}</p>
                      </div>
                    </li>
                  )
                );
              })}
          </ul>
        </div>
        <div className="chat-message clearfix container my-auto">
          <div className="float-left col-9 mx-auto">
            <input
              type="text"
              name="message-to-send"
              id="message-to-send"
              placeholder="Type your message"
            />
          </div>
          <div className="float-right col-3 mx-auto">
            <button onMouseDown={this.getUserMedia} onMouseUp={this.stopMedia}>
              {this.state.recording ? "STOP" : "START"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
