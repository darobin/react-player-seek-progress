
import React from 'react';
import ReactDOM from 'react-dom';
import ReactPlayer from 'react-player';

class VideoSync extends React.Component {
  constructor () {
    super();
    this.state = { log: '' };
    this.handleProgress = this.handleProgress.bind(this);

    this.handleStop = this.handleStop.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handleSeek = this.handleSeek.bind(this);
  }
  handleProgress (data) {
    let log = `${JSON.stringify(data)}\n${this.state.log}`;
    this.setState({ log });
  }
  handlePlay () {
    if (!this.state.ytPlayer) this.setState({ ytPlayer: this.refs.player.refs.player.player });
    if (!this.state.interval) this.setState({ interval: setInterval(this.handleProgress, POLL) });
  }
  handleStop () {
    this.setState({ playing: false });
  }
  handleError (err) {
    this.setState({ loadState: 'error', payload: err });
    console.error(err);
  }
  handleSeek (ev) {
    let time = ev.target.getAttribute('data-cue-from');
    console.log(`handling seek ${time}`);
    if (typeof time === 'undefined') return;
    console.log('seeking');
    this.seek(parseFloat(time));
  }
  seek (time) {
    let duration = this.state.duration;
    if (!duration && Array.isArray(this.state.payload)) {
      duration = this.state.payload[this.state.payload.length - 1].to;
    }
    if (!duration) return;
    console.log(`[${this.state.playing}] seeking to ${time/duration}`);
    this.refs.player.seekTo(time/duration);
    if (!this.state.playing) this.setState({ playing: true });
  }


  render () {
    return (
      <div>
        <ReactPlayer
          ref="player"
          url="https://www.youtube.com/watch?v=4p0aVgu4guI"
          playing={true}
          progressFrequency={100}
          onProgress={this.handleProgress}
          youtubeConfig={{
            preload:  true,
            playerVars: {
              controls:       2,
              modestbranding: 1,
              rel:            0,
              showinfo:       0,
            },
          }}
          />
        <pre>{this.state.log}</pre>
      </div>
    );
  }
}

ReactDOM.render(
  <VideoSync/>,
  document.getElementById('video')
);
