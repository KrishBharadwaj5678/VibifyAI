import { timelineLabels, emotionTimeline } from "./script.js";
import { ctx } from "./elements.js";

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
