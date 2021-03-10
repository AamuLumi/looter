const AssetAnimator = {
  _getBackgroundPositionFor: (i, img, info) => {
    return {
      x: (img.width * (i % info.cols)) / info.cols,
      y: (img.height * Math.trunc(i / info.cols)) / info.rows,
    };
  },

  /**
   * @param {Array<Character>} characters
   */
  animateCharacters: (characters) => {
    characters.forEach((char) => {
      char.graphic.frame++;

      if (
        char.graphic.frame >=
        char.graphic.spriteInformations[char.graphic.animation].frames
      ) {
        char.graphic.frame = 0;
      }

      if (char.graphic.animation === "attack") {
        if (char.graphic.frame === 0) {
          char.graphic.animation = "idle";
        }
      }

      char.graphic.framePosition = AssetAnimator._getBackgroundPositionFor(
        char.graphic.frame,
        char.graphic.sprites[char.graphic.animation],
        char.graphic.spriteInformations[char.graphic.animation]
      );

      char.graphic.position = {
        x: Drawer.width * 0.8,
        y: Drawer.height * (0.2 * (char.teamPosition + 1)),
      };

      if (char.graphic.spriteInformations[char.graphic.animation].margin) {
        const { margin } = char.graphic.spriteInformations[
          char.graphic.animation
        ];

        char.graphic.position.x += margin[3] - margin[1];
        char.graphic.position.y += margin[0] - margin[2];
      }
    });
  },
};
