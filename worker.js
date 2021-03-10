importScripts("/tools/draw.js");

window = this;

Drawer.enableWorkerMode(true);

onmessage = (e) => {
  if (e.data.canvas) {
    Drawer.setCanvas(e.data.canvas, true);
  } else if (e.data.action === "execute") {
    Drawer.drawGraphics(e.data.data);
  } else if (e.data.action === "resize") {
    Drawer.resize(e.data.data, true);
  }
};
