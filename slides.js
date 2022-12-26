var widgetIds = 0;
var dragging = null;
var didDrag = false;

const editListeners = [];
export function onEdit(func) { editListeners.push(func); }
function didEdit(widget) {
  for (let func of editListeners) { func(widget); }
}

$("body").mousemove((e) => {
  const offset = $("#slide-editor").offset();
  if (dragging !== null) {
    dragging.setPos(
      e.pageX - offset.left,
      e.pageY - offset.top
    );
    didDrag = true;
  }
});
$("body").mouseup((e) => {
  if (dragging !== null) {
    dragging.widget.css("z-index", "");
    const canvas = $("#slide-editor");
    canvas.css("cursor", "");

    const offset = dragging.widget.offset();
    const canvasOff = canvas.offset();
    
    const x = (offset.left - canvasOff.left) / canvas.width()
    const y = (offset.top - canvasOff.top) / canvas.height();

    dragging.pos = { x,y };
    didEdit(dragging);

    dragging = null;
  }
});

export function setEditState(state) { this.isEditable = state; }

function getWidgetId() { return widgetIds++; }

export class Slide {
  constructor({
    widgets = []
  }) {
    this.widgets = {};
    for (let widget of widgets) {
      widgets[widget.id] = widgets;
    }
  }
  addWidget(widget) { this.widgets[widget.id] = widget; }
  removeWidget(widgetId) { delete this.widgets[widgetId]; }
  replaceWidget(widget) {
    if (!(widget.id in this.widgets)) return this.addWidget(widget);
    this.widgets[widget.id].widget.remove();
    this.widgets[widget.id] = widget;
  }
  render(canvas) {
    for (let i in this.widgets) {
      this.widgets[i].render(canvas);
    }
  }
}

// this class shoult be considered as abstract, never use the bare class without setting the 'el' property
export class Widget {
  constructor({
    el = $("<div></div>"),
    x=0, // percent in range [0,1]
    y=0 // percent in range [0,1]
  }) {
    this.pos = { x,y };

    this.isEditable = true;
    this.isEditing = false;
    this.rendered = false;
    this.el = el;
    this.widget = $("<div class=\"widgets\"></div>");
    this.bounding = $("<div class=\"boundings idles\" data-visible=\"0\"></div>");

    this.widget.append(this.el);

    const thisOne = this;
    this.widget.mouseover((e) => { thisOne.mouseover.call(thisOne, e) });
    this.widget.mouseleave((e) => { thisOne.mouseleave.call(thisOne, e) });
    this.widget.click((e) => { thisOne.click.call(thisOne, e) });
    this.widget.mousedown((e) => { thisOne.mousedown.call(thisOne, e); });

    this.id = getWidgetId();
    this.data = {};

    this.dragOffset = { x:0, y:0 }
  }
  render(canvas) {
    this.widget.css("left", this.pos.x * canvas.width());
    this.widget.css("top", this.pos.y * canvas.height());

    const isVisible = this.isVisible(canvas);

    if (isVisible) {
      if (this.isEditable) this.widget.prepend(this.bounding);
      else this.widget.remove();
    }

    if (this.rendered && !isVisible) {
      this.widget.remove();
      this.rendered = false;
    }
    else if (isVisible) {
      canvas.append(this.widget);
      this.rendered = true;
    }
  }
  isVisible(canvas) {
    const left = parseInt(this.widget.css("left"), 10);
    const top = parseInt(this.widget.css("top"), 10);
    return left < canvas.width() && left + this.widget.width() > 0 && top < canvas.height() && top + this.widget.height() > 0;
  }

  mouseover(e) {
    if (this.isEditable && this.bounding.attr("data-visible") == "0") {
      this.bounding.get(0).classList.remove("idles");
      // this.widget.prepend(this.bounding);
      this.bounding.attr("data-visible", "1");
    }
  }
  mouseleave(e) {
    if (this.isEditable && this.bounding.attr("data-visible") == "1" && !this.isEditing) {
      // this.bounding.remove();
      this.bounding.get(0).classList.add("idles");
      this.bounding.attr("data-visible", "0");
    }
  }
  mousedown(e) {
    if (this.isEditing) return;
    const offset = this.widget.offset();
    this.dragOffset.x = e.pageX - offset.left;
    this.dragOffset.y = e.pageY - offset.top;
    this.widget.css("z-index", "999999999"); // bring to front
    dragging = this;
    didDrag = false;
    $("#slide-editor").css("cursor", "move");
  }
  click(e) {
    if (didDrag) return;
    if (this.isEditable) this.edit(e);
  }
  edit() { this.isEditing = true; }
  deEdit() { this.isEditing = false; }

  setPos(x,y) {
    this.widget.css("left", x - this.dragOffset.x);
    this.widget.css("top", y - this.dragOffset.y);
  }
}

export class TextBox extends Widget {
  constructor({
    text="",
    size=16,
    x,
    y
  }) {
    super({ x,y });
    this.el.text(text);
    this.el.get(0).classList.add("textboxes");
    this.el.attr("contenteditable", "true");

    this.data = { text, size };
    
    this.el.blur(this.deEdit.bind(this));
  }

  render(canvas) {
    super.render(canvas);
    const scale = canvas.width() / 1000;
    
    this.widget.css("font-size", this.data.size * scale);
    this.widget.css("padding", 5 * scale);
  }

  edit(e) {
    super.edit();
    this.el.focus();
    this.el.css("pointer-events", "all");
  }
  deEdit() {
    this.data.text = this.el.html();
    super.deEdit();
    this.el.css("pointer-events", "");
    this.mouseleave(null);
    didEdit(this);
  }

  copy() {
    const widget = new TextBox({
      text: this.data.text,
      size: this.data.size,
      x: this.pos.x,
      y: this.pos.y
    });
    widget.id = this.id;
    return widget;
  }
}