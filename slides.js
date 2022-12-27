import * as previews from "./previews.js";
import { bitmaps, spacing } from "./graphics.js";

previews.onSlideChange((slide) => {
  previousSlide = currentSlide;
  currentSlide = slides[slide.slideIndex];
  doSlideChange();
  // currentSlide?.render();
});

const CURSOR_FLASH_TIME = 700;

var previousSlide = null;
export var currentSlide = null;

const slides = [];
var slideCount = 0;

const doSlideChanges = [];
export function onSlideChange(funct) { doSlideChanges.push(funct); }
function doSlideChange() {
  if (currentSlide == null) return;
  doSlideChanges.forEach(func => { func(previousSlide) });
}

export class Slide {
  constructor({
    screen = [],
    cols = 40,
    rows = 25
  }) {
    this.screen = screen;
    this.cols = cols;
    this.rows = rows;
    this.area = cols * rows;

    this.cursor = 0;
    this.cursorType = [ "<=", "=>", 0 ];
    this.highlight = -2;

    this.contexts = [];
    this.scales = [];

    this.preview = new previews.SlidePreview({
      index: slideCount++,
      slide: this
    });

    this.cursorToggleTime = 0;
    this.cursorEN = true;

    slides.push(this);
    if (currentSlide == null) {
      currentSlide = this;
      doSlideChange();
    }

    // fill [screen] with ""
    for (let i = screen.length; i < this.area; i++) {
      this.screen.push(" ");
    }
  }
  render() {
    for (let c in this.contexts) {
      const ctx = this.contexts[c];
      const scale = this.scales[c];

      const toRender = this.screen.slice();
      if (this.cursorEN) {
        if (this.highlight >= 0) {
          const min = Math.min(this.highlight, this.cursor);
          const max = Math.max(this.highlight, this.cursor);
          toRender.splice(min - this.cursorType[2], 1, this.cursorType[1]);
          toRender.splice(max + this.cursorType[2], 1, this.cursorType[0])
        }
        else toRender.splice(this.cursor + this.cursorType[2], 1, this.cursorType[0]);
      }
      
      ctx.beginPath();
      ctx.clearRect(0,0, Math.ceil(this.cols*scale.x * spacing.x), Math.ceil(this.rows*scale.y * spacing.y));
      for (let i in toRender) {
        this.renderChar(
          toRender[i],
          i % this.cols,
          Math.floor(i / this.cols),
          ctx, scale
        );
      }
      ctx.fill();
    }
  }
  renderChar(char, offX,offY, ctx, scale) {
    const bitmap = (char in bitmaps) ? bitmaps[char] : bitmaps["unknown"];
    for (let y in bitmap) {
      for (let x in bitmap[y]) {
        if (bitmap[y][x] != " ") ctx.rect(((spacing.x*offX) + +x) * scale.x, ((spacing.y*offY) + +y) * scale.y, scale.x,scale.y);
      }
    }
  }

  clearChar(offX,offY) {
    for (let c in this.contexts) {
      const ctx = this.contexts[c];
      const scale = this.scales[c];
      ctx.clearRect(Math.floor(spacing.x*offX*scale.x), Math.floor(spacing.y*offY*scale.y), Math.ceil(spacing.x*scale.x), Math.ceil(spacing.y*scale.y));
    }
  }
  reRenderChar(screenIndex) {
    let char = this.screen[screenIndex];
    if (this.cursorEN) {
      if (this.highlight >= 0) {
        if ((this.cursor + this.cursorType[2] == screenIndex && this.cursor > this.highlight) || (this.highlight - this.cursorType[2] == screenIndex && this.highlight > this.cursor)) char = this.cursorType[0]; 
        else if ((this.cursor + this.cursorType[2] == screenIndex && this.cursor < this.highlight) || (this.highlight - this.cursorType[2] == screenIndex && this.highlight < this.cursor)) char = this.cursorType[1];
      }
      else if (screenIndex == this.cursor + this.cursorType[2]) char = this.cursorType[0];
    }
    const offY = Math.floor(screenIndex / this.cols);
    const offX = screenIndex % this.cols;
    
    this.clearChar(offX, offY);
    if (screenIndex >= this.screen.length && screenIndex != this.cursor) return;
    
    for (let c in this.contexts) {
      const ctx = this.contexts[c];
      const scale = this.scales[c];
      
      ctx.beginPath();
      this.renderChar(
        char, offX,offY,
        ctx,scale
      );
      ctx.fill();
    }
  }

  addContext(ctxScale) {
    this.contexts.push(ctxScale.ctx);
    this.scales.push(ctxScale.scale);
  }
  setContext(ctxScale) {
    const i = this.contexts.indexOf(ctxScale.ctx);
    if (i != -1) this.scales.splice(i,1, ctxScale.scale);
    else {
      this.contexts.push(ctxScale.ctx);
      this.scales.push(ctxScale.scale);
    }
  }
  removeContext(ctx) {
    const i = this.contexts.indexOf(ctx);
    if (i != -1) {
      this.contexts.splice(i,1);
      this.scales.splice(i,1);
    }
  }

  onmousedown(event, element) {
    this.cursorToggleTime = (new Date).getTime() + CURSOR_FLASH_TIME;
    this.cursorEN = true;
    
    const oldCursor = this.cursor;
    this.cursor = this.getClickCharacter(event,element)
    this.reRenderChar(oldCursor);
    this.reRenderChar(this.cursor);

    if (this.highlight >= 0) this.removeHighlight();
  }

  onmousedrag(event, element) {
    this.cursorToggleTime = (new Date).getTime() + CURSOR_FLASH_TIME;
    this.cursorEN = true;
    
    const oldHighlight = this.highlight;
    this.highlight = this.getClickCharacter(event,element)

    this.reRenderChar(oldHighlight);
    
    if (this.highlight == this.cursor) this.highlight = -2;
    else this.reRenderChar(this.highlight);
    this.reRenderChar(this.cursor); // render cursor in the right direction
  }

  getClickCharacter(event, element) {
    const bounds = element.get(0).getBoundingClientRect();
    const x = Math.floor(this.cols * (event.pageX - bounds.left) / element.width());
    const y = Math.floor(this.rows * (event.pageY - bounds.top) / element.height());
    return x + y*this.cols;
  }

  onkeypress(key, isInsert) {
    if (this.highlight >= 0) this.removeKey(isInsert, true);

    if (isInsert) this.screen[this.cursor] = key;
    else {
      let removedOne = false;
      for (let nextLine = (Math.floor(this.cursor / this.cols) + 1) * this.cols; nextLine < this.area; nextLine += this.cols) {
        if (nextLine >= this.area || (this.screen[nextLine-1] == " " && this.screen[nextLine] == " ")) { // remove trailing space
          this.screen.splice(nextLine,1);
          removedOne = true;
          break;
        }
      }
      if (!removedOne) this.screen.splice(this.area-1,1); // remove bottom-right character
      this.screen.splice(this.cursor,0, key);
    }
    this.cursorToggleTime = (new Date).getTime() + CURSOR_FLASH_TIME;
    this.cursorEN = true;

    this.moveCursor(1);
    this.render();
  }

  nextLine() {
    let endPos = this.cursor + this.cols;
    // if (this.cursor+1 < this.area && this.screen[this.cursor + 1] != " ") endPos -= this.cursor % this.cols; // reset at left margin

    for (let i = this.cursor; i < endPos; i++) { this.screen.splice(this.cursor,0," "); }
    if (this.screen.length > this.area) this.screen.splice(this.area, this.screen.length - this.area);

    this.cursorToggleTime = (new Date).getTime() + CURSOR_FLASH_TIME;
    this.cursorEN = true;

    this.moveCursor(endPos - this.cursor);
    this.render();
  }

  removeKey(isInsert, doRender=true) {
    if (this.highlight >= 0) {
      const min = Math.min(this.highlight, this.cursor) + 2;
      const max = Math.max(this.highlight, this.cursor);
      
      this.cursor = max;

      this.removeHighlight();
      for (let i = min; i < max; i++) { this.removeKey(isInsert, false); }
      this.render();
    }
    
    this.moveCursor(-1);
    if (isInsert) {
      this.screen[this.cursor] = " ";
    }
    else {
      let addedOne = false;
      for (let nextLine = (Math.floor(this.cursor / this.cols) + 1) * this.cols; nextLine < this.area; nextLine += this.cols) {
        if (nextLine >= this.area || (this.screen[nextLine-1] == " " && this.screen[nextLine] == " ")) { // remove trailing space
          this.screen.splice(nextLine,0, " ");
          addedOne = true;
          break;
        }
      }
      if (!addedOne) this.screen.splice(this.area,0, " "); // remove bottom-right character

      this.screen.splice(this.cursor, 1);
      if (doRender) this.render();
    }
  }
  removeWord() { // ctrl-backspace
    
  }

  moveTab(isInsert, step=4) {
    let y = Math.floor(this.cursor / this.cols);
    let x = (this.cursor - y) % step;
    for (let i = 0; i < step - x; i++) {
      this.onkeypress(" ", isInsert)
    }
  }

  moveCursor(step) {
    this.cursorToggleTime = (new Date).getTime() + CURSOR_FLASH_TIME;
    this.cursorEN = true;

    if (!Number.isFinite(step)) {
      const finiteStep = Math.sign(step);
      let oldCursor = this.cursor;
      this.cursor += finiteStep;
      this.reRenderChar(oldCursor + this.cursorType[2]);

      const spaceInvert = this.screen[this.cursor] == " ";
      while (oldCursor != this.cursor && this.cursor >= 0 && this.cursor < this.area-1) {
        oldCursor = this.cursor;
        this.cursor += finiteStep;
        if (spaceInvert ^ this.screen[this.cursor] == " ") { break; }
      }
      // this.moveCursor(-finiteStep);
      if (step < 0) this.cursor++;
      this.moveCursor(0);
      return;
    }

    if (step != 0 && this.highlight >= 0) {
      this.removeHighlight(step);
      return;
    }
    
    const oldCursor = this.cursor;
    this.cursor += step;
    if (this.cursor < 0) this.cursor = 0;
    else if (this.cursor >= this.area) this.cursor = this.area-1;

    this.reRenderChar(oldCursor + this.cursorType[2]);
    if (oldCursor != this.cursor) {
      this.reRenderChar(this.cursor + this.cursorType[2]);
    }
  }

  moveHighlight(step) {
    const oldHighlight = this.highlight;
    if (this.highlight == -2 && step != 0) {
      if (step > 0) {
        this.cursor -= 2;
        this.highlight = this.cursor + 1;
      }
      else {
        this.highlight = this.cursor - 1;
      }
    }

    this.highlight += step;
    if (this.highlight < -1) this.highlight = -1;
    else if (this.highlight > this.area) this.highlight = this.area;
    
    this.cursorToggleTime = (new Date).getTime() + CURSOR_FLASH_TIME;
    this.cursorEN = true;

    this.reRenderChar(oldHighlight - this.cursorType[2])
    if (oldHighlight != this.highlight) {
      this.reRenderChar(this.highlight - this.cursorType[2]);
    }
    this.moveCursor(0);
  }

  removeHighlight(step=0) {
    const oldHighlight = this.highlight;
    this.highlight = -2;
    this.reRenderChar(oldHighlight);

    if (step == 0) return;

    const oldCursor = this.cursor;
    this.cursor = (step > 0) ? Math.max(oldHighlight, this.cursor) : Math.min(oldHighlight, this.cursor) + 2;
    this.reRenderChar(oldCursor);
    this.reRenderChar(this.cursor);
  }

  runCursor() {
    const time = (new Date).getTime()
    if (time > this.cursorToggleTime) {
      this.cursorToggleTime = time + CURSOR_FLASH_TIME;
      this.cursorEN = !this.cursorEN;
      this.reRenderChar(this.cursor);
      if (this.highlight >= 0) this.reRenderChar(this.highlight);
    }
  }
}
