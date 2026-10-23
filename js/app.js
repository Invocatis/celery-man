var state = {
  sequence: null,
  frame: null,
  music: { path: null, player: null },
  lock: true,
  inputing: false,
  booted: false,
};

var application = {
  cycleFrame: function (sequence) {
    if (state.frame >= frames.length) return;
    state.frame++;
  },

  selectSequence: function (sequence) {
    console.log("selectSequence");
    if (state.sequence == sequence) {
      application.cycleFrame(sequence);
    } else {
      state.sequence = sequence;
      state.frame = 0;
    }
  },

  renderCurrentFrame: async function () {
    desktop.lock();
    if (state.frame >= state.sequence.frames.length) return;
    let sequence = state.sequence;
    let frame = sequence.frames[state.frame];

    if (frame.audio) {
      await new Audio(frame.audio).play();
    } else if (frame.prompt) {
      desktop.speak(frame.prompt);
    }

    if (frame.prompt) {
      await desktop.changeTextPrompt(frame.prompt);
    }

    if (frame.loading) {
      console.log("loading ...");
      await desktop.loadingWindow("#window-loader");
    }

    if (frame.music == null) {
      music.stop();
    }

    if (frame.clear) {
      desktop.clearVideos();
      desktop.hide("#window-welcome");
    }

    if (frame.element) {
      desktop.show(frame.element);
    }

    if (frame.music) {
      new Audio(frame.musi);
    }

    if (frame.beep) {
      sounds.beep();
    }

    if (frame.flash) {
      // application.flashVideos();
    }

    if (frame.sequence) {
      console.log(sequences[frame.sequence]);
      desktop.addWindows(frame.sequence, sequences[frame.sequence].windows);
      music.start(frame.music);
    }

    if (frame.windows) {
      console.log(frame.windows);
      desktop.addWindows(frame.title, frame.windows);
    }

    if (frame.music) {
      console.log(frame.music);
      music.start(frame.music);
    }

    if (frame.waitAndProgress) {
      await new Promise((r) => setTimeout(r, frame.waitAndProgress)).then(
        async () => {
          state.frame++;
          await application.renderCurrentFrame();
        },
      );
    }
    desktop.unlock();
  },

  initialize: async function () {
    const command_input = document.querySelector("#command-input");
    command_input.addEventListener(
      "input",
      () => (command_input.scrollLeft = command_input.scrollWidth),
    );

    document.addEventListener("keydown", (event) => {
      if (
        !state.booted &&
        event.key == " " &&
        document.activeElement.id != "command-input"
      ) {
        desktop.boot();
      }
    });
    sequence.loadExternalSequences();
  },
};
