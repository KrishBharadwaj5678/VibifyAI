// Start video stream
export let startVideo = async () => {
  let stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  video.srcObject = stream;
};
