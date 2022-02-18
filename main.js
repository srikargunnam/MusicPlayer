import { albums } from "./albums.js";

const musicContainer = document.querySelector(".music-container");
const title = document.querySelector("#title");
const album = document.querySelector(".album");
const prevAlbBtn = document.querySelector(".prevAlbum");
const nextAlbBtn = document.querySelector(".nextAlbum");
const audio = document.querySelector("#audio");
const cover = document.querySelector("#cover");
const volumeBar = document.querySelector(".volumeBar");
const progress = document.querySelector(".progress");
const progressContainer = document.querySelector(".progress-container");
const prevBtn = document.querySelector("#prev");
const playBtn = document.querySelector("#play");
const playIcon = playBtn.querySelector(".fas");
const nextBtn = document.querySelector("#next");

// Keep track of albums
let albumIndex = 0;

// Keep track of songs
let songIndex = 0;

// inital volume

// Initially loan song info DOM
loadSong(albums[albumIndex].data[songIndex]);

// Update song
function loadSong(song) {
  album.innerText = albums[albumIndex].albumName;
  title.innerText = Object.keys(song)[0];
  audio.src = Object.values(song)[0];
  cover.src = albums[albumIndex].albumCover;
}

function playPauseToggle() {
  const isPlaying = musicContainer.classList.contains("play");

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

function playSong() {
  musicContainer.classList.add("play");
  playIcon.classList.remove("fa-play");
  playIcon.classList.add("fa-pause");

  audio.play();
}

function pauseSong() {
  musicContainer.classList.remove("play");
  playIcon.classList.remove("fa-pause");
  playIcon.classList.add("fa-play");
  audio.pause();
}

function prevSong() {
  songIndex--;
  if (songIndex < 0) {
    songIndex = albums[albumIndex].data.length - 1;
  }
  loadSong(albums[albumIndex].data[songIndex]);
  playSong();
}

function nextSong() {
  songIndex++;
  if (songIndex > albums[albumIndex].data.length - 1) {
    songIndex = 0;
  }
  loadSong(albums[albumIndex].data[songIndex]);
  playSong();
}

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercentage = (currentTime / duration) * 100;
  progress.style.width = `${progressPercentage}%`;
}

function setProgress(e) {
  console.log(this);
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

function prevAlbum() {
  albumIndex--;
  if (albumIndex < 0) {
    albumIndex = albums.length - 1;
  }
  songIndex = 0;
  loadSong(albums[albumIndex].data[songIndex]);
  playSong();
}

function nextAlbum() {
  albumIndex++;
  if (albumIndex > albums.length) {
    albumIndex = 0;
  }
  songIndex = 0;
  loadSong(albums[albumIndex].data[songIndex]);
  playSong();
}

function log(e) {
  if (e.key === "ArrowLeft") audio.currentTime -= 5;
  else if (e.key === "ArrowRight") audio.currentTime += 5;

  if (e.key === "ArrowUp" && audio.volume < 1) {
    audio.volume += 0.1;
    volumeBar.style.height = `${(audio.volume / 1) * 100}%`;
  } else if (e.key === "ArrowDown" && audio.volume > 0) {
    audio.volume -= 0.1;
    volumeBar.style.height = `${(audio.volume / 1) * 100}%`;
  }

  if (e.key === " ") playPauseToggle();
}

// Event Listeners
playBtn.addEventListener("click", playPauseToggle);

// change album
prevAlbBtn.addEventListener("click", prevAlbum);

nextAlbBtn.addEventListener("click", nextAlbum);

// change Song
prevBtn.addEventListener("click", prevSong);

nextBtn.addEventListener("click", nextSong);

audio.addEventListener("timeupdate", updateProgress);

progressContainer.addEventListener("click", setProgress);

audio.addEventListener("ended", nextSong);

document.addEventListener("keydown", log);
