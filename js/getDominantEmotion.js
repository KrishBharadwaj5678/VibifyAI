// Get the most frequent emotion in the history
export let getDominantEmotion = (history) => {
  let count = {};

  history.forEach((e) => {
    count[e] = (count[e] || 0) + 1;
  });

  let maxEmotion = "neutral";
  let maxCount = 0;

  for (let key in count) {
    if (count[key] > maxCount) {
      maxCount = count[key];
      maxEmotion = key;
    }
  }
  return maxEmotion;
};
