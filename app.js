const $ = window.$;
import { canvas } from "./editor.js";
import * as previews from "./previews.js";
import * as slides from "./slides.js";
import { changeCharset } from "./graphics.js";

// changeCharset("PETSCII")

const aspectRatio = 4/3;
previews.setAspectRatio(aspectRatio);

doResize(null, 200);
previews.onResize(doResize);
function doResize(ev, rightBorder) {
  const newWidth = $("body").width() - rightBorder;
  const editorWidth = newWidth - 20;
  $("#slide-editor-container").css("width", newWidth);
  $("#slide-editor-container").css("left", rightBorder);
  $("#slide-editor").attr("width", editorWidth);
  $("#slide-editor").attr("height",  editorWidth / aspectRatio);
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



const translations = {
  "+Enter": "\n",
  "!ArrowLeft": "<-",
  "!ArrowRight": "->",
  "!ArrowUp": "|^",
  "!ArrowDown": "|v"
}

var isInsert = false;
window.addEventListener("keydown", (e) => {
  var key = e.key;
  var isPrintable = true;
  var translation = "";
  if (key.length != 1) {
    translation = (e.shiftKey ? "+" : "") + (e.ctrlKey ? "^" : "") + (e.altKey ? "!" : "") + e.key;
    if (translation in translations) key = translations[translation];
    else isPrintable = false;
  }

  const slide = slides.currentSlide;
  if (isPrintable) {
    slide.onkeypress(key, isInsert);
    return;
  }

  switch (translation) {
    case "Enter":
      slide.nextLine();
      break;

    case "Delete":
    case "+Delete":
      slide.cursor++;
    case "Backspace":
    case "+Backspace":
      slide.removeKey(isInsert);
      break;
    case "^Backspace":
      slide.removeWord();
      break;
    case "Tab":
      e.preventDefault();
      slide.moveTab(isInsert, 3);
      break;

    case "ArrowUp":
      slide.moveCursor(-slide.cols);
      break;
    case "ArrowDown":
      slide.moveCursor(slide.cols);
      break;
    case "ArrowRight":
      slide.moveCursor(1);
      break;
    case "ArrowLeft":
      slide.moveCursor(-1);
      break;
    case "+ArrowUp":
      slide.moveHighlight(-slide.cols);
      break;
    case "+ArrowDown":
      slide.moveHighlight(slide.cols);
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
    
    case "Insert":
      isInsert = !isInsert;
      slide.cursorType = isInsert ? [ "< =", "= >", 0 ] : ["<=", "=>", 0]
      slide.moveCursor(0);
      slide.moveHighlight(0);
      break;
    default:
      console.log(translation)
  }
});

new slides.Slide({});
new slides.Slide({})
new slides.Slide({})
