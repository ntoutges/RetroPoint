import { spacing } from "./graphics.js";
import { Slide } from "./slides.js";
import { madeChange } from "./undo.js";

var aspectRatio = 16/9;
var rows = 1;
var cols = 1;

var slidePreviewHelds = [];
var slidePreviews = [];
var currentSlide = null;

var doResizes = [];
var doFinResizes = [];
var doSlideChanges = [];

export function onResize(funct) { doResizes.push(funct); }
export function onFinishResize(funct) { doFinResizes.push(funct); }
export function onSlideChange(funct) { doSlideChanges.push(funct); }

export function selectPreview(index) {
  if (currentSlide != null) currentSlide.deselect();
  currentSlide = slidePreviews[index]
  currentSlide.select();
  doSlideChanges.forEach(funct => { funct(currentSlide); });
}

var resizingSlides = false;
$("#slides-side-resize").mousedown(() => {
  resizingSlides = true;
  $("body").css("cursor", "ew-resize");
});

$("body").mouseup(stopResizingSlides);
// $("body").mouseleave(stopResizingSlides);
function stopResizingSlides() {
  if (resizingSlides) {
    doFinResizes.forEach((funct) => funct.call(this));
    for (const preview of slidePreviewHelds) { preview.solidifySize(); }
  }
  resizingSlides = false;
  $("body").css("cursor", "");
}

$("body").mousemove((ev) => {
  if (!resizingSlides) return;
  
  const newWidth = (ev.pageX < 50) ? 6 : Math.min(Math.max(ev.pageX + 3, 200), window.innerWidth - 200);
  $("#slides-side").css("width", newWidth);

  const previewWidth = newWidth - 6;
  for (const preview of slidePreviewHelds) { preview.setSize(previewWidth); }
  doResizes.forEach(funct => { funct.call(this, ev,newWidth) });
});

export class SlidePreview {
  constructor({
    index=0,
    name="",
    slide
  }) {
    new Transition(slide);

    const container = $("#previews-holder");

    this.slideIndex = index;
    this.slideName = name;
    this.prevChars = 0;
    
    this.slide = slide;

    this.el = $(`<div class=\"slide-preview-containers\"></div>`);
    this.slideIndexTxt = $("<div class=\"slide-numbers\"></div>");
    this.slideNameTxt = $("<div class=\"slide-names\"></div>")
    this.preview = $("<canvas class=\"slide-previews\"></canvas>");

    
    this.el.append(this.preview);
    this.el.append(this.slideIndexTxt);
    this.el.append(this.slideNameTxt);
    container.append(this.el)
    slidePreviews.push(this);
    slidePreviewHelds.push(this);
    
    this.ctx = this.preview.get(0).getContext("2d");
    this.setSize(container.width() - 6);
    this.solidifySize();

    this.el.click(() => {
      if (currentSlide != null) currentSlide.deselect();
      this.select();
      currentSlide = this;

      doSlideChanges.forEach(funct => { funct(currentSlide); });
    });

    if (currentSlide == null) { this.el.click(); }
  }
  setSize(elWidth=null) {
    const prWidth = elWidth - 30;
    
    this.preview.css("width", prWidth);
    this.preview.css("height", prWidth / aspectRatio);
    this.el.css("width", elWidth);
    this.el.css("height", this.preview.outerHeight() + 30);

    let characters = Math.round(prWidth * 0.0877)-1;
    if (characters != this.prevChars) {
      this.prevChars = characters;
      
      const maxIndexLen = (this.slideName.length == 0) ? characters : characters - 5;
      let index = this.slideIndex.toString();
      if (index.length > maxIndexLen) {
        index = "…" + index.substring(index.length-maxIndexLen+1)
        characters = 5;
      }
      else characters -= index.length;
      this.slideIndexTxt.text(index);

      characters -= 2;
      let name = this.slideName
      if (name.length > characters) {
        name = name.substring(0,characters) + "…";
      }
      this.slideNameTxt.text(name);
    }
  }
  solidifySize() {
    const width = this.preview.width();

    this.preview.attr("width", width);
    this.preview.attr("height", width / aspectRatio);
    this.preview.css("width", "");
    this.preview.css("height", "")

    this.slide.setContext({
      ctx: this.ctx,
      scale: {
        "x": this.preview.width() / (spacing.x * cols),
        "y": this.preview.height() / (spacing.y * rows),
      }
    });

    this.slide.render();
  }
  select() { this.el.attr("selected", "1"); }
  deselect() { this.el.removeAttr("selected"); }
}

export class AddSlide {
  constructor() {
    const container = $("#slides-side");

    this.el = $(`<div class=\"slide-preview-containers adders\"></div>`);
    this.preview = $("<div class=\"slide-adders\"><div class=\"slide-adders-plus\">+</div></div>");
    this.title = $("<div class=\"slide-adder-titles\">Add Slide</div>")

    this.el.append(this.preview);
    this.el.append(this.title)
    container.append(this.el);
    slidePreviewHelds.push(this);

    this.setSize(container.width() - 6);
    this.solidifySize();

    this.el.click(() => {
      new Slide({});
    });
  }
  setSize(elWidth=null) {
    this.el.css("width", elWidth);
    this.el.css("height", elWidth / aspectRatio + 20);
    this.preview.css("width", elWidth);
    this.preview.css("height", elWidth / aspectRatio);
    
    const charWidth = elWidth * 4/6;
    const charHeight = (elWidth * 2/3) / aspectRatio;
    this.preview.css("font-size", Math.min( charHeight, charWidth, 100 ));
  }
  solidifySize() {} // here just to prevent errors
}

const transitionTypes = {
  "default": "DEFAULT",
  "row": "ROW",
  "col": "COLUMN"
}

export class Transition {
  constructor(slide) {
    this.slide = slide;

    const container = $("#previews-holder");
    this.el = $(`<div class=\"slide-preview-containers transitions\"></div>`);
    this.preview = $("<select type=\"\" class=\"slide-transitions\"></select>");
    this.title = $("<div class=\"slide-transition-titles\">TRANSITION</div>")

    for (let i in transitionTypes) {
      this.preview.append($(`<option value=\"${i}\">${transitionTypes[i]}</option>`));
    }

    const transitionClass = slide.animation.split("{")[0];
    this.preview.val(transitionClass);
    this.ontransitionchange();

    this.el.append(this.preview);
    this.el.append(this.title)
    container.append(this.el);
    slidePreviewHelds.push(this);

    this.setSize(container.width() - 6);
    this.solidifySize();

    this.preview.on("focus", () => { this.el.get(0).classList.add("hovers"); });
    this.preview.on("blur", () => { this.el.get(0).classList.remove("hovers"); });
    this.preview.on("change", () => { this.ontransitionchange() });
  }
  setSize(elWidth=null) {
    this.el.css("width", elWidth);
  }
  solidifySize() {} // here just to prevent errors
  ontransitionchange() {
    const val = this.preview.val();
    if (val == "default") this.title.text("TRANSITION");
    else this.title.text(transitionTypes[val]);

    this.slide.animation = val;
    this.preview.blur();

    madeChange();
  }
}

export function setResolution(res) {
  aspectRatio = res.x / res.y;
  cols = res.x / spacing.x;
  rows = res.y / spacing.y;

  const width = $("#slides-side").width() - 6;
  for (const preview of slidePreviewHelds) {
    preview.setSize(width);
    preview.solidifySize();
  }
}

new AddSlide();