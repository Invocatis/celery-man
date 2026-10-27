let voice_recognition = {
  listen: function () {
    state.listening = true;
  },

  affirmations: [
    "yes",
    "yea",
    "yeah",
    "okay",
    "ok",
    "sure",
    "why not",
    "alright",
    "all right",
  ],

  listen_for_affirmation: function (callback, persist = false) {
    return voice_recognition.listen_for(
      voice_recognition.affirmations,
      callback,
      persist,
    );
  },

  listen_for: function (triggers, callback, persist = false) {
    console.log("Listening for: " + triggers);

    let resolve;
    let promise = new Promise((r) => (resolve = r));
    state.listening = false;

    triggers.forEach((text) => {
      state.listen.push([
        text,
        (result) => {
          triggers.forEach((text) => {
            if (!persist) {
              delete state.listen[text];
              state.listen = state.listen.filter(([t, c]) => t === text);
            }
          });

          if (callback) {
            callback(result);
          }
          resolve();
        },
      ]);
    });

    return promise;
  },

  listen_to_all: function () {
    console.log("listening ...");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      status.textContent = "Speech recognition is unsupported.";
    } else {
      const recognition = new SpeechRecognition();

      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onresult = async (event) => {
        let transcript = event.results[event.results.length - 1][0].transcript
          .toLowerCase()
          .trim();

        console.log("heard: " + transcript);

        if (state.listening) {
          await command.execute(transcript);
          state.listening = false;
        } else {
          state.listen.forEach(([trigger, callback]) => {
            if (typeof trigger === "string" && trigger === transcript) {
              callback();
            } else if (trigger instanceof RegExp && trigger.test(transcript)) {
              callback(transcript);
            }
          });
        }
      };

      var error;

      recognition.onerror = (event) => {
        error = event.error;
        console.log("Error: " + event.error);
      };

      recognition.onend = () => {
        console.log("Stopped.");
        if (!error) voice_recognition.listen_to_all();
      };

      recognition.start();
    }
  },
};
