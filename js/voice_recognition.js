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
      state.listen[text] = () => {
        triggers.forEach((text) => {
          if (!persist) {
            delete state.listen[text];
          }
        });

        console.log(callback);

        if (callback) {
          callback();
        }
        resolve();
      };
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
          Object.entries(state.listen).forEach(([word, callback]) => {
            if (transcript.includes(word)) {
              callback();
            }
          });
        }
      };

      recognition.onerror = (event) => {
        console.log("Error: " + event.error);
      };

      recognition.onend = () => {
        console.log("Stopped.");
        voice_recognition.listen_to_all();
      };

      recognition.start();
    }
  },
};
