const $ = window.$;
import * as previews from "./previews.js";
import * as slides from "./slides.js";

const aspectRatio = 16/9;
previews.setAspectRatio(aspectRatio);

var currentSlide = new slides.Slide({});

doResize(null, 200);
previews.onResize(doResize);
function doResize(ev, rightBorder) {
  const newWidth = $("body").width() - rightBorder;
  const editorWidth = newWidth - 20;
  $("#slide-editor-container").css("width", newWidth);
  $("#slide-editor").css("width", editorWidth);
  $("#slide-editor").css("height", editorWidth / aspectRatio);
  $("#slide-editor-container").css("left", rightBorder);
  currentSlide.render($("#slide-editor"));
}

var icons = {};
class Icon {
  constructor({
    name,
    url,
    enableAction = () => {},
    disableAction = () => {},
    editAction = () => {}
  }) {
    name = name.replace(/ /g, "-"); // replace all spaces with dashes

    icons[name] = this;
    this.el = $(`<div id=\"icon-${name}\" class=\"controls-icons\"><img src=\"${url}\"></div>`);
    $("#editor-control-container").append(this.el);

    this.enAct = enableAction;
    this.diAct = disableAction;
    this.active = false;

    this.el.click(this.toggle.bind(this));

    const thisOne = this;
    $("#slide-editor").click(function(event) { if (thisOne.active) editAction.call(thisOne, event); });
  }
  toggle() {
    if (this.active) {
      this.el.get(0).classList.remove("actives");
      this.active = false;
      this.diAct();
    }
    else {
      this.el.get(0).classList.add("actives");
      this.active = true;
      this.enAct();
    }
  }
}

new Icon({
  name: "add-text-box",
  url: "icons/text-box.png",
  enableAction: () => { $("#slide-editor").css("cursor", "text"); },
  disableAction: () => { $("#slide-editor").css("cursor", ""); },
  editAction: function(e) {
    const offset = $("#slide-editor").offset();
    const canvas = $("#slide-editor");

    this.toggle();
    const widget = new slides.TextBox({
      x: (e.pageX - offset.left) / canvas.width(),
      y: (e.pageY - offset.top) / canvas.height()
    });
    currentSlide.addWidget(widget);

    widget.render(canvas);
    widget.widget.click()
  }
});


previews.onSlideChange((slide) => {
  currentSlide = new slides.Slide({});
  $("#slide-editor").html("");
  for (let i in slide.slide.widgets) {
    currentSlide.addWidget(slide.slide.widgets[i].copy());
  }
  currentSlide.render($("#slide-editor"));
});

slides.onEdit((widget) => {
  const copy = widget.copy();
  copy.isEditable = false;
  previews.currentSlide.slide.replaceWidget(copy);
  copy.render(previews.currentSlide.el);
});



new previews.SlidePreview({index: 1, name: "Start"})
new previews.SlidePreview({index: 2})
new previews.SlidePreview({index: 3})