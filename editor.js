import * as previews from "./previews.js";
import * as slides from "./slides.js";
import { spacing } from "./graphics.js"

export const canvas = $("#slide-editor");
const ctx = canvas.get(0).getContext("2d");

previews.onResize(() => { onChange(); }); // ignore parameters
slides.onSlideChange(onChange);
function onChange(oldSlide) {
  const slide = slides.currentSlide;
  const width = canvas.get(0).width;
  const height = canvas.get(0).height;

  const scale = {};
  scale.x = width / (spacing.x * slide.cols);
  scale.y = height / (spacing.y * slide.rows);

  if (oldSlide) {
    slide.addContext({ ctx, scale });
    slide.render(scale)
    oldSlide.removeContext(ctx);
  }
  else {
    slide.setContext({ ctx, scale });
  }

  // setTimeout(slide.render.bind(slide, scale), 100)
}

// setInterval(() => {
//   slides.currentSlide.render()
// }, 1000);

setInterval(() => {
  slides.currentSlide.runCursor();
})
