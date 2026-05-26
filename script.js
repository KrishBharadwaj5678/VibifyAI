import { songs, emotionEmoji, emotionToNumber } from "./js/constants.js";
import { startVideo } from "./js/video.js";
import {
  video,
  emotionDisplay,
  ctx,
  emojiOverlay,
  overlay,
  overlayCtx,
  toggleBoundingBoxBtn,
  detectIcon,
  audio,
} from "./js/elements.js";
import { clearRectangle } from "./js/clearRectangle.js";
import { getDominantEmotion } from "./js/getDominantEmotion.js";

// Emotion history to determine stable emotion
let emotionHistory = [];
let HISTORY_LIMIT = 5;
let currentStableEmotion = "neutral";
let lastPlayedEmotion = null;

// Constants for timeline
let emotionTimeline = [];
let timelineLabels = [];
let timeCounter = 0;

// Bounding box toggle state
let showBoundingBox = false;

// Audio element for music playback
audio.src = "./music/neutral.mp3";
audio.play();

// Initialize Chart.js
export let moodChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: timelineLabels,
    datasets: [
      {
        label: "Mood Over Time",
        data: emotionTimeline,
        borderColor: "blue",
        borderColor: "rgb(75, 192, 192)",
        tension: 0.3,
      },
    ],
  },
  options: {
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            let map = {
              Fearful: 7,
              Disgusted: 6,
              Angry: 5,
              Happy: 4,
              Surprised: 3,
              Neutral: 2,
              Sad: 1,
            };
            return Object.keys(map).find((key) => map[key] === value);
          },
        },
      },
    },
  },
});

// Toggle bounding box display
toggleBoundingBoxBtn.addEventListener("click", () => {
  showBoundingBox = !showBoundingBox;

  detectIcon.setAttribute(
    "src",
    showBoundingBox ? "./icons/detection.png" : "./icons/detectionOff.png",
  );

  if (!showBoundingBox) {
    clearRectangle();
  }
});

// Load face-api models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(startVideo);

// Detect emotions every 2 seconds
video.addEventListener("play", () => {
  setInterval(async () => {
    // Detect face and expressions
    let detections = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (!detections) return;

    // Set canvas size to match video
    overlay.width = video.videoWidth;
    overlay.height = video.videoHeight;
    clearRectangle();

    // Draw bounding box if enabled
    if (showBoundingBox) {
      let box = detections.detection.box;

      // Draw bounding box
      overlayCtx.strokeStyle = "#00ffcc";
      overlayCtx.lineWidth = 3;
      overlayCtx.strokeRect(box.x, box.y, box.width, box.height);

      // Confidence Score
      let confidence = Math.round(detections.detection.score * 100);
      overlayCtx.fillStyle = "rgba(0,0,0,0.7)";
      overlayCtx.fillRect(box.x, box.y - 35, 140, 30);

      // Label Text
      overlayCtx.fillStyle = "#00ffcc";
      overlayCtx.font = "18px Inter";
      overlayCtx.fillText(`Face ${confidence}%`, box.x + 10, box.y - 14);
    }

    // Get expressions and their probabilities
    let expressions = detections.expressions;
    // Find the emotion with the highest probability
    let emotion = Object.keys(expressions).reduce((a, b) =>
      expressions[a] > expressions[b] ? a : b,
    );

    // Update emotion history
    emotionHistory.push(emotion);
    if (emotionHistory.length > HISTORY_LIMIT) {
      emotionHistory.shift(); // remove oldest emotion
    }

    // Determine stable emotion
    let stableEmotion = getDominantEmotion(emotionHistory);

    // Show UI
    emotionDisplay.innerText = `Emotion: ${stableEmotion.charAt(0).toUpperCase() + stableEmotion.slice(1)}`;

    // Update emoji overlay
    emojiOverlay.innerText = emotionEmoji[stableEmotion] || "😐";

    // Play music if stable emotion changes
    if (stableEmotion !== currentStableEmotion && songs[stableEmotion]) {
      currentStableEmotion = stableEmotion;

      if (lastPlayedEmotion !== stableEmotion) {
        audio.src = songs[stableEmotion];
        audio.play();
        lastPlayedEmotion = stableEmotion;
      }
    }

    // Update timeline
    timeCounter++;

    // Map emotion to number for chart
    emotionTimeline.push(emotionToNumber[stableEmotion] || 2);
    timelineLabels.push(timeCounter);

    // Keep only the last 20 entries for better visualization
    if (emotionTimeline.length > 20) {
      emotionTimeline.shift();
      timelineLabels.shift();
    }

    // Update chart
    moodChart.update();
  }, 1000);
});
