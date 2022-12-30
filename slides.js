import * as previews from "./previews.js";
import { bitmaps, spacing } from "./graphics.js";

// prevent errors
setTimeout(() => {
  previews.onSlideChange((slide) => {
    if (slides.length == 0) return;
    previousSlide = currentSlide;
    currentSlide = slides[slide.slideIndex];
    doSlideChange();
    
    if (previousSlide) {
      previousSlide.cursorEN = false;
      previousSlide.render();
    }
    if (currentSlide) { currentSlide.blinkCursor(); }
  });
}, 0);

export var cols = 1;
export var rows = 1;
var area = 1;

const CURSOR_FLASH_TIME = 700;
const CURSOR_BLINK_TIME = 200;

var previousSlide = null;
export var currentSlide = null;

export const slides = [];
var slideCount = 0;

const doSlideChanges = [];
export function onSlideChange(funct) { doSlideChanges.push(funct); }
function doSlideChange() {
  if (currentSlide == null) return;
  doSlideChanges.forEach(func => { func(previousSlide) });
}

export class BasicSlide {
  constructor({
    screen = [],
    animation = "default"
  }) {
    this.screen = screen;
    this.animation = animation;

    this.contexts = [];
    this.scales = [];

    this.cursorEN = false;
    this.applyResize();
  }
  applyResize() { // fill [screen] with " "
    for (let i = this.screen.length; i < area; i++) { this.screen.push(" "); }
  }
  render() {
    for (let c in this.contexts) {
      const ctx = this.contexts[c];
      const scale = this.scales[c];

      const toRender = this.screen.slice();
      
      if (this.cursorEN) {
        if (this.highlight != -2) {
          const min = Math.min(this.highlight, this.cursor);
          const max = Math.max(this.highlight, this.cursor);
          toRender.splice(min - this.cursorType[2], 1, this.cursorType[1]);
          toRender.splice(max + this.cursorType[2], 1, this.cursorType[0]);
        }
        else toRender.splice(this.cursor + this.cursorType[2], 1, this.cursorType[0]);
      }
      
      ctx.beginPath();
      ctx.clearRect(0,0, Math.ceil(cols*scale.x * spacing.x), Math.ceil(rows*scale.y * spacing.y));
      for (let i in toRender) {
        this.renderChar(
          toRender[i],
          i % cols,
          Math.floor(i / cols),
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
        if ((this.cursor + this.cursorType[2] == screenIndex && this.cursor >= this.highlight) || (this.highlight - this.cursorType[2] == screenIndex && this.highlight >= this.cursor)) char = this.cursorType[0]; 
        else if ((this.cursor + this.cursorType[2] == screenIndex && this.cursor < this.highlight) || (this.highlight - this.cursorType[2] == screenIndex && this.highlight < this.cursor)) char = this.cursorType[1];
      }
      else if (screenIndex == this.cursor + this.cursorType[2]) char = this.cursorType[0];
    }
    const offY = Math.floor(screenIndex / cols);
    const offX = screenIndex % cols;
    
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
  renderLines(topLine, bottomLine) { // inclusive,exclusive
    const topIndex = topLine * cols;
    const bottomIndex = bottomLine * cols
    
    const toRender = this.screen.slice(topIndex, bottomIndex);
    if (this.cursorEN) {
      if (this.highlight >= 0) {
        const min = Math.min(this.highlight, this.cursor);
        const max = Math.max(this.highlight, this.cursor);
        toRender.splice(min - this.cursorType[2] - topIndex, 1, this.cursorType[1]);
        toRender.splice(max + this.cursorType[2] - topIndex, 1, this.cursorType[0])
      }
      else toRender.splice(this.cursor + this.cursorType[2] - topIndex, 1, this.cursorType[0]);
    }

    for (let c in this.contexts) {
      const ctx = this.contexts[c];
      const scale = this.scales[c];
      
      ctx.beginPath();
      ctx.clearRect(0,topLine*scale.y*spacing.y, cols*scale.x*spacing.x, (bottomLine-topLine)*scale.y*spacing.y);
      for (let i = topIndex; i < bottomIndex; i++) {
        this.renderChar(
          toRender[i-topIndex],
          i % cols,
          Math.floor(i / cols),
          ctx,
          scale
        )
      }
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
    const x = Math.floor(cols * (event.pageX - bounds.left) / element.width());
    const y = Math.floor(rows * (event.pageY - bounds.top) / element.height());
    return x + y*cols;
  }

  onkeypress(key, isInsert, doRender=true) {
    if (this.highlight >= 0) this.removeKey(isInsert, true);

    if (isInsert) this.screen[this.cursor] = key;
    else {
      let topLineUpdated = Math.floor(this.cursor / cols);
      let bottomLineUpdated = rows;

      let removedOne = false;
      for (let nextLine = (Math.floor(this.cursor / cols) + 1) * cols; nextLine < area; nextLine += cols) {
        if (nextLine >= area || (this.screen[nextLine-1] == " " && this.screen[nextLine] == " ")) { // remove trailing space
          this.screen.splice(nextLine,1);
          removedOne = true;
          bottomLineUpdated = Math.floor(nextLine / cols);
          break;
        }
      }
      if (!removedOne) this.screen.splice(area-1,1); // remove bottom-right character
      this.screen.splice(this.cursor,0, key);

      if (doRender) this.renderLines(topLineUpdated, bottomLineUpdated);
    }
    
    this.cursorToggleTime = (new Date).getTime() + CURSOR_FLASH_TIME;
    this.cursorEN = true;

    const oldCursor = this.cursor;
    this.moveCursor(1);
    if (oldCursor == area-1) { this.blinkCursor(); }
  }

  nextLine(reset=false) {
    let endPos = this.cursor + cols;
    // if (this.cursor+1 < area && this.screen[this.cursor + 1] != " ") endPos -= this.cursor % cols; // reset to left margin
    if (reset) endPos -= this.cursor % cols; // reset to left margin

    for (let i = this.cursor; i < endPos; i++) { this.screen.splice(this.cursor,0," "); }
    if (this.screen.length > area) this.screen.splice(area, this.screen.length - area);

    this.cursorToggleTime = (new Date).getTime() + CURSOR_FLASH_TIME;
    this.cursorEN = true;

    this.moveCursor(endPos - this.cursor);
    this.render();
  }

  removeKey(isInsert, doRender=true) {
    this.cursorToggleTime = (new Date).getTime() + CURSOR_FLASH_TIME;
    this.cursorEN = true;

    if (this.highlight != -2) {
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
      this.reRenderChar(this.cursor);
    }
    else {
      let topLineUpdated = Math.floor(this.cursor / cols);
      let bottomLineUpdated = topLineUpdated + 1;

      let addedOne = false;
      for (let nextLine = (Math.floor(this.cursor / cols) + 1) * cols; nextLine < area; nextLine += cols) {
        if (nextLine >= area || (this.screen[nextLine-1] == " " && this.screen[nextLine] == " ")) { // remove trailing space
          this.screen.splice(nextLine,0, " ");
          bottomLineUpdated = Math.floor(nextLine / cols);
          addedOne = true;
          break;
        }
      }
      if (!addedOne) {
        this.screen.splice(area,0, " "); // remove bottom-right character
        bottomLineUpdated = rows;
      }

      this.screen.splice(this.cursor, 1);
      if (doRender) this.renderLines(topLineUpdated, bottomLineUpdated);
    }
  }
  removeWord(isInsert) { // ctrl-backspace
    this.moveHighlight(-Infinity);
    this.removeKey(isInsert);
  }

  moveTab(isInsert, step=4) {
    let y = Math.floor(this.cursor / cols);
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
      while (oldCursor != this.cursor && this.cursor >= 0 && this.cursor < area-1) {
        oldCursor = this.cursor;
        this.cursor += finiteStep;
        if (spaceInvert ^ this.screen[this.cursor] == " ") { break; }
      }
      // this.moveCursor(-finiteStep);
      if (step < 0) this.cursor++;
      this.moveCursor(0);
      return;
    }

    if (step != 0 && this.highlight > -2) {
      this.removeHighlight(step);
      this.moveCursor(0);
      return;
    }
    
    const oldCursor = this.cursor;
    this.cursor += step;

    if (this.highlight == -2 && this.cursor < 0) this.cursor = 0;
    else if (this.highlight != -2 && this.cursor < -1) this.cursor = -1;
    else if (this.highlight == -2 && this.cursor < -1) this.cursor = -1;
    else if (this.cursor >= area) this.cursor = area-1;

    this.reRenderChar(oldCursor + this.cursorType[2]);
    if (oldCursor != this.cursor) {
      this.reRenderChar(this.cursor + this.cursorType[2]);
    }
  }

  moveHighlight(step) {
    const oldHighlight = this.highlight;
    
    if (this.highlight == -2 && step == 0) return;
    if (this.highlight == -2) {
      this.highlight = -3;
      if (step > 0) {
        this.moveCursor(-2);
        this.highlight = this.cursor + 1;
      }
      else {
        this.highlight = this.cursor - 1;
      }
    }

    if (!Number.isFinite(step)) {
      const finiteStep = Math.sign(step);
      let oldHighlight = this.highlight;
      this.highlight += finiteStep;
      this.reRenderChar(oldHighlight - this.cursorType[2]);

      const spaceInvert = this.screen[this.highlight] == " ";
      while (oldHighlight != this.highlight && this.highlight > -1 && this.highlight <= area) {
        oldHighlight = this.highlight;
        this.highlight += finiteStep;
        if (spaceInvert ^ this.screen[this.highlight] == " ") { break; }
      }
      this.moveHighlight(0);
      return;
    }

    this.highlight += step;
    if (this.highlight < -1) this.highlight = -1;
    else if (this.highlight > area) this.highlight = area;
    
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
    this.cursor = (step > 0) ? Math.max(oldHighlight, this.cursor) : Math.min(oldHighlight, this.cursor) + 1;
    this.reRenderChar(oldCursor);
    this.reRenderChar(this.cursor);
  }

  charsToString(chars=this.screen) {
    let str = "";
    let workingChar = null;
    let workingRepeats = 0;
    for (let i = 0; i < chars.length+1; i++) {
      const char = (i < chars.length) ? chars[i] : null;
      if (char != workingChar) {
        if (workingChar != null) {
          const workingRepeatsHex = workingRepeats.toString(16);
          const escapeSequence = "\x18#" + workingRepeatsHex + "\x18";
          const escapedChar = (workingChar.length != 1) ? `\x18$${workingChar}\x18` : workingChar; // this 'character' is represented by multiple characters
          
          if (workingRepeats < escapeSequence.length+1) for (let i = 0; i < workingRepeats; i++) str += escapedChar;
          else str += escapeSequence + escapedChar;
        }

        workingRepeats = 0;
        workingChar = char;
      }
      
      workingRepeats++;
    }
    return str;
  }

  charsFromString(string) {
    const chars = [];
    
    let repeats = 1;
    let workingChar = "";
    
    for (let i = 0; i < string.length; i++) {
      if (string[i] == "\x18") {
        const substring = string.substring(i+2);
        const endI = substring.indexOf("\x18");
        const data = substring.substring(0,endI);
        switch(string[i+1]) {
          case "#":
            repeats = (endI == -1 || isNaN(parseInt(data, 16))) ? 1 : parseInt(data, 16);
            break;
          case "$":
            workingChar = data;
            break;
        }  
        i += 2 + endI;
      }
      else workingChar = string[i]
      
      if (workingChar.length != 0) {
        for (let i = 0; i < repeats; i++) { chars.push(workingChar); }
        repeats = 1;
        workingChar = "";
      }
    }
    return chars;
  }

  save() {
    const data = {
      "screen": this.charsToString()
    };
    if (this.animation != "default") data.animation = this.animation;
    return JSON.stringify(data);
  }
}

export class Slide extends BasicSlide {
  constructor(params) {
    super(params);
    
    if (!currentSlide) {
      currentSlide = this;
      doSlideChange();
    }

    this.preview = new previews.SlidePreview({
      index: slideCount++,
      slide: this
    });

    slides.push(this);

    this.cursor = 0;
    this.cursorType = [ "<=", "=>", 0 ];
    this.highlight = -2;

    this.cursorToggleTime = 0;
    this.cursorEN = true;
  }

  getHighlightedText() {
    if (this.highlight == -2) return "";
    const min = Math.min(this.cursor, this.highlight) + 1;
    const max = Math.max(this.cursor, this.highlight);
    return this.screen.slice(min,max);
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

  blinkCursor() {
    const time = (new Date).getTime();
    this.cursorToggleTime = time + CURSOR_BLINK_TIME;
    this.cursorEN = false;
    this.reRenderChar(this.cursor);
    if (this.highlight >= 0) this.reRenderChar(this.highlight);
  }
}

export function setResolution(res) {
  cols = res.x / spacing.x;
  rows = res.y / spacing.y;
  area = rows * cols;
  previews.setResolution(res);
}