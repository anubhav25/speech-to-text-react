import React, { Component } from "react";
import "../css/App.scss";
import { connect } from "react-redux";
import * as actions from "../actions";
import socketIOClient from "socket.io-client";
import SocketIOFileUpload from "socketio-file-upload";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Speech-to-Text",
      record: false,
      messages: []
    };
    this.socket = socketIOClient(actions.baseUri);
    this.uploader = new SocketIOFileUpload(this.socket);
    this.socket.on("message", data => {
      this.setState({ messages: [...this.state.messages, data] });
    });
  }
  chunks = [];
  mediaRecorder = null;
  myStream = null;
  recording = false;
  encoder = null;
  audio_context = null;
  node = null;
  input = null;
  stream = null;
  componentWillMount() {
    this.encoder = new Worker("encoder.js");
    this.encoder.postMessage({ cmd: "init" });
    this.encoder.onmessage = e => {
      if (e.data.cmd === "end") {
        console.log(e.data.buf);
        window.b = e.data.buf;
        const formData = new FormData();
        formData.append("blob", e.data.buf, "temp.flac");
        this.uploader.submitFiles([new File([e.data.buf], "temp.flac")]);
        this.props.dispachVoice(formData);
        //this.encoder.terminate();
        //window.encoder = null;
      } else {
        console.error(
          'Unknown event from encoder (WebWorker): "' + e.data.cmd + '"!'
        );
      }
    };
    this.encoder.postMessage({
      cmd: "init",
      config: { samplerate: 44100, bps: 16, channels: 1, compression: 5 }
    });
  }

  gotUserMedia = stream => {
    //    var mstream = new MediaStream(stream);
    this.stream = stream;
    if (typeof webkitAudioContext !== "undefined") {
      this.audio_context = new window.webkitAudioContext();
    } else if (typeof AudioContext !== "undefined") {
      this.audio_context = new window.AudioContext();
    }
    this.input = this.audio_context.createMediaStreamSource(stream);
    if (this.input.context.createJavaScriptNode)
      this.node = this.input.context.createJavaScriptNode(4096, 1, 1);
    else if (this.input.context.createScriptProcessor)
      this.node = this.input.context.createScriptProcessor(4096, 1, 1);
    this.encoder.postMessage({
      cmd: "init",
      config: { samplerate: 44100, bps: 16, channels: 1, compression: 5 }
    });
    this.node.onaudioprocess = e => {
      //if (this.recording) return;
      // see also: http://typedarray.org/from-microphone-to-wav-with-getusermedia-and-web-audio/
      var channelLeft = e.inputBuffer.getChannelData(0);
      // var channelRight = e.inputBuffer.getChannelData(1);
      this.encoder.postMessage({ cmd: "encode", buf: channelLeft });
    };
    this.input && this.input.connect(this.node);
    this.node && this.node.connect(this.audio_context.destination);
  };
  error = err => {
    console.log("err", err);
  };
  getUserMedia = () => {
    this.recording = true;
    console.log("getUserMedia supported.");
    // if (navigator.webkitGetUserMedia)
    //   navigator.webkitGetUserMedia(
    //     { video: false, audio: true },
    //     this.gotUserMedia,
    //     this.error
    //   );
    // else if (navigator.mozGetUserMedia)
    //   navigator.mozGetUserMedia(
    //     { video: false, audio: true },
    //     this.gotUserMedia,
    //     this.error
    //   );
    // else
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then(this.gotUserMedia)
      .catch(this.error);
  };
  stopMedia = () => {
    if (this.recording) {
      this.recording = false;
      console.log("stop recording");
      if (!this.stream) {
        console.log("error");
        return;
      }
      var tracks = this.stream.getAudioTracks();
      for (var i = tracks.length - 1; i >= 0; --i) {
        tracks[i].stop();
      }
      this.encoder.postMessage({ cmd: "finish" });

      this.input && this.input.disconnect();
      this.node && this.node.disconnect();
      this.input = this.node = null;
    }
  };
  render() {
    return (
      <div className="chat">
        <div className="chat-header clearfix">
          <img className="rounded-circle" src={actions.thumb} alt="avatar" />
          <div className="chat-with mx-auto">{this.state.title}</div>
        </div>
        <div className="chat-history">
          <ul>
            {this.state.messages.length > 0 &&
              this.state.messages.map((msg, index) => {
                return (
                  (msg.from === "me" && (
                    <li key={index}>
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
                    <li key={index}>
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
        <div className="chat-message clearfix chatContainer my-auto">
          <div className="float-left col-9 mx-auto">
            <input
              type="text"
              name="message-to-send"
              id="message-to-send"
              placeholder="Type your message"
            />
          </div>
          <div className="float-right col-3 mx-auto">
            {(this.state.record && (
              <button
                onClick={() => {
                  this.setState({ record: !this.state.record });
                  this.stopMedia();
                }}
              >
                STOP
              </button>
            )) || (
              <button
                onClick={() => {
                  this.setState({ record: !this.state.record });
                  this.getUserMedia();
                }}
              >
                START
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapPropsToStore = store => {
  return {
    messages: store.messages || []
  };
};
const mapDispatchToProps = dispach => {
  return {
    dispachVoice: payload => {
      dispach({ type: actions.GETDATA, payload });
    }
  };
};
export default connect(
  mapPropsToStore,
  mapDispatchToProps
)(Chat);
