import React, { Component } from "react";

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false,
      constraints: { audio: true, video: false }
    };
  }
  chunks = [];
  mediaRecorder = null;
  myStream = null;
  // startRecording = () => {
  //   this.setState({
  //     record: true
  //   });
  // };

  // stopRecording = () => {
  //   this.setState({
  //     record: false
  //   });
  // };

  // onData(recordedBlob) {
  //   console.log("chunk of real-time data is: ", recordedBlob);
  // }

  // async onStop(recordedBlob) {
  //   console.log(recordedBlob);
  //   var reader = new FileReader();
  //   reader.readAsDataURL(recordedBlob.blob);
  //   reader.onload = async function() {
  //     var data = reader.result.replace(/^data:.+;base64,/, "");
  //     console.log(reader.result);
  //     let res = await fetch("http://localhost:4000/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({ data })
  //     });
  //     res = await res.json();
  //     console.log(res);
  //   };

  //   reader.onerror = function(error) {
  //     console.log("Error: ", error);
  //   };
  // }
  getUserMedia = callback => {
    console.log("getUserMedia supported.");

    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { audio: true },
        stream => {
          var mstream = new MediaStream(stream);
          console.log("stream", mstream.getAudioTracks()[0]);

          this.mediaRecorder = new MediaRecorder(stream, {
            audioBitsPerSecond: 16000
          }); //, {audioBitsPerSecond : 128000}

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
  stopMedia = callback => {
    this.mediaRecorder.onstop = async e => {
      console.log(
        "mediaRecorder.onstop : data available after MediaRecorder.stop() called."
      );
      console.log("audioBitsPerSecond", this.mediaRecorder.audioBitsPerSecond);

      var blob = new Blob(this.chunks, {
        type: "audio/wav; base64"
      }); /*  codecs=opus */
      var audioURL = window.URL.createObjectURL(blob);
      // $("body").append("<audio>"); // var audio = document.createElement('audio');
      // $("audio")
      //   .prop("controls", true)
      //   .prop("src", audioURL); // audio.controls = true;

      console.log("blob", blob);
      console.log("recorder stopped. URL", audioURL);
      const formData = new FormData();
      formData.append("blob", blob, "test1.wav");
      console.log(formData);
      let res = await fetch("http://localhost:4000/voice", {
        method: "POST",
        body: formData
      });
      res = await res.json();
      console.log(res);
      // var reader = new FileReader();
      // reader.readAsDataURL(blob);
      // reader.onload = async function() {
      //   var data = reader.result; //.replace(/^data:.+;base64,/, "");
      //   //console.log(reader.result);
      //   let res = await fetch("http://localhost:4000/voice", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json"
      //     },
      //     body: JSON.stringify({ data })
      //   });
      //   //res = await res.json();
      //   console.log(res);
      // };
      // $("body")
      //   .append("<a>")
      //   .children("a")
      //   .attr("href", audioURL)
      //   .text("down");
    }; // end mediaRecorder.onstop

    this.mediaRecorder.ondataavailable = e => {
      this.chunks.push(e.data); // 이게 없으면 재생안됨.
      console.log("ondataavailable e", e);
    }; // end mediaRecorder.ondataavailable

    this.mediaRecorder.stop();
  };

  render() {
    return (
      <div>
        <button onClick={this.getUserMedia} type="button">
          Audio
        </button>
        <br />
        <br />
        <button onClick={this.stopMedia} type="button">
          Stop
        </button>
      </div>
    );
  }
}

export default Test;
