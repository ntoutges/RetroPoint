const $ = window.$;
import { canvas } from "./editor.js";
import * as previews from "./previews.js";
import * as slides from "./slides.js";
import { changeCharset, spacing } from "./graphics.js";
import * as present from "./present.js";
import * as undo from "./undo.js"

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
    undo.limitedPushToUndoStack();
    slides.currentSlide.onkeypress(key, isInsert);
    return;
  }

  const change = runCommand(translation, e);
  if (change) undo.limitedPushToUndoStack();
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
      slide.removeKey(isInsert);
      return true;
    case "^c":
      e.preventDefault();
      const toCopy = slide.charsToString(slide.getHighlightedText());
      navigator.clipboard.writeText(toCopy);
      return false;
    case "^v":
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const chars = slide.charsFromString(text);
        for (let i in chars) {
          if (chars[i] == "\n") slide.nextLine(true);
          else slide.onkeypress(
            chars[i],
            isInsert,
            i == chars.length-1
          );
        }
      });
      return true;
    case "^z":
      e.preventDefault();
      undo.pullFromUndoStack();
      return false;
    case "^s":
      e.preventDefault();
      saveSlides();
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

function saveSlides() {
  if (!undo.changeSinceSave) return;
  undo.madeSave();
  localStorage.setItem("slideCt", slides.slides.length);
  for (let i in slides.slides) {
    const data = slides.slides[i].save();
    localStorage.setItem(`slide#${i}`, data);
  }
}

setTimeout(() => {
  loadSlides();
}, 100)

function loadSlides() {
  let slideCount = localStorage.getItem("slideCt");
  for (let i = 0; i < slideCount; i++) {
    const data = JSON.parse(localStorage.getItem(`slide#${i}`));
    
    const slide = new slides.Slide({
      animation: data.animation
    });
    slide.screen = slide.charsFromString(data.screen);
    slide.render();
  }
}

// new slides.Slide({ animation: "row" + JSON.stringify({ step:2, delay: 50 }) });
// new slides.Slide({ animation: "inOut{\"type\":\"row\"}" })
// new slides.Slide({})

$("#toPresent").click(present.enterFullScreen)