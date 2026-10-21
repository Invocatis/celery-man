var state = {
  sequence: null,
  frame: null,
  music: { path: null, player: null },
  lock: true,
};

var application = {
  cycleFrame: function (sequence) {
    if (state.frame >= frames.length) return;
    state.frame++;
  },

  selectSequence: function (sequence_name) {
    console.log("selectSequence");
    let sequence = sequences[sequence_name];
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

    if (frame.audio) {
      await new Audio(frame.audio).play();
    } else if (frame.prompt) {
      desktop.speak(frame.prompt);
    }

    if (frame.prompt) {
      await desktop.changeTextPrompt(frame.prompt);
    }

    if (frame.beep) {
      sounds.beep();
    }

    if (frame.loading) {
      console.log("loading ...");
      await desktop.loadingWindow("#window-loader");
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
        () => {
          state.frame++;
          application.renderCurrentFrame();
        },
      );
    }
    desktop.unlock();
  },

  curseWords: ["fuck", "shit", "damn", "cunt", "ass", "dick", "prick"],

  retorts: [
    "no u",
    "your mom",
    "eat my ass",
    "proud of you",
    "c'mon",
    "don't be like that",
  ],

  executors: {
    clear: {
      executor: () => {
        desktop.clearVideos();
        music.stop();
      },
    },
    "load sequence": {
      executor: (sequence) => {
        application.executors.clear.executor();
        application.executors["add sequence"].executor(sequence);
      },
    },
    "add sequence": {
      usage: "add sequence: {{SEQUENCE}}",
      executor: (sequence) => {
        console.log("Add sequence: " + sequence);
        if (sequences[sequence]) {
          console.log(sequences[sequence]);
          application.selectSequence(sequence);
          application.renderCurrentFrame();
          console.log("asdf");
        } else {
          application.selectSequence("sequence_not_found");
        }
      },
    },
  },

  executeCommand: async function (command) {
    if (application.curseWords.filter((c) => command.includes(c)).length != 0) {
      desktop.say(util.selectRandom(application.retorts));
      return;
    }

    let tokens = command
      .split(/:/)
      .filter((t) => t != "")
      .map((t) => t.trim());

    if (tokens.length === 0 || tokens.length > 2) {
      desktop.say("Malformed command");
    } else {
      let [command, args_string] = tokens;
      let args = args_string ? args_string.split(/\s+/) : [];
      console.log(`Executing command ${command} : ${args}`);
      let executor = application.executors[command];
      if (!executor) {
        desktop.say(util.selectRandom(application.retorts));
      } else {
        try {
          executor.executor(...args);
        } catch (ex) {
          console.log(ex);
          desktop.say(executor.usage);
        }
      }
    }
  },

  initialize: async function () {
    document.addEventListener("keydown", (event) => {
      if (event.key == " " && document.activeElement.id != "command-input") {
        desktop.boot();
      }
    });
    sequence.loadExternalSequences();
  },
};
