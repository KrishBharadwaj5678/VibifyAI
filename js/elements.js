export let video = document.getElementById("video");
export let emotionDisplay = document.getElementById("emotion");
export let ctx = document.getElementById("emotionChart").getContext("2d");
export let emojiOverlay = document.getElementById("emojiOverlay");
export let overlay = document.getElementById("overlay");
export let overlayCtx = overlay.getContext("2d");
export let toggleBoundingBoxBtn = document.getElementById("toggleBoundingBox");
export let detectIcon = document.getElementById("detectIcon");
// Audio Elements
export let audio = document.getElementById("player");
export let playPauseBtn = document.querySelector(".play-pause-btn");
export let playPauseIcon = document.getElementById("playPause");
export let progressContainer = document.querySelector(".controls .slider");
export let progress = document.querySelector(".controls .progress");
export let currentTimeEl = document.querySelector(".current-time");
export let totalTimeEl = document.querySelector(".total-time");
export let volumeBtn = document.querySelector(".volume-btn");
export let volumeControls = document.querySelector(".volume-controls");
export let volumeSlider = document.querySelector(".volume-controls .slider");
export let volumeProgress = document.querySelector(
  ".volume-controls .progress",
);
