var sequences = {
  sequence_not_found: {
    frames: [
      {
        prompt: "Sequence not found",
      },
    ],
  },
  clear: {
    frames: [{ clear: true, music: null, prompt: "" }],
  },
  base: {
    frames: [
      {
        audio: "audio/voice/good_morning_paul.mp3",
        prompt: "Good morning, Paul.",
        element: "#window-welcome",
        waitAndProgress: 500,
      },
      {
        audio: "audio/voice/what_will_your.mp3",
        prompt: "What will your first sequence of the day be?",
        element: "#window-welcome",
      },
    ],
  },
  celery: {
    keybinding: "c",
    frames: [
      {
        title: "Celery Man",
        loading: true,
        prompt: "Yes, Paul.",
        audio: "audio/voice/yes_paul.mp3",
        beep: true,
        clear: true,
        music: "audio/music/celery.mp3",
        windows: [
          {
            id: "celery3",
            media: "video/celery3.mp4",
            position: { top: "10%", left: "45%" },
          },
          {
            id: "celery4",
            media: "video/celery4.mp4",
            position: { top: "10%", left: "10%" },
          },
        ],
      },
      {
        title: "Celery Man",
        prompt: "4d3d3d3 Engaged.",
        audio: "audio/voice/4d3d3d3.mp3",
        music: "audio/music/4d3d3d3.mp3",
        windows: [
          {
            id: "celery1",
            media: "video/celery1.mp4",
            position: { top: "10%", left: "10%" },
          },
          {
            id: "celery2",
            media: "video/celery2.mp4",
            position: { top: "10%", left: "45%" },
          },
        ],
      },
      {
        title: "Oyster",
        prompt: "add sequence: OYSTER",
        audio: "audio/voice/add_sequence_oyster.mp3",
        music: "audio/music/oyster.mp3",
        windows: [
          {
            id: "oyster1",
            media: "video/oyster1.mp4",
            position: { top: "10%", left: "25%" },
          },
          {
            id: "oyster2",
            media: "video/oyster2.mp4",
            position: { top: "25%", left: "5%" },
          },
          {
            id: "oyster3",
            media: "video/oyster3.mp4",
            position: { top: "40%", left: "45%" },
          },
        ],
      },
    ],
  },
  oyster: {
    frames: [
      {
        title: "Oyster",
        prompt: "add sequence: OYSTER",
        audio: "audio/voice/add_sequence_oyster.mp3",
        music: "audio/music/oyster.mp3",
        windows: [
          {
            id: "oyster1",
            media: "video/oyster1.mp4",
            position: { top: "10%", left: "25%" },
          },
          {
            id: "oyster2",
            media: "video/oyster2.mp4",
            position: { top: "25%", left: "5%" },
          },
          {
            id: "oyster3",
            media: "video/oyster3.mp4",
            position: { top: "40%", left: "45%" },
          },
        ],
      },
    ],
  },
  tayne: {
    keybinding: "t",
    frames: [
      {
        music: null,
        clear: true,
        prompt: "I have a BETA sequence I have been working on.",
        audio: "audio/voice/beta_sequence.mp3",
        waitAndProgress: 50,
      },
      {
        prompt: "Would you like to see it?",
        audio: "audio/voice/would_you_like_to_see_it.mp3",
      },
      {
        loading: true,
        prompt: "",
        music: "audio/music/tayne.mp3",
        title: "Tayne",
        windows: [
          {
            id: "tayne1",
            media: "video/tayne1.mp4",
            position: { top: "20%", left: "55%" },
          },
          {
            id: "tayne2",
            media: "video/tayne2.mp4",
            position: { top: "20%", left: "5%" },
          },
          {
            id: "tayne18",
            media: "video/tayne18.png",
            position: { top: "30%", left: "30%" },
          },
        ],
      },
      {
        clear: true,
        windows: [
          {
            media: "video/tayne3.mp4",
            position: { top: "30%", left: "15%" },
          },
          {
            media: "video/tayne3.mp4",
            position: { top: "30%", left: "40%" },
          },
          {
            media: "video/tayne3.mp4",
            position: { top: "30%", left: "65%" },
          },
        ],
      },
    ],
  },
};

var state = {
  sequence: null,
  frame: null,
  music: { path: null, player: null },
};

var application = {
  shuffle: function (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  changeTextPrompt: async function (text) {
    if (text == "") {
      document.querySelector("#window-prompt .window-content").value = "";
      return;
    }

    application.show("#window-prompt");
    var textPromptContent = "";
    for (const char of text) {
      textPromptContent += char;
      document.querySelector("#window-prompt .window-content").value =
        textPromptContent;
      await new Promise((r) => setTimeout(r, 50));
    }

    await new Promise((r) => setTimeout(r, 300));
  },

  music: {
    start: function (file) {
      if (file) {
        if (state.music.path == file) {
          // Do nothing
        } else {
          application.music.stop();
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
  },

  speak: function (text) {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();

    // Prefer a male-sounding English voice if one exists, otherwise use any English voice
    const voice =
      voices.find((v) => console.log(v)) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0];

    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.pitch = 0; // lowest allowed (range 0–2)
    u.rate = 0.9; // clip is fast, about 5 syllables/sec
    u.volume = 1;

    console.log(voice);

    synth.cancel();
    synth.speak(u);
  },

  say: function (text) {
    application.changeTextPrompt(text);
    application.speak(text);
  },

  addWindows: async function (title, windows) {
    console.log("Add sequence: " + title);

    application.hide("#window-original");
    application.hide("#window-welcome");

    var timeout = 200;
    application.shuffle(windows).forEach((source) => {
      const win = application.buildVideo(title, source);
      setTimeout(() => application.placeVideoWindow(win, source), timeout);
      timeout += 500 * Math.random() + 200;
    });
  },

  buildVideo: function (title, source) {
    var titlebar = `
            <div class="window-titlebar">
                <button type="button" class="btn-close" title="Close"><i class="fa fa-2x fa-minus"></i></button>

                <span class="title">${title}</span>

                <button type="button" class="btn-move" title="Move"><i class="fa fa-2x fa-caret-up"></i></button>
                <button type="button" class="btn-move" title="Move"><i class="fa fa-2x fa-caret-down"></i></button>
            </div>
        `;

    var subelement = null;

    if (source.media.endsWith(".jpg") || source.media.endsWith(".png")) {
      var image = document.createElement("img");
      image.src = source.media;

      subelement = image;
    } else if (source.media.endsWith(".mp4")) {
      var video = document.createElement("video");

      video.src = source.media;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.preload = "auto";

      subelement = video;
    }

    var win = document.createElement("div");
    win.id = source.id;
    win.className = "window window-video";
    win.innerHTML = titlebar;
    win.insertAdjacentElement("beforeend", subelement);

    return win;
  },

  cycleFrame: function (sequence) {
    if (state.frame >= sequences[sequence].frames.length) return;
    state.frame++;
  },

  selectSequence: function (sequence_name) {
    let sequence = sequences[sequence_name];
    if (state.sequence == sequence) {
      application.cycleFrame(sequence);
    } else {
      state.sequence = sequence;
      state.frame = 0;
    }
  },

  renderCurrentFrame: async function () {
    if (state.frame >= state.sequence.frames.length) return;
    let sequence = state.sequence;
    let frame = sequence.frames[state.frame];

    if (frame.music == null) {
      application.music.stop();
    }

    if (frame.clear) {
      application.clearVideos();
      application.hide("#window-welcome");
    }

    if (frame.element) {
      application.show(frame.element);
    }

    if (frame.music) {
      new Audio(frame.musi);
    }

    if (frame.audio) {
      await new Audio(frame.audio).play();
    } else if (frame.prompt) {
      application.speak(frame.prompt);
    }

    if (frame.prompt) {
      await application.changeTextPrompt(frame.prompt);
    }

    if (frame.beep) {
      application.beep();
    }

    if (frame.loading) {
      console.log("loading ...");
      await application.loadingWindow("#window-loader");
    }

    if (frame.flash) {
      application.flashVideos();
    }

    if (frame.sequence) {
      console.log(sequences[frame.sequence]);
      application.addWindows(frame.sequence, sequences[frame.sequence].windows);
      application.music.start(frame.music);
    }

    if (frame.windows) {
      console.log(frame.windows);
      application.addWindows(frame.title, frame.windows);
    }

    if (frame.music) {
      console.log(frame.music);
      application.music.start(frame.music);
    }

    if (frame.waitAndProgress) {
      await new Promise((r) => setTimeout(r, frame.waitAndProgress)).then(
        () => {
          state.frame++;
          application.renderCurrentFrame();
        },
      );
    }
  },

  beep: function (frequency = 987, duration = 350, gain = 1.5) {
    const ctx = new AudioContext();

    const now = ctx.currentTime;
    const end = now + duration / 1000;

    const sine = ctx.createOscillator();
    sine.type = "sine";
    sine.frequency.value = frequency;

    const _gain = ctx.createGain();
    _gain.gain.value = gain;

    sine.connect(_gain);
    _gain.connect(ctx.destination);

    sine.start(now);
    sine.stop(end);
    sine.onended = () => ctx.close();
  },

  playLoading: function ({
    ctx = new AudioContext(),
    when = ctx.currentTime + 0.02,
    volume = 1,
  } = {}) {
    const LOADING = {
      tremolo: { rate: 9 },
      a: {
        start: 0,
        end: 0.39,
        attack: 0.003,
        release: 0.02,
        depth: 0.28,
        f0: 268.4,
        low: [265.8, 0.041],
        harmonics: [
          [20, 0.0185],
          [21, 0.0338],
          [22, 0.0528],
          [23, 0.0444],
          [24, 0.0354],
          [25, 0.0238],
        ],
      },
      burst: { start: 0.395, end: 0.48, gain: 0.14, lowHz: 4000, highHz: 9000 },
      c: {
        start: 0.41,
        rampTo: 0.51,
        end: 1.025,
        release: 0.02,
        depth: 0.25,
        f0: 216.9,
        low: [220.5, 0.028],
        harmonics: [
          [20, 0.0089],
          [21, 0.016],
          [22, 0.0372],
          [23, 0.0253],
          [24, 0.0246],
          [25, 0.0056],
        ],
      },
    };
    const L = LOADING;
    if (ctx.state === "suspended" && !ctx.startRendering) ctx.resume(); // not for OfflineAudioContext
    const T = (t) => when + t;
    const cosWave = ctx.createPeriodicWave(
      new Float32Array([0, 1]),
      new Float32Array([0, 0]),
      { disableNormalization: true },
    );

    // One buzz segment: pulse-like harmonic oscillator + low tone, shaped by an envelope and the tremolo
    function segment(seg) {
      const n = seg.harmonics[seg.harmonics.length - 1][0] + 1;
      const real = new Float32Array(n),
        imag = new Float32Array(n);
      for (const [k, a] of seg.harmonics) real[k] = a; // all cosines -> pulse-like buzz
      const buzz = new OscillatorNode(ctx, { frequency: seg.f0 });
      buzz.setPeriodicWave(
        ctx.createPeriodicWave(real, imag, { disableNormalization: true }),
      );
      const low = new OscillatorNode(ctx, { frequency: seg.low[0] });
      const lowGain = new GainNode(ctx, { gain: seg.low[1] });

      const env = new GainNode(ctx, { gain: 0 }); // envelope
      const trem = new GainNode(ctx, { gain: 1 }); // tremolo: 1 + depth*cos(...)
      const lfo = new OscillatorNode(ctx, { frequency: L.tremolo.rate });
      lfo.setPeriodicWave(cosWave);
      lfo.connect(new GainNode(ctx, { gain: seg.depth })).connect(trem.gain);

      const t0 = T(seg.start),
        t1 = T(seg.end);
      env.gain.setValueAtTime(0, t0);
      if (seg.rampTo)
        env.gain.linearRampToValueAtTime(volume, T(seg.rampTo)); // slow fade-in
      else env.gain.linearRampToValueAtTime(volume, t0 + seg.attack); // abrupt start
      env.gain.setValueAtTime(volume, t1 - seg.release);
      env.gain.linearRampToValueAtTime(0, t1);

      buzz.connect(env);
      low.connect(lowGain).connect(env);
      env.connect(trem).connect(ctx.destination);
      for (const o of [buzz, low, lfo]) {
        o.start(t0);
        o.stop(t1 + 0.01);
      }
    }
    segment(L.a);
    segment(L.c);

    // Noise burst between the two states
    const b = L.burst,
      len = Math.round(ctx.sampleRate * (b.end - b.start));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate),
      d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const hp = new BiquadFilterNode(ctx, {
      type: "highpass",
      frequency: b.lowHz,
    });
    const lp = new BiquadFilterNode(ctx, {
      type: "lowpass",
      frequency: b.highHz,
    });
    const g = new GainNode(ctx, { gain: 0 });
    g.gain.setValueAtTime(0, T(b.start));
    g.gain.linearRampToValueAtTime(b.gain * volume, T(b.start) + 0.005);
    g.gain.setValueAtTime(b.gain * volume, T(b.end) - 0.005);
    g.gain.linearRampToValueAtTime(0, T(b.end));
    src.connect(hp).connect(lp).connect(g).connect(ctx.destination);
    src.start(T(b.start));

    return new Promise(
      (res) => (src.onended = () => setTimeout(res, (L.c.end - b.end) * 1000)),
    );
  },

  loadingWindow: async function (selector, hide = true) {
    application.show(selector);
    application.playLoading();
    for (
      var progress = 0;
      progress < 100;
      progress += Math.trunc(10 * Math.random())
    ) {
      await new Promise((r) => setTimeout(r, 50));
      document.querySelector(selector + " progress").value = progress;
    }
    if (hide) {
      application.hide(selector);
    }
  },

  resetLoader: function () {
    application.hide("#window-loader");
    document.querySelector("#window-loader progress").value = 0;
  },

  sequenceLoadingStatements: [
    "add sequence: {sequence}",
    "initializing: {sequence}",
    "booting into: {sequence}",
    "let's give {sequence} a try",
    "perhaps {sequence} will suit your fancy",
    "this one looks like a tasty piece of meat",
    "confabulating {sequence}",
  ],

  curseWords: ["fuck", "shit", "damn", "cunt", "ass", "dick", "prick"],

  retorts: [
    "no u",
    "your mom",
    "eat my ass",
    "proud of you",
    "c'mon",
    "don't be like that",
  ],

  selectRandom: function (collection) {
    return collection[Math.floor(Math.random() * collection.length)];
  },

  loadExternalSequences: async function () {
    console.log("Loading external sequnces");
    let folders = await fetch("http://localhost:8080/sequences/").then((r) =>
      r.json(),
    );

    console.log("asdf");

    console.log(folders);

    for (let folder of folders) {
      console.log("Loading sequence " + folder.name);
      let files = await fetch(
        "http://localhost:8080/sequences/" + folder.name,
      ).then((r) => r.json());

      console.log(files);

      let music = files.filter((x) => x.name.endsWith(".mp3"));

      let visualMedia = files.filter(
        (x) =>
          x.name.endsWith(".mp4") ||
          x.name.endsWith(".png") ||
          x.name.endsWith("jpg"),
      );

      let windows = [];
      for (let file of visualMedia) {
        windows.push({
          media:
            "http://localhost:8080/sequences/" + folder.name + "/" + file.name,
        });
      }

      let sequence = {
        frames: [
          {
            title: folder.name,
            music:
              music.length > 0
                ? "http://localhost:8080/sequences/" +
                  folder.name +
                  "/" +
                  music[0].name
                : "",
            windows: windows,
            loading: true,
            prompt: application
              .selectRandom(application.sequenceLoadingStatements)
              .replace("{sequence}", folder.name),
          },
        ],
      };

      sequences[folder.name] = sequence;
    }
  },

  executors: {
    clear: {
      executor: () => {
        application.clearVideos();
        application.music.stop();
      },
    },
    load: {
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
        } else {
          application.selectSequence("sequence_not_found");
        }
      },
    },
  },

  executeCommand: async function (command) {
    if (application.curseWords.filter((c) => command.includes(c)).length != 0) {
      application.say(application.selectRandom(application.retorts));
      return;
    }

    let tokens = command
      .split(/:/)
      .filter((t) => t != "")
      .map((t) => t.trim());

    if (tokens.length === 0 || tokens.length > 2) {
      application.say("Malformed command");
    } else {
      let [command, args_string] = tokens;
      let args = args_string ? args_string.split(/\s+/) : [];
      console.log(`Executing command ${command} : ${args}`);
      let executor = application.executors[command];
      console.log(executor);
      if (!executor) {
        application.say("Command not recognized");
      } else {
        try {
          executor.executor(...args);
        } catch (ex) {
          console.log(ex);
          application.say(executor.usage);
        }
      }
    }
  },

  boot: async function () {
    console.log("Booting...");

    application.music.stop();

    application.clearVideos();

    application.show("#window-welcome");

    await application.loadWelcome();

    // application.keybinding("c", "celery");
    // application.keybinding("o", "oyster");
    // application.keybinding("t", "tayne");
    // application.keybinding("s", "mozza");

    document.addEventListener("keydown", (event) => {
      if (event.key == "Enter") {
        if (document.activeElement.id === "command-input") {
          let command = document.querySelector("#command-input").value;
          document.querySelector("#command-input").value = "";
          application.executeCommand(command);
        } else {
          document.querySelector("#command-input").value = "";
          setTimeout(
            () => document.querySelector("#command-input").focus(),
            100,
          );
          document.querySelector("#window-input").style.display = "block";
        }
      }
    });

    application.selectSequence("base");
    application.renderCurrentFrame();
  },

  loadWelcome: async function () {
    await application.loadingWindow("#window-welcome", (hide = false));
  },

  keybinding: function (key, sequence) {
    document.addEventListener("keydown", (event) => {
      if (event.key == key && document.activeElement.id != "command-input") {
        application.selectSequence(sequence);
        application.renderCurrentFrame();
      }
    });
  },

  initialize: async function () {
    document.addEventListener("keydown", (event) => {
      if (event.key == " " && document.activeElement.id != "command-input") {
        application.boot();
      }
    });
    application.loadExternalSequences();
  },

  stopCurrentSequence: function () {
    application.audioStop();
    application.clearVideos();
  },

  clearVideos: function () {
    document.querySelectorAll(".window-video").forEach((el) => el.remove());
  },

  flashVideos: function () {
    document.querySelectorAll(".window-video").forEach((el) => {
      el.addEventListener("animationend", () => div.classList.remove("flash"), {
        once: true,
      });
      el.classList + "flash";
    });
  },

  windowCascade: function (window) {
    for (var i = 0; i < 10; i++) {
      const clone = window.cloneNode(true);
      const translate = i * 100 + "px";
      clone.style.transform =
        "translateX(" + translate + ") translateY(" + translate + ")";
      clone.style.top = null;
      clone.style.left = null;
      window.parentElement.appendChild(clone);
    }
  },

  placeVideoWindow: (() => {
    var x = Math.floor(100 * Math.random());
    var y = Math.floor(100 * Math.random());

    return function (win, source) {
      let desktop = document.getElementById("desktop");

      requestAnimationFrame(() => {
        win.style.display = "none";
        desktop.insertAdjacentElement("beforeend", win);

        requestAnimationFrame(() => {
          var cx, cy;
          if (source.position) {
            cx = source.position.left;
            cy = source.position.left;
          } else {
            x += 71;
            x %= 100;

            y += 71;
            y %= 100;

            cx = (x % 80) + "%";
            cy = (y % 50) + "%";
            console.log(cx);
            console.log(cy);
          }

          requestAnimationFrame(() => {
            win.style.left = cx;
            win.style.top = cy;
            win.style.display = "block";
          });
        });
      });

      return win;
    };
  })(),

  hide: function (selector) {
    console.log("hiding ... " + selector);
    document
      .querySelectorAll(selector)
      .forEach((elem) => (elem.style.display = "none"));
  },

  show: function (selector) {
    document
      .querySelectorAll(selector)
      .forEach((elem) => (elem.style.display = "block"));
  },
};
