const $ = window.$;
import { canvas } from "./editor.js";
import * as previews from "./previews.js";
import * as slides from "./slides.js";
import { changeCharset, spacing } from "./graphics.js";
import * as present from "./present.js";

// changeCharset("PETSCII")

const resolution = {
  x: 40 * spacing.x,
  y: 8 * spacing.y
};

const aspectRatio = resolution.x / resolution.y;

slides.setResolution(resolution);
present.setResolution(resolution);

doResize(null, 200);
doCanvasResize();
previews.onResize(doResize);
previews.onFinishResize(doCanvasResize);
function doResize(ev, rightBorder) {
  const newWidth = $("body").width() - rightBorder;
  $("#slide-editor-container").css("width", newWidth);
  $("#slide-editor-container").css("left", rightBorder);

  let editorWidth = newWidth - 20;
  let editorHeight = $("#slide-editor-container").height() - 20;

  if (editorWidth / aspectRatio > editorHeight) editorWidth = editorHeight * aspectRatio;
      else editorHeight = editorWidth / aspectRatio;

  $("#slide-editor").css("width", editorWidth);
  $("#slide-editor").css("height",  editorHeight);
}

function doCanvasResize() {
  const newWidth = $("#slide-editor").width();
  
  $("#slide-editor").css("width", "");
  $("#slide-editor").css("height", "");
  $("#slide-editor").attr("width", newWidth);
  $("#slide-editor").attr("height",  newWidth / aspectRatio);
}

let isMouseDown = false;
canvas.mousedown((e) => {
  slides.currentSlide.onmousedown(e, $("#slide-editor"));
  isMouseDown = true;
});
canvas.mouseup((e) => { isMouseDown = false; });
canvas.mousemove((e) => {
  if(isMouseDown) slides.currentSlide.onmousedrag(e, $("#slide-editor"));
});

// garbage test
// setInterval(() => {
//   const aChars = ".,wW ";
//   var chars = [];
//   for (var i = 0; i < slides.currentSlide.area; i++) {
//     chars.push(aChars[Math.floor(Math.random() * aChars.length)]);
//   }
//   slides.currentSlide.screen = chars;
// }, 1000)

const undoStackHeight = 10;
const undoStack = [];

const pushCounterLimit = 20;
const pushTimeoutLimit = 500;

var pushCounter = 0;
var timeout = null;
function limitedPushToUndoStack(override=false) {
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

function pushToUndoStack() {
  if (undoStack.length >= undoStackHeight) undoStack.splice(0,1); // remove "top" of stack
  undoStack.push({
    i: slides.slides.indexOf(slides.currentSlide),
    txt: slides.currentSlide.screen.slice() // copy text
  });
}

function pullFromUndoStack() {
  if (pushCounter != 0) limitedPushToUndoStack(true);

  if (undoStack.length == 0) return;
  const undo = undoStack.pop(); // pull from "bottom" of stack
  slides.slides[undo.i].screen = undo.txt;
  slides.slides[undo.i].render();
}



const translations = {
  "+Enter": "\n",
  "!ArrowLeft": "<-",
  "!ArrowRight": "->",
  "!ArrowUp": "|^",
  "!ArrowDown": "|v"
}

var isInsert = false;
window.addEventListener("keydown", (e) => {
  if (present.isPresenting) return;

  var key = e.key;
  var isPrintable = true;
  var translation = "";
  if (key.length != 1 || e.ctrlKey) {
    translation = (e.shiftKey ? "+" : "") + (e.ctrlKey ? "^" : "") + (e.altKey ? "!" : "") + e.key;
    if (translation in translations) key = translations[translation];
    else isPrintable = false;
  }

  if (isPrintable) {
    limitedPushToUndoStack();
    slides.currentSlide.onkeypress(key, isInsert);
    return;
  }

  const change = runCommand(translation, e);
  if (change) limitedPushToUndoStack();
});

function runCommand(translation, e) {
  const slide = slides.currentSlide;
  switch (translation) {
    case "Enter":
      slide.nextLine();
      return true;

    case "Delete":
    case "+Delete":
      slide.cursor++;
      slide.removeKey(isInsert);
      slide.blinkCursor();
      return true;
    case "Backspace":
    case "+Backspace":
      slide.removeKey(isInsert);
      return true;
    case "^Backspace":
      slide.removeWord(isInsert);
      return true;
    case "Tab":
      e.preventDefault();
      slide.moveTab(isInsert, 3);
      return true;

    case "^a":
      e.preventDefault();
      slide.moveCursor(Number.MIN_SAFE_INTEGER);
      slide.moveHighlight(Number.MAX_SAFE_INTEGER);
      return false;
    case "^x":
      e.preventDefault();
      runCommand("^c", e);
      slide.removeWord(isInsert);
      return true;
    case "^c":
      e.preventDefault();
      const chars = slide.getHighlightedText();
      for (let i in chars) {
        if (chars[i].length != 1) chars[i] = `\x18${chars[i]}\x18`; // this 'character' is represented by multiple characters
      }
      navigator.clipboard.writeText(chars.join(""));
      return false;
    case "^v":
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        let inMultiChar = false;
        let currentChar = "";
        text = text.replace(/\r/g, ""); // this character is effectively useless, and likely to only cause errors on windows
        for (let i = 0; i < text.length; i++) {
          if (text[i] == "\x18") {
            inMultiChar = !inMultiChar;
          }
          else { currentChar += text[i]; }
          if (!inMultiChar) {
            if (currentChar == "\n") slide.nextLine(true);
            else slide.onkeypress(
              currentChar,
              isInsert,
              i == text.length-1
            );
            currentChar = "";
          }
        }
      });
      return true;
    case "^z":
      e.preventDefault();
      pullFromUndoStack();
      return false;

    case "ArrowUp":
      slide.moveCursor(-slides.cols);
      break;
    case "ArrowDown":
      slide.moveCursor(slides.cols);
      break;
    case "ArrowRight":
      slide.moveCursor(1);
      break;
    case "ArrowLeft":
      slide.moveCursor(-1);
      break;
    case "+ArrowUp":
      slide.moveHighlight(-slides.cols);
      break;
    case "+ArrowDown":
      slide.moveHighlight(slides.cols);
      break;
    case "+ArrowRight":
      slide.moveHighlight(1);
      break;
    case "+ArrowLeft":
      slide.moveHighlight(-1);
      break;
    case "^ArrowUp":
      slide.moveCursor(-Infinity);
      break;
    case "^ArrowDown":
      slide.moveCursor(Infinity);
      break;
    case "^ArrowRight":
      slide.moveCursor(Infinity);
      break;
    case "^ArrowLeft":
      slide.moveCursor(-Infinity);
      break;
    case "+^ArrowUp":
      slide.moveHighlight(-Infinity);
      break;
    case "+^ArrowDown":
      slide.moveHighlight(Infinity);
      break;
    case "+^ArrowRight":
      slide.moveHighlight(Infinity);
      break;
    case "+^ArrowLeft":
      slide.moveHighlight(-Infinity);
      break;
    
    case "Insert":
      isInsert = !isInsert;
      slide.cursorType = isInsert ? [ "< =", "= >", 0 ] : ["<=", "=>", 0]
      slide.moveCursor(0);
      slide.moveHighlight(0);
      return false;
    default:
      console.log(translation)
      return false;
  }
}

new slides.Slide({ animation: "row" + JSON.stringify({ step:2, delay: 50 }) });
new slides.Slide({ animation: "inOut{\"type\":\"row\"}" })
new slides.Slide({})

$("#toPresent").click(present.enterFullScreen)