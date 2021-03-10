const graphicFramerate = 15;
const logicFramerate = 60;

const Loop = {
  /**
   * @type {Array<Function>}
   */
  _everyFrameFunctions: [],

  /**
   * @type {Array<Function>}
   */
  _graphicFunctions: [],

  _grpahicWorker: null,
  _running: false,

  addToEveryFrame: (fn) => {
    Loop._everyFrameFunctions.push(fn);
  },

  addToGraphic: (fn) => {
    Loop._graphicFunctions.push(fn);
  },

  _computeGraphic: () => {
    const nextGraphics = Loop._graphicFunctions.reduce(
      (acc, fn) => ({ ...acc, ...fn() }),
      {}
    );

    if (Loop._graphicWorker) {
      Loop._graphicWorker.postMessage({
        action: "execute",
        data: nextGraphics,
      });
    } else {
      Drawer.drawGraphics(nextGraphics);
    }

    if (Loop._running) {
      setTimeout(() => {
        window.requestAnimationFrame(Loop._computeGraphic);
      }, 1000 / graphicFramerate);
    }
  },

  _compute: () => {
    Loop._everyFrameFunctions.forEach((fn) => fn());

    if (Loop._running) {
      setTimeout(() => {
        Loop._compute();
      }, 1000 / logicFramerate);
    }
  },

  reset: () => {
    Loop._everyFrameFunctions = [];
    Loop._graphicFunctions = [];
    Loop._running = false;
  },

  start: () => {
    Loop._running = true;

    Loop._compute();
    Loop._computeGraphic();
  },

  stop: () => {
    Loop._running = false;
  },

  isRunning: () => Loop._running,

  setGraphicWorker: (worker) => (Loop._graphicWorker = worker),
};
