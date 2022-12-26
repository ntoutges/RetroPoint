import { Slide } from "./slides.js";

var aspectRatio = 16/9;

var slidePreviews = [];
export var currentSlide = null;

var doResizes = [];
var doSlideChanges = [];

export function onResize(funct) { doResizes.push(funct); }
export function onSlideChange(funct) { doSlideChanges.push(funct); }

var resizingSlides = false;
$("#slides-side-resize").mousedown(() => {
  resizingSlides = true;
  $("body").css("cursor", "ew-resize");
});

$("body").mouseup(stopResizingSlides);
// $("body").mouseleave(stopResizingSlides);
function stopResizingSlides() {
  resizingSlides = false;
  $("body").css("cursor", "");
}

$("body").mousemove((ev) => {
  if (!resizingSlides) return;
  
  const newWidth = (ev.pageX < 50) ? 6 : Math.min(Math.max(ev.pageX + 3, 200), window.innerWidth - 200);
  $("#slides-side").css("width", newWidth);

  const previewWidth = newWidth - 6;
  for (const preview of slidePreviews) {
    preview.setSize(previewWidth);
  }
  doResizes.forEach(funct => { funct.call(this, ev,newWidth) });
});

export class SlidePreview {
  constructor({
    index=0,
    name="",
    slide = new Slide({})
  }) {
    this.slide = slide;

    const container = $("#slides-side");

    this.slideIndex = index;
    this.slideName = name;
    this.prevChars = 0;

    this.el = $(`<div class=\"slide-preview-containers\"></div>`);
    this.slideIndexTxt = $("<div class=\"slide-numbers\"></div>");
    this.slideNameTxt = $("<div class=\"slide-names\"></div>")
    this.preview = $("<div class=\"slide-previews\"></div>");

    this.setSize(container.width() - 6);

    this.el.append(this.preview);
    this.el.append(this.slideIndexTxt);
    this.el.append(this.slideNameTxt);
    container.append(this.el)
    slidePreviews.push(this);

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

    this.el.css("width", elWidth);
    this.el.css("height", elWidth / aspectRatio + 20);
    this.preview.css("width", prWidth);
    this.preview.css("height", prWidth / aspectRatio);

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
  select() { this.el.attr("selected", "1"); }
  deselect() { this.el.removeAttr("selected"); }
}

export function setAspectRatio(ratio) {
  aspectRatio = ratio;
}