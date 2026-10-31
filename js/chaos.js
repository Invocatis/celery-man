let chaos = {
  increment_chaos: function () {
    if (!state.chaos) {
      state.chaos = 0;
    }
    state.chaos += 0.1;
  },

  enact_chaos: function () {
    if (!state.chaos) {
      state.chaos = 0;
    }

    if (Math.random() < state.chaos) {
      switch (Math.ceil(1 * Math.random())) {
        case 1:
          desktop.moveWindow(
            util.selectRandom(
              document.querySelectorAll(".window:has(video, img)"),
            ),
            200,
            0,
          );
          break;
      }
    }
  },
};
