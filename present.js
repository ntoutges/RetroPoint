import * as graphics from "./graphics.js";
import * as previews from "./previews.js";
import * as slides from "./slides.js";

export var isPresenting = false;
var slideIndex = 0;
var aspectRatio = 1;

const ctx = $("#present-canvas").get(0).getContext("2d")
var renderedSlide = new slides.BasicSlide({});

export function enterFullScreen() {
  if (isPresenting) return;

  $("body").get(0).classList.add("presenting");
  ctx.clearRect(0,0, $("#present-canvas").get(0).width, $("#present-canvas").get(0).height);
  renderedSlide.screen = [];
  renderedSlide.applyResize();
  
  $("#present-container").get(0).requestFullscreen().then(() => {
    setTimeout(() => {
      let width = $("#present-container").width();
      let height = $("#present-container").height();

      if (width / aspectRatio > height) width = height * aspectRatio;
      else height = width / aspectRatio;

      $("#present-canvas").attr("width", width);
      $("#present-canvas").attr("height", height);
      isPresenting = true;

      slideIndex = slides.slides.indexOf(slides.currentSlide); // start on current slide
      renderSlide(slides.slides[slideIndex]);
    }, 100);
  }).catch(err => {
    console.log("Sad")
  });
}

document.addEventListener("fullscreenchange", () => {
  if (isPresenting && document.fullscreenElement == null) {
    $("body").get(0).classList.remove("presenting");
    isPresenting = false;
    previews.selectPreview(slideIndex);
    clearAnimations();
  }
});

export function setResolution(res) {
  aspectRatio = res.x / res.y;
  renderedSlide.applyResize();
}

$("#present-container").click(() => {
  if (!isPresenting) return;
  advanceSlide(1);
});

window.addEventListener("keydown", (e) => {
  if (!isPresenting) return;
  switch (e.key) {
    case "ArrowLeft":
    case "ArrowUp":
      advanceSlide(-1);
      break;
    case "ArrowRight":
    case "ArrowDown":
    case " ":
      advanceSlide(1);
      break;
    case "Home":
      advanceSlide(-Infinity);
      break;
    case "End":
      advanceSlide(Infinity);
      break;
  }
});

window.onmousewheel = (e) => {
  advanceSlide(
    Math.sign( e.deltaX + e.deltaY )
  )
}

function advanceSlide(step) {
  const oldIndex = slideIndex;

  if (clearAnimations()) return; 
  slideIndex += step;

  if (slideIndex < 0) slideIndex = 0;
  else if (slideIndex >= slides.slides.length) slideIndex = slides.slides.length - 1;

  if (slideIndex == oldIndex) return;

  renderSlide(slides.slides[slideIndex], step);
}

export async function renderSlide(slide, step=0) {
  const animation = (step >= 0) ? slide.animation : renderedSlide.animation;
  let animationClass = animation.split("{")[0];
  const animationType = (animation.indexOf("{") == -1) ? {} : JSON.parse(animation.substring(animation.indexOf("{")));

  if (!(animationClass in animations)) animationClass = "default";
  
  const width = $("#present-canvas").width();
  const height = $("#present-canvas").height();
  renderedSlide.setContext({
    ctx,
    scale: {
      x: width / (slides.cols * graphics.spacing.x),
      y: height / (slides.rows * graphics.spacing.y)
    }
  });

  await animations[animationClass](slide, animationType);
  renderedSlide.screen = slide.screen.slice();
  renderedSlide.animation = slide.animation;

  renderedSlide.render();
}

function clearAnimations() {
  let cleared = Object.keys(animationBuffer).length > 0;
  for (let timeout in animationBuffer) {
    if (animationBuffer[timeout] !== true) { // run function if garunteed that it will run
      animationBuffer[timeout]();
    }
    clearTimeout(timeout);
  }
  animationBuffer = {};
  return cleared;
}

var animationBuffer = {};
function setBufferedTimeout(func, delay, param) {
  const timeout = setTimeout((param) => {
    delete animationBuffer[timeout];
    func(param);
  }, delay, param);
  animationBuffer[timeout] = true;
  return timeout;
}

function setGarunteedBufferedTimeout(func, delay, param) {
  const timeout = setBufferedTimeout(func,delay,param);
  animationBuffer[timeout] = func;
}

const animations = {
  "default": function() {},

  /// data: { step?: number, delay?: number, steps?: number[], delays?: number }
  "row": function(slide, data) {
    return new Promise(res => {
      let steps = [];
      if ("steps" in data) steps = data.steps;
      else {
        let step = ("step" in data) ? data.step : 1;
        if (step <= 0) throw new Error("Invalid step size");
        for (let i = 0; i < slides.rows; i += step) { steps.push(step); }
      }

      let delays = [];
      if ("delays" in data) {
        delays = data.delays;
        for (let i = delays.length; i < data.length; i++) { delays.push(100); } // ensure similar lengths
      }
      else {
        let delay = ("delays" in data) ? data.delays : 100;
        for (let i in steps) { delays.push(delay); }
      }

      let totalDelay = 0;
      let stepCt = 0;
      let prevRow = 0;
      for (let i = 0; i < steps.length && prevRow < slides.rows; i++) { // last step handled by call to full render()
        const step = (i < steps.length) ? steps[i] : 1;
        
        setBufferedTimeout((rowData) => {
          const startI = rowData[0];
          const endI = rowData[1];
          Array.prototype.splice.apply(
            renderedSlide.screen,
            [
              startI * slides.cols,
              (endI - startI) * slides.cols,
            ].concat( slide.screen.slice(
                startI * slides.cols,
                endI * slides.cols
              )
            )
          );
          renderedSlide.renderLines(
            startI,
            endI
          );
        }, totalDelay, [prevRow, prevRow + step])
        prevRow += step;
        totalDelay += delays[stepCt];
        stepCt++;
      }
      setGarunteedBufferedTimeout(res, totalDelay);
    });
  },
  /// data: { step?: number, delay?: number, steps?: number[], delays?: number }
  "col": function(slide, data) {
    return new Promise(res => {
      let steps = [];
      if ("steps" in data) steps = data.steps;
      else {
        let step = ("step" in data) ? data.step : 1;
        if (step <= 0) throw new Error("Invalid step size");
        for (let i = 0; i < slides.cols; i += step) { steps.push(step); }
      }

      let delays = [];
      if ("delays" in data) {
        delays = data.delays;
        for (let i = delays.length; i < data.length; i++) { delays.push(100); } // ensure similar lengths
      }
      else {
        let delay = ("delays" in data) ? data.delays : 100;
        for (let i in steps) { delays.push(delay); }
      }

      let totalDelay = 0;
      let stepCt = 0;
      let prevCol = 0;
      for (let i = 0; i < steps.length && prevCol < slides.cols; i++) { // last step handled by call to full render()
        const step = (i < steps.length) ? steps[i] : 1;
        
        setBufferedTimeout((rowData) => {
          const step = rowData[1];
          for (let j = 0; j < slides.rows; j++) {
            const startI = j*slides.cols + rowData[0];

            Array.prototype.splice.apply(
              renderedSlide.screen,
              [
                startI,
                step,
              ].concat( slide.screen.slice(
                  startI,
                  startI + step
                )
              )
            );
          }
          renderedSlide.render();


        }, totalDelay, [prevCol, step])
        prevCol += step;
        totalDelay += delays[stepCt];
        stepCt++;
      }
      setGarunteedBufferedTimeout(res, totalDelay);
    });
  },

  /// data: {
  ///   type: animationType
  ///   in?: typeParams
  ///   out?: typeParams
  /// }
  inOut: async function(slide, data) {
    if (!("type" in data)) throw new Error("Animation type not specified")
    if (!(data.type in animations)) throw new Error("Invalid animation type")

    if (!("in" in data)) data.in = {};
    if (!("out" in data)) data.out = {};

    const empty = new slides.BasicSlide({})
    await animations[data.type]( empty, data.in );
    renderedSlide.screen = empty.screen;
    renderedSlide.render();
    await animations[data.type]( slide, data.out );
  }
}