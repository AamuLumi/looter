const AssetLoader = {
  _loadConfig: async (url) => {
    const configResponse = await fetch(url);

    return configResponse.json();
  },

  _loadImage: (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        createImageBitmap(img).then((res) => {
          resolve(res);
        });
      };

      img.src = url;
    });
  },

  loadCharacterAsset: (assetName) => {
    return Promise.all([
      AssetLoader._loadConfig(`/assets/${assetName}/config.json`),
      AssetLoader._loadImage(`/assets/${assetName}/attack.png`),
      AssetLoader._loadImage(`/assets/${assetName}/idle.png`),
    ]).then(([config, attack, idle]) => ({ config, idle, attack }));
  },
};
