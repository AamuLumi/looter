const Drawer = {
  /**
   * @type {HTMLCanvasElement}
   */
  _canvas: null,

  /**
   * @type {RenderingContext}
   */
  _context: null,

  /**
   * @type {HTMLCanvasElement}
   */
  _hiddenCanvas: null,

  /**
   * @type {RenderingContext}
   */
  _hiddenContext: null,

  _workerMode: false,

  /**
   * @readonly
   * @type {number}
   */
  width: 0,

  /**
   * @readonly
   * @type {number}
   */
  height: 0,

  addLine: (x, y, x2, y2) => {
    Drawer._hiddenContext.beginPath();
    Drawer._hiddenContext.moveTo(x, y);
    Drawer._hiddenContext.lineTo(x2, y2);
    Drawer._hiddenContext.closePath();
    Drawer._hiddenContext.stroke();
  },

  drawCurve: (startX, startY, ...points) => {
    Drawer._hiddenContext.beginPath();
    Drawer._hiddenContext.moveTo(startX, startY);

    points.forEach((point) => {
      Drawer._hiddenContext.bezierCurveTo(
        point.c1x,
        point.c1y,
        point.c2x,
        point.c2y,
        point.ex,
        point.ey
      );
    });

    Drawer._hiddenContext.stroke();
  },

  drawQuadraticCurve: (startX, startY, ...points) => {
    Drawer._hiddenContext.beginPath();
    Drawer._hiddenContext.moveTo(startX, startY);

    points.forEach((point) => {
      Drawer._hiddenContext.quadraticCurveTo(
        point.cx,
        point.cy,
        point.ex,
        point.ey
      );
    });

    Drawer._hiddenContext.stroke();
  },

  drawSprite: (img, frameX, frameY, frameWidth, frameHeight, x, y) => {
    Drawer._hiddenContext.drawImage(
      img,
      frameX,
      frameY,
      frameWidth,
      frameHeight,
      x,
      y,
      frameWidth,
      frameHeight
    );
  },

  background: (color) => {
    Drawer._hiddenContext.fillStyle = color;
    Drawer._hiddenContext.fillRect(
      0,
      0,
      Drawer._canvas.width,
      Drawer._canvas.height
    );
  },

  rect: () => {
    Drawer._hiddenContext.fillStyle = "green";
    Drawer._hiddenContext.fillRect(10, 10, 100, 100);
  },

  render: () => {
    Drawer._context.drawImage(Drawer._hiddenCanvas, 0, 0);
  },

  /**
   * Set the main canvas
   * @param {HTMLCanvasElement} canvas
   */
  setCanvas: (canvas) => {
    Drawer._canvas = canvas;

    Drawer.width = canvas.width;
    Drawer.height = canvas.height;

    if (Drawer._workerMode) {
      Drawer._context = canvas.getContext("2d");

      Drawer._hiddenCanvas = Drawer._canvas;
      Drawer._hiddenCanvas.width = Drawer._canvas.width;
      Drawer._hiddenCanvas.height = Drawer._canvas.height;

      Drawer._hiddenContext = Drawer._context;
    } else if (!window.Worker) {
      Drawer._context = canvas.getContext("2d");

      Drawer._hiddenCanvas = document.createElement("canvas");
      Drawer._hiddenCanvas.width = canvas.width;
      Drawer._hiddenCanvas.height = canvas.height;

      Drawer._hiddenContext = Drawer._hiddenCanvas.getContext("2d");
    } else {
      Drawer._context = null;

      Drawer._hiddenCanvas = Drawer._canvas;
      Drawer._hiddenCanvas.width = Drawer._canvas.width;
      Drawer._hiddenCanvas.height = Drawer._canvas.height;

      Drawer._hiddenContext = null;
    }
  },

  setStroke: (color) => {
    Drawer._hiddenContext.strokeStyle = color;
  },

  transferControlToOffscreen: () => {
    return Drawer._canvas.transferControlToOffscreen();
  },

  drawGraphics: (graphics) => {
    if (graphics.background) {
      Drawer.background(graphics.background);
    }

    if (graphics.sprites) {
      graphics.sprites.forEach((sprite) => Drawer.drawSprite(...sprite));
    }
  },

  resize: ({ width, height }) => {
    if (Drawer._workerMode) {
      Drawer._canvas.width = width;
      Drawer._canvas.height = height;
    }

    Drawer.width = width;
    Drawer.height = height;
  },

  enableWorkerMode: () => {
    Drawer._workerMode = true;
  },
};
