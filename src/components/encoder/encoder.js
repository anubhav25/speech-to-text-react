var Flac = require("../encoder/libflac4-1.3.2.js");
//'../node_modules/libflacjs/dist/libflac4-1.3.2.js'

class FlacEncoder {
  flac_encoder = null;
  BUFSIZE = 4096;
  CHANNELS = 1;
  SAMPLERATE = 44100;
  COMPRESSION = 5;
  BPS = 16;
  flac_ok = 1;
  flacLength = 0;
  flacBuffers = [];
  WAVFILE = false;
  INIT = false;
  wavLength = 0;
  wavBuffers = [];

  write_callback_fn(buffer, bytes) {
    this.flacBuffers.push(buffer);
    this.flacLength += buffer.byteLength;
  }

  write_wav(buffer) {
    this.wavBuffers.push(buffer);
    this.wavLength += buffer.length;
  }

  onmessage = function(e) {
    switch (e.data.cmd) {
      case "init":
        // using FLAC
        if (!e.data.config) {
          e.data.config = {
            bps: this.BPS,
            channels: this.CHANNELS,
            samplerate: this.SAMPLERATE,
            compression: this.COMPRESSION
          };
        }

        e.data.config.channels = e.data.config.channels
          ? e.data.config.channels
          : this.CHANNELS;
        e.data.config.samplerate = e.data.config.samplerate
          ? e.data.config.samplerate
          : this.SAMPLERATE;
        e.data.config.bps = e.data.config.bps ? e.data.config.bps : this.BPS;
        e.data.config.compression = e.data.config.compression
          ? e.data.config.compression
          : this.COMPRESSION;

        ////
        this.COMPRESSION = e.data.config.compression;
        this.BPS = e.data.config.bps;
        this.SAMPLERATE = e.data.config.samplerate;
        this.CHANNELS = e.data.config.channels;
        ////

        if (!Flac.isReady()) {
          Flac.onready = function() {
            setTimeout(function() {
              this.initFlac();
            }, 0);
          };
        } else {
          this.initFlac();
        }

        break;

      case "encode":
        if (this.WAVFILE) {
          // WAVE - PCM
          this.write_wav(e.data.buf);
        } else {
          // FLAC
          this.encodeFlac(e.data.buf);
        }
        break;

      case "finish":
        var data;
        if (!Flac.isReady()) {
          console.error("Flac was not initialized: could not encode data!");
        } else {
          this.flac_ok &= Flac.FLAC__stream_encoder_finish(this.flac_encoder);
          console.log("flac finish: " + this.flac_ok); //DEBUG
          data = this.exportFlacFile(
            this.flacBuffers,
            this.flacLength,
            this.mergeBuffersUint8
          );

          Flac.FLAC__stream_encoder_delete(this.flac_encoder);
        }
        console.log(data);
        this.INIT = false;
        break;
      default:
        return;
    }
  };

  //HELPER: handle initialization of flac encoder
  initFlac() {
    this.flac_encoder = Flac.init_libflac_encoder(
      this.SAMPLERATE,
      this.CHANNELS,
      this.BPS,
      this.COMPRESSION,
      0
    );
    ////
    if (this.flac_encoder != 0) {
      var status_encoder = Flac.init_encoder_stream(
        this.flac_encoder,
        this.write_callback_fn
      );
      this.flac_ok &= status_encoder == 0;

      console.log("flac init     : " + this.flac_ok); //DEBUG
      console.log("status encoder: " + this.status_encoder); //DEBUG
      this.clear();
      this.INIT = true;
    } else {
      console.error("Error initializing the encoder.");
    }
  }

  //HELPER: handle incoming PCM audio data for Flac encoding:
  encodeFlac(audioData) {
    if (!Flac.isReady()) {
      //if Flac is not ready yet: buffer the audio
      this.wavBuffers.push(audioData);
      console.info("buffered audio data for Flac encdoing");
    } else {
      if (this.wavBuffers.length > 0) {
        //if there is buffered audio: encode buffered first (and clear buffer)

        var len = this.wavBuffers.length;
        var buffered = this.wavBuffers.splice(0, len);
        for (var i = 0; i < len; ++i) {
          this.doEncodeFlac(buffered[i]);
        }
      }

      this.doEncodeFlac(audioData);
    }
  }

  //HELPER: actually encode PCM data to Flac
  doEncodeFlac(audioData) {
    var buf_length = audioData.length;
    var buffer_i32 = new Uint32Array(buf_length);
    var view = new DataView(buffer_i32.buffer);
    var volume = 1;
    var index = 0;
    for (var i = 0; i < buf_length; i++) {
      view.setInt32(index, audioData[i] * (0x7fff * volume), true);
      index += 4;
    }

    var flac_return = Flac.FLAC__stream_encoder_process_interleaved(
      this.flac_encoder,
      buffer_i32,
      buffer_i32.length / this.CHANNELS
    );
    if (flac_return != true) {
      console.log(
        "Error: encode_buffer_pcm_as_flac returned false. " + flac_return
      );
    }
  }

  exportFlacFile(recBuffers, recLength) {
    //convert buffers into one single buffer
    var samples = this.mergeBuffersUint8(recBuffers, recLength);

    //	var audioBlob = new Blob([samples], { type: type });
    var the_blob = new Blob([samples], { type: "audio/flac" });
    return the_blob;
  }

  mergeBuffersUint8(channelBuffer, recordingLength) {
    var result = new Uint8Array(recordingLength);
    var offset = 0;
    var lng = channelBuffer.length;
    for (var i = 0; i < lng; i++) {
      var buffer = channelBuffer[i];
      result.set(buffer, offset);
      offset += buffer.length;
    }
    return result;
  }

  clear() {
    this.flacBuffers.splice(0, this.flacBuffers.length);
    this.flacLength = 0;
    this.wavBuffers.splice(0, this.wavBuffers.length);
    this.wavLength = 0;
  }
}
export default FlacEncoder;
