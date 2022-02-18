import React from "react";
import "./musicApp.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { albums } from "../database/albums";

class MusicApp extends React.Component {
  state = {
    album: [],
    songTitle: "",
    cover: "",
    isPlaying: false,
    duration: "",
    currentDuration: "00:00",
    volume: 100,
  };

  durationArray = [];

  // reference creations
  audio = React.createRef();
  progress = React.createRef();
  volumeBar = React.createRef();
  progressContainer = React.createRef();
  volumeBarContainer = React.createRef();
  albumIndex = 0;
  songIndex = 0;

  componentDidMount() {
    const { albumIndex, songIndex } = this;
    this.loadSong(albums[albumIndex].data[songIndex]);
    this.loadAlbum();
    window.addEventListener("keydown", this.keyHandler);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.keyHandler);
  }

  loadSong = (song) => {
    this.audio.current.src = Object.values(song)[0];
    this.setState({ songTitle: Object.keys(song)[0] });
    this.setState({ cover: albums[this.albumIndex].albumCover });
    this.getDuration();
  };

  loadAlbum = () => {
    this.setState({ album: albums[this.albumIndex].albumName });
  };

  playPauseToggle = () => {
    const isPlaying = this.state.isPlaying;
    if (isPlaying) this.pauseSong();
    else this.playSong();
  };

  playSong = () => {
    try {
      this.audio.current.play();
      this.setState({ isPlaying: true });
    } catch (ex) {
      console.log(ex);
    }
  };

  pauseSong = () => {
    try {
      this.audio.current.pause();
      this.setState({ isPlaying: false });
    } catch (ex) {
      console.log(ex);
    }
  };

  prevSong = () => {
    this.progress.current.style.width = `0%`;
    let { songIndex } = this;
    songIndex--;
    if (songIndex < 0) songIndex = albums[this.albumIndex].data.length - 1;
    this.loadSong(albums[this.albumIndex].data[songIndex]);
    this.setState({ isPlaying: true });
    this.playSong();
    this.songIndex = songIndex;
  };

  nextSong = () => {
    this.progress.current.style.width = `0%`;
    let { songIndex } = this;
    songIndex++;
    if (songIndex > albums[this.albumIndex].data.length - 1) songIndex = 0;
    this.setState({ songIndex });
    this.loadSong(albums[this.albumIndex].data[songIndex]);
    this.setState({ isPlaying: true });
    this.playSong();
    this.songIndex = songIndex;
  };

  prevAlbum = () => {
    let { albumIndex } = this;
    albumIndex--;
    if (albumIndex < 0) albumIndex = albums.length - 1;
    this.songIndex = 0;
    this.albumIndex = albumIndex;
    this.loadAlbum();
  };

  nextAlbum = () => {
    let { albumIndex } = this;
    albumIndex++;
    if (albumIndex > albums.length - 1) albumIndex = 0;
    this.songIndex = 0;
    this.albumIndex = albumIndex;
    this.loadAlbum();
  };

  updateProgress = (e) => {
    const { duration, currentTime } = e.nativeEvent.srcElement;
    const progressPercentage = (currentTime / duration) * 100;
    this.progress.current.style.width = `${progressPercentage}%`;
    let durationInMins = currentTime / 60;
    let mins = Math.floor(durationInMins);
    let secs = Math.round((durationInMins - mins) * 60);
    let currentDuration = `${mins < 10 ? "0" + mins : mins}:${
      secs < 10 ? "0" + secs : secs
    }`;
    this.setState({ currentDuration });
  };

  setProgress = (e) => {
    const width = this.progressContainer.current.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const duration = this.audio.current.duration;
    if (isNaN(duration)) return;
    else this.audio.current.currentTime = (clickX / width) * duration;
  };

  setVolume = (e) => {
    const height = this.volumeBarContainer.current.clientHeight;
    const clickX = e.nativeEvent.offsetY;
    this.audio.current.volume = clickX / height;
    this.volumeBar.current.style.height = `${
      (this.audio.current.volume / 1) * 100
    }%`;
    this.setState({ volume: (this.audio.current.volume / 1) * 100 });
  };

  keyHandler = (e) => {
    e.preventDefault();
    if (e.key === "ArrowLeft") this.audio.current.currentTime -= 5;
    else if (e.key === "ArrowRight") this.audio.current.currentTime += 5;

    if (e.key === "ArrowUp" && this.audio.current.volume < 1) {
      this.audio.current.volume += Math.min(0.1, 1 - this.audio.current.volume);
      this.volumeBar.current.style.height = `${
        (this.audio.current.volume / 1) * 100
      }%`;
    } else if (e.key === "ArrowDown" && this.audio.current.volume > 0) {
      this.audio.current.volume -= Math.min(0.1, this.audio.current.volume);
      this.volumeBar.current.style.height = `${
        (this.audio.current.volume / 1) * 100
      }%`;
    }

    if (e.ctrlKey && e.key === "ArrowLeft") this.prevAlbum();
    if (e.ctrlKey && e.key === "ArrowRight") this.nextAlbum();

    if (e.key === " ") this.playPauseToggle();
  };

  getDuration = (s) => {
    if (this.audio.current) {
      this.audio.current.addEventListener("loadedmetadata", () => {
        let durationInMins = this.audio.current.duration / 60;
        let mins = Math.floor(durationInMins);
        let secs = Math.floor((durationInMins - mins) * 60);
        let duration = `${mins < 10 ? "0" + mins : mins}:${
          secs < 10 ? "0" + secs : secs
        }`;
        this.setState({ duration });
      });
    }
  };

  // testDuration = async (s) => {
  //   let auDur = await new Audio(Object.values(s)[0].duration);
  //   this.durationArray.push(auDur);
  //   this.durationArray = [];
  //   console.log(this.durationArray);
  // };

  render() {
    return (
      <div className="container">
        <h1 className="app-name">
          <a
            href="https://github.com/srikargunnam/musicplayer"
            target="_blank"
            rel="noopener noreferrer"
          >
            Music Player
          </a>
        </h1>
        <div className="album-container">
          <button className="prevAlbum album-btn" onClick={this.prevAlbum}>
            <i className="fas fa-caret-left"></i>
          </button>
          <h3 className="album">
            <a
              href={albums[this.albumIndex].imdbLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {this.state.album}
            </a>
          </h3>
          <button className="nextAlbum album-btn" onClick={this.nextAlbum}>
            <i className="fas fa-caret-right"></i>
          </button>
        </div>
        <div className="albumDetailsContainer">
          <div className="tracksContainer">
            <table className="tracksTable">
              <thead>
                <tr className="tableHeaderRow">
                  <th className="th-1">Track</th>
                  <th className="th-2">Artists</th>
                  <th className="th-3">Duration</th>
                </tr>
              </thead>
              <tbody>
                {albums[this.albumIndex].data.map((s, index) => (
                  <tr
                    key={Object.keys(s)[0].slice(0, 3) + index}
                    className="tableBodyRow"
                    onClick={() => {
                      this.loadSong(s);
                      this.playSong();
                    }}
                  >
                    <td width="50%" className="td-1">
                      {Object.keys(s)[0]}
                    </td>
                    <td width="30%" className="td-2">
                      Artists
                    </td>
                    <td width="20%" className="td-3">
                      {/* {this.durationArray[index]} */}
                      --:-- / --:--
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div
          className={
            this.state.isPlaying ? "music-container play" : "music-container"
          }
        >
          <div className="music-info">
            <h4>{this.getDuration()}</h4>
            <h4 id="title">{this.state.songTitle}</h4>
            <div
              className="progress-container"
              onClick={this.setProgress}
              ref={this.progressContainer}
            >
              <div className="progress" ref={this.progress}></div>
            </div>
          </div>
          <audio
            src=""
            ref={this.audio}
            onTimeUpdate={this.updateProgress}
            onEnded={this.nextSong}
          ></audio>
          <div className="img-container">
            <img src={this.state.cover} alt="music-cover" id="cover" />
          </div>
          <div className="navigation">
            <button id="prev" onClick={this.prevSong} className="action-btn">
              <i className="fas fa-backward"></i>
            </button>
            <button
              id="play"
              onClick={this.playPauseToggle}
              className="action-btn action-btn-big"
            >
              <i
                className={
                  this.state.isPlaying ? "fas fa-pause" : "fas fa-play"
                }
              ></i>
            </button>
            <button id="next" onClick={this.nextSong} className="action-btn">
              <i className="fas fa-forward"></i>
            </button>
          </div>
          <div className="durationContainer">
            <h4 className="duration">
              {this.state.currentDuration} / {this.state.duration}
            </h4>
          </div>
          <div
            className="volumeBarContainer"
            ref={this.volumeBarContainer}
            onClick={this.setVolume}
          >
            <div className="volumeBar" ref={this.volumeBar}></div>
          </div>
          {/* <input type="range" value={this.state.volume} /> */}
        </div>
      </div>
    );
  }
}

export default MusicApp;
