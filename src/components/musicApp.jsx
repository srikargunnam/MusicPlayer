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
  };

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
    window.addEventListener("keydown", this.keyHandler);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.keyHandler);
  }

  loadSong = (song) => {
    this.audio.current.src = Object.values(song)[0];
    console.log(Object.values(song)[0]);
    this.setState({ album: albums[this.albumIndex].albumName });
    this.setState({ songTitle: Object.keys(song)[0] });
    this.setState({ cover: albums[this.albumIndex].albumCover });
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
    let { songIndex } = this;
    songIndex--;
    if (songIndex < 0) songIndex = albums[this.albumIndex].data.length - 1;
    this.loadSong(albums[this.albumIndex].data[songIndex]);
    this.setState({ isPlaying: true });
    this.playSong();
    this.songIndex = songIndex;
  };

  nextSong = () => {
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
    this.loadSong(albums[this.albumIndex].data[this.songIndex]);
    this.playSong();
  };

  nextAlbum = () => {
    let { albumIndex } = this;
    albumIndex++;
    if (albumIndex > albums.length - 1) albumIndex = 0;
    this.songIndex = 0;
    this.albumIndex = albumIndex;
    this.loadSong(albums[this.albumIndex].data[this.songIndex]);
    this.playSong();
  };

  updateProgress = (e) => {
    const { duration, currentTime } = e.nativeEvent.srcElement;
    const progressPercentage = (currentTime / duration) * 100;
    this.progress.current.style.width = `${progressPercentage}%`;
  };

  setProgress = (e) => {
    const width = this.progressContainer.current.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const duration = this.audio.current.duration;
    console.log(width, clickX, duration, typeof duration);
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

    if (e.key === " ") this.playPauseToggle();
  };

  render() {
    return (
      <div>
        <h1 className="app-name">Music Player</h1>
        <div className="album-container">
          <button className="prevAlbum album-btn" onClick={this.prevAlbum}>
            <i className="fas fa-caret-left"></i>
          </button>
          <h3 className="album">{this.state.album}</h3>
          <button className="nextAlbum album-btn" onClick={this.nextAlbum}>
            <i className="fas fa-caret-right"></i>
          </button>
        </div>
        <div
          className={
            this.state.isPlaying ? "music-container play" : "music-container"
          }
        >
          <div className="music-info">
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
          <div
            className="volumeBarContainer"
            ref={this.volumeBarContainer}
            onClick={this.setVolume}
          >
            <div className="volumeBar" ref={this.volumeBar}></div>
          </div>
        </div>
      </div>
    );
  }
}

export default MusicApp;
