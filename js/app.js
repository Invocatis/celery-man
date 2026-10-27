const host = window.location.host;

var state = {
  sequence: null,
  music: { path: null, player: null },
  lock: true,
  inputing: false,
  booted: false,
  listening: false,
  listen: {},
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
    if (Array.isArray(sequence)) {
      for (s of sequence) {
        await application.renderSingleSequence(s);
      }
    } else {
      await application.renderSingleSequence(sequence);
    }
  },

  renderSingleSequence: async function (sequence) {
    desktop.lock();
    if (sequence.music == null) {
      music.fadeOut();
    }

    if (sequence.nsfw) {
      await application.renderSequence(sequences.nsfw);
    }

    if (sequence.warning && !state.warning) {
      desktop.warning();
    } else {
      state.warning = false;
    }

    if (sequence.prompt == "random") {
      let prompt = util
        .selectRandom(application.sequenceLoadingStatements)
        .replace("{sequence}", sequence.title);

      await desktop.say(prompt);
    } else if (sequence.prompt) {
      await desktop.say(sequence.prompt);
    }

    if (sequence.loading) {
      console.log("loading ...");
      await desktop.loadingWindow("#window-loader");
    }

    if (sequence.audio) {
      sounds.play(sequence.audio);
    }

    if (sequence.clear) {
      desktop.clearVideos();
    }

    if (sequence.element) {
      desktop.show(sequence.element);
    }

    if (sequence.beep) {
      sounds.beep();
    }

    if (sequence.flash) {
      // application.flashVideos();
    }

    if (sequence.windows) {
      console.log(sequence.windows);
      desktop.addWindows(
        sequence.title,
        sequence.windows.slice(0, 5),
        sequence.nsfw == null ? true : !sequence.nsfw,
      );

      if (sequence.windows.length > 5) {
        desktop.cycleWindows(sequence);
      }
    }

    if (sequence.music) {
      console.log(sequence.music);
      music.start(sequence.music);
    }

    if (sequence.wait) {
      await new Promise((r) => setTimeout(r, sequence.wait));
    }

    if (sequence.waitForSpeech) {
      await voice_recognition.listen_for(sequence.waitForSpeech);
    }

    if (sequence.waitForAffirmation) {
      await voice_recognition.listen_for_affirmation();
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
