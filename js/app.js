var state = {
  sequence: null,
  music: { path: null, player: null },
  lock: true,
  inputing: false,
  booted: false,
  listening: false,
};

var application = {
  sequenceLoadingStatements: [
    "add sequence: {sequence}",
    "initializing: {sequence}",
    "booting into: {sequence}",
    "let's give {sequence} a try",
    "perhaps {sequence} will suit your fancy",
    "this one looks like a tasty piece of meat",
  ],

  renderSequence: async function (sequence) {
    state.sequence = sequence;
    if (Array.isArray(sequence)) {
      for (s of sequence) {
        await application.renderSingleSequence(s);
      }
    } else {
      application.renderSingleSequence(sequence);
    }
  },

  renderSingleSequence: async function (sequence) {
    desktop.lock();

    if (sequence.audio) {
      await new Audio(sequence.audio).play();
    } else if (sequence.prompt) {
      voice.speak(sequence.prompt);
    }

    if (sequence.prompt === "random") {
      util
        .selectRandom(application.sequenceLoadingStatements)
        .replace("{sequence}", sequences);
    } else if (sequence.prompt) {
      await desktop.changeTextPrompt(sequence.prompt);
    }

    if (sequence.loading) {
      console.log("loading ...");
      await desktop.loadingWindow("#window-loader");
    }

    if (sequence.music == null) {
      music.stop();
    }

    if (sequence.clear) {
      desktop.clearVideos();
      desktop.hide("#window-welcome");
    }

    if (sequence.element) {
      desktop.show(sequence.element);
    }

    if (sequence.music) {
      new Audio(sequence.musi);
    }

    if (sequence.beep) {
      sounds.beep();
    }

    if (sequence.flash) {
      // application.flashVideos();
    }

    if (sequence.sequence) {
      console.log(sequences[sequence.sequence]);
      desktop.addWindows(
        sequence.sequence,
        sequences[sequence.sequence].windows,
      );
      music.start(sequence.music);
    }

    if (sequence.windows) {
      console.log(sequence.windows);
      desktop.addWindows(sequence.title, sequence.windows);
    }

    if (sequence.music) {
      console.log(sequence.music);
      music.start(sequence.music);
    }

    if (sequence.wait) {
      await new Promise((r) => setTimeout(r, sequence.wait));
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
