System.initApp();

if (window.Worker) {
  const graphicWorker = new Worker("/worker.js");
  const offscreen = Drawer.transferControlToOffscreen();

  graphicWorker.postMessage({ canvas: offscreen }, [offscreen]);

  System.setGraphicWorker(graphicWorker);
}

System.load();
