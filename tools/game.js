const Game = {
  /**
   * @type {Array<Character>}
   */
  characters: [],

  createCharacter: async ({ asset, teamPosition }) => {
    const char = new Character(asset, teamPosition);

    await char.init();

    Game.characters.push(char);
  },

  getCharacters: () => Game.characters,

  /**
   * @returns {Array<GraphicProperties>}
   */
  getAssets: () => {
    return [...Game.characters.map((e) => e.graphic)];
  },

  findCharacterReadyToAttack: () => {
    return Game.characters.find((e) => e.gameInformations.tourLoading >= 100);
  },

  findCharacterAttacking: () => {
    return Game.characters.find((e) => e.gameInformations.attacking);
  },

  updateTourLoading: () => {
    Game.characters.forEach((c) => {
      c.gameInformations.tourLoading += c.stats.speed;
    });
  },
};
