let util = {
  selectRandom: function (collection) {
    return collection[Math.floor(Math.random() * collection.length)];
  },

  shuffle: function (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },
  hash: function (str) {
    let h = 0;
    for (const c of str) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
    return h;
  },
};
