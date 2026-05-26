// Format time in mm:ss
export let formatTime = (time) => {
  if (isNaN(time)) return "0:00";

  const mins = Math.floor(time / 60);

  const secs = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
};
