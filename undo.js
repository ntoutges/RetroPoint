import * as slides from "./slides.js";

export var changeSinceSave = false;

const undoStackHeight = 10;
const undoStack = [];

const pushCounterLimit = 20;
const pushTimeoutLimit = 500;

var pushCounter = 0;
var timeout = null;

export function madeChange() { changeSinceSave = true; }
export function madeSave() { changeSinceSave = false; }

export function limitedPushToUndoStack(override=false) {
  if (override) pushCounter = pushCounterLimit+1;
  
  if (pushCounter == 0) pushToUndoStack();
  pushCounter++;
  
  if (timeout != null) clearTimeout(timeout);
  if (!override) {
    timeout = setTimeout(() => { // reset 0.5s timer
      pushCounter = 0;
      timeout = null;
    }, pushTimeoutLimit);
  }
  if (pushCounter > pushCounterLimit) {
    if (timeout != null) {
      clearTimeout(timeout);
      timeout = null;
    }
    pushCounter = 0;
  }
}

export function pushToUndoStack() {
  changeSinceSave = true;
  if (undoStack.length >= undoStackHeight) undoStack.splice(0,1); // remove "top" of stack
  undoStack.push({
    i: slides.slides.indexOf(slides.currentSlide),
    txt: slides.currentSlide.screen.slice(), // copy text
    cursor: slides.currentSlide.cursor
  });
}

export function pullFromUndoStack() {
  if (pushCounter != 0) limitedPushToUndoStack(true);

  if (undoStack.length == 0) return;
  const undo = undoStack.pop(); // pull from "bottom" of stack
  const slide = slides.slides[undo.i]
  slide.screen = undo.txt;
  slide.cursor = undo.cursor;
  slide.moveCursor(0);
  slide.render();

}