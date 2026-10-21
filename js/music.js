let music = {
  start: function (file) {
    if (file) {
      if (state.music.path == file) {
        // Do nothing
      } else {
        music.stop();
        let audio = new Audio(file);
        audio.loop = true;
        audio.play();

        state.music.player = audio;
        state.music.path = file;
      }
    }
  },
  stop: function () {
    if (state.music.player != null) {
      state.music.player.pause();
      state.music.player = null;
      state.music.path = null;
    }
  },
};
