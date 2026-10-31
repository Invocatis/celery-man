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

  initialize: function () {
    let trigger_word = () => {
      console.log("trigger word heard");
      desktop.say("Yes?");
      voice_recognition.listen();
    };

    voice_recognition.listen_for(
      [/^computer$/],
      () => trigger_word(),
      (persist = true),
    );

    voice_recognition.listen_for(
      [/^computer/],
      (result) => command.execute(result),
      (persist = true),
    );

    voice_recognition.listen_to_all();
  },

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

  grammar: function () {
    let commands = Object.keys(command.executors);
    let sequence_names = Object.keys(sequences);
    let modes = Object.values(sequences)
      .map((x) => (x.modes ? Object.keys(x.modes) : []))
      .flat();

    return JSON.stringify([
      ...commands,
      ...sequence_names,
      ...modes,
      ...command.curseWords,
      ...Object.keys(voice_recognition.aliases),
      "computer",
      "[unk]",
    ]);
  },
  aliases: {
    "kick up": "engage",
    "new sequence": "load sequence tayne",
    generate: "engage",
    "can i get": "engage",
    "four d three d three d three": "4d3d3d3",
    boot: "load",
  },

  listen_to_all: async function () {
    console.log("listening ...");

    const model = await Vosk.createModel("vosk-model-small-en-us-0.15.tar.gz");
    const rec = new model.KaldiRecognizer(16000, voice_recognition.grammar());

    rec.on("result", (m) => {
      let transcript = m.result.text.toLowerCase().trim();

      for (let [from, to] of Object.entries(voice_recognition.aliases)) {
        if (transcript.includes(from)) {
          transcript = transcript.replace(from, to);
        }
      }

      voice_recognition.handle_result(transcript);
    });

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const ctx = new AudioContext({ sampleRate: 16000 });
    const src = ctx.createMediaStreamSource(stream);
    const node = ctx.createScriptProcessor(4096, 1, 1);
    node.onaudioprocess = (e) => rec.acceptWaveform(e.inputBuffer);
    src.connect(node);
    node.connect(ctx.destination);
  },
  handle_result: async function (transcript) {
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
  },
};
