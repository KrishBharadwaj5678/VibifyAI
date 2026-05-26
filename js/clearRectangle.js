import { overlayCtx } from "./elements.js";

export let clearRectangle = () => {
  overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
};
