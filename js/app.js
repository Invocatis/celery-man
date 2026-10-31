const host = window.location.host;

var state = {
  sequence: null,
  music: { path: null, player: null },
  lock: true,
  inputing: false,
  booted: false,
  listening: false,
  listen: [],
  promptHidden: true,
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
    if (sequence != sequences.base) {
      desktop.hide("#window-welcome");
    }
    if (sequence.frames) {
      for (s of sequence.frames) {
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
      await application.renderSequence(sequence.nsfw);
    }

    if (sequence.warning && !state.warning) {
      desktop.warning();
    } else if (!sequence.warning) {
      state.warning = false;
    }

    if (sequence.hidePrompt) {
      desktop.hide("#window-prompt");
      state.promptHidden = true;
    } else if (state.promptHidden) {
      state.promptHidden = false;
      desktop.changeTextPrompt("");
      desktop.show("#window-prompt");
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

    var windows;

    if (sequence.windows) {
      console.log(sequence.windows);
      var w = sequence.windows;

      if (!sequence.ordered) {
        w = w.slice(0, 5);
        util.shuffle(w);
      }

      if (sequence.async) {
        async function run() {
          var promise;
          [windows, promise] = desktop.addWindows(
            sequence,
            w,
            !sequence.ordered,
          );

          promise.then(() => {
            if (sequence.loop && state.sequence === sequence) run();
          });
        }

        run();
      } else {
        var promise;
        [windows, promise] = desktop.addWindows(sequence, w, !sequence.ordered);
        await promise;
      }

      if (sequence.windows.length > 5) {
        desktop.cycleWindows(sequence);
      }
    }

    if (sequence.music) {
      music.start(sequence.music);
    }

    function wait(wait_def) {
      if (Array.isArray(wait_def)) {
        return wait_def.reduce(
          (a, b) => a.then(() => wait(b)),
          Promise.resolve(),
        );
      } else if (Number.isInteger(wait_def)) {
        return new Promise((r) => setTimeout(r, wait_def));
      } else if (wait_def === "videoend") {
        let promises = [];
        let videos = windows
          .map((w) => w.querySelector("video"))
          .filter((v) => v);
        for (let video of videos) {
          let promise = new Promise((resolve) => {
            video.addEventListener("ended", () => {
              resolve();
            });
          });

          promises.push(promise);
        }

        return Promise.all(promises);
      }
    }

    await wait(sequence.wait);

    if (sequence.waitForSpeech) {
      await voice_recognition.listen_for(sequence.waitForSpeech);
    }

    if (sequence.waitForAffirmation) {
      await voice_recognition.listen_for_affirmation();
    }

    desktop.unlock();
  },

  initialize: async function () {
    document.addEventListener("keydown", (event) => {
      if (
        !state.booted &&
        event.key == " " &&
        document.activeElement.id != "command-input"
      ) {
        desktop.boot();
      }
    });

    // document.querySelector("#desktop").addEventListener(
    //   "touchstart",
    //   (event) => {
    //     if (!state.booted) desktop.boot();
    //     document
    //       .querySelector("#window-prompt")
    //       .addEventListener("touchstart", () => {
    //         sounds.prompt();
    //         voice_recognition.listen();
    //       });
    //   },
    //   { once: true },
    // );

    sequence.loadExternalSequences();
  },
};
