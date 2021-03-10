const System = {
  _graphicWorker: null,
  _speed: 1,

  _setupResizer: () => {
    window.addEventListener("resize", () => {
      size = document.body.getBoundingClientRect();
      if (System._graphicWorker) {
        System._graphicWorker.postMessage({
          action: "resize",
          data: size,
        });
      }

      Drawer.resize(size);
    });
  },

  initApp: () => {
    document.body.style.height = "100vh";
    document.body.style.width = "100vw";
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";
    document.body.style.display = "flex";
    document.body.style.flexDirection = "row";

    const progressBars = [
      FD.create("progress", {
        max: 100,
      }),
      FD.create("progress", {
        max: 100,
      }),
    ];

    const rightPanel = FD.create(
      "div",
      {
        style: {
          width: 300,
        },
      },
      progressBars
    );

    Loop.addToEveryFrame(() => {
      const chars = Game.getCharacters();

      chars.forEach((e, i) => {
        progressBars[i].value = e.gameInformations.tourLoading;
      });
    });

    System._size = document.body.getBoundingClientRect();

    const canvas = FD.create("canvas", {
      id: "mainFrame",

      style: {
        flexGrow: 1,
      },
    });

    document.body.appendChild(canvas);
    document.body.appendChild(rightPanel);

    const canvasSize = canvas.getBoundingClientRect();

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    Drawer.setCanvas(canvas);
    //Drawer.background("black");
    //Drawer.render();

    System._setupResizer();
  },

  getSpeedController: () =>
    Controls.createRange({
      min: 1,
      max: 6,
      text: "Speed",
      value: 1,
      onChange: (e) => {
        System._speed = parseInt(e.target.value, 10);
      },
    }),

  getWindowSize: () => System._size,

  load: async () => {
    //Controls.addDefaultControllers();
    //Controls.add(System.getSpeedController());

    Game.createCharacter({
      asset: "testhero",
      teamPosition: 0,
    });

    Game.createCharacter({
      asset: "testhero",
      teamPosition: 1,
    });

    Loop.addToEveryFrame(() => {
      const characterReadyToAttack = Game.findCharacterReadyToAttack();
      const characterAttacking = Game.findCharacterAttacking();

      if (characterAttacking) {
      } else if (characterReadyToAttack) {
        characterReadyToAttack.attack();
      } else {
        Game.updateTourLoading();
      }
    });

    Loop.addToGraphic(() => {
      AssetAnimator.animateCharacters(Game.getCharacters());

      return {
        background: "black",
        sprites: Game.getAssets().map((asset) => {
          const assetWidth =
            asset.sprites[asset.animation].width /
            asset.spriteInformations[asset.animation].cols;

          const assetHeight =
            asset.sprites[asset.animation].height /
            asset.spriteInformations[asset.animation].rows;

          return [
            asset.sprites[asset.animation],
            asset.framePosition.x,
            asset.framePosition.y,
            assetWidth,
            assetHeight,
            asset.position.x - assetWidth,
            asset.position.y - assetHeight,
          ];
        }),
      };
    });

    Loop.start();
  },

  setGraphicWorker: (worker) => {
    System._graphicWorker = worker;
    Loop.setGraphicWorker(worker);
  },
};
