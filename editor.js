import * as previews from "./previews.js";
import * as slides from "./slides.js";
import { spacing } from "./graphics.js"

export const canvas = $("#slide-editor");
const ctx = canvas.get(0).getContext("2d");

previews.onFinishResize(() => { onChange(); }); // ignore parameters
slides.onSlideChange(onChange);
function onChange(oldSlide) {
  const slide = slides.currentSlide;
  const width = canvas.width();
  const height = canvas.height();

  const scale = {};
  scale.x = width / (spacing.x * slides.cols);
  scale.y = height / (spacing.y * slides.rows);

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
  if (slides.currentSlide != null) slides.currentSlide.runCursor();
});
