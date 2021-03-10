class Character {
  _asset = "";

  gameInformations = {
    attacking: false,
    tourLoading: Generator.getInt(100),
  };

  graphic = {
    animation: "idle",
    animationFocused: false,
    framePosition: {
      x: 0,
      y: 0,
    },
    frame: 0,
    maxSprites: {
      height: 0,
      width: 0,
    },
    position: {
      x: 0,
      y: 0,
    },
    sprites: {},
    spriteInformations: {},
  };

  stats = {
    speed: 1,
  };

  teamPosition = 0;

  constructor(asset, teamPosition) {
    this._asset = asset;
    this.teamPosition = teamPosition;
  }

  init = async () => {
    const { config, ...sprites } = await AssetLoader.loadCharacterAsset(
      this._asset
    );

    this.graphic.maxSprites = {
      height: Object.keys(sprites).reduce(
        (acc, key) => (sprites[key].height > acc ? sprites[key].height : acc),
        0
      ),
      width: Object.keys(sprites).reduce(
        (acc, key) => (sprites[key].width > acc ? sprites[key].width : acc),
        0
      ),
    };

    this.graphic.sprites = sprites;
    this.graphic.spriteInformations = config;
  };

  attack = () => {
    this.gameInformations.attacking = true;
    this.graphic.animation = "attack";

    setTimeout(() => {
      this.gameInformations.tourLoading = 0;
      this.gameInformations.attacking = false;
      this.graphic.animation = "idle";
    }, 1000);
  };
}
