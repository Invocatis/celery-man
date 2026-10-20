var sequences = {
  celery: {
    title: "Celery Man",
    music: "audio/celery_1.mp3",
    windows: [
      // { id: "celery1", media: "video/celery1.mp4", position: { top: "15%", left: "5%" } },
      // mediaType: "video",
      // { id: "celery2", media: "video/celery2.mp4", position: { top: "20%", left: "45%" } },
      // mediaType: "video",
      {
        id: "celery3",
        media: "video/celery3.mp4",
        mediaType: "video",
        position: { top: "10%", left: "45%" },
      },
      {
        id: "celery4",
        media: "video/celery4.mp4",
        mediaType: "video",
        position: { top: "10%", left: "10%" },
      },
    ],
  },

  celery_engaged: {
    title: "Celery Man",
    music: "audio/celery_2.mp3",
    windows: [
      {
        id: "celery1",
        media: "video/celery1.mp4",
        mediaType: "video",
        position: { top: "10%", left: "10%" },
      },
      {
        id: "celery2",
        media: "video/celery2.mp4",
        mediaType: "video",
        position: { top: "10%", left: "45%" },
      },
      // { id: "celery3", media: "video/celery3.mp4", position: { top: "40%", left: "25%" } },
      // mediaType: "video",
      // { id: "celery4", media: "video/celery4.mp4", position: { top: "10%", left: "65%" } },
      // mediaType: "video",
    ],
  },

  oyster: {
    title: "OYSTER",
    music: "audio/oyster.mp3",
    windows: [
      {
        id: "oyster1",
        media: "video/oyster1.mp4",
        mediaType: "video",
        position: { top: "10%", left: "25%" },
      },
      {
        id: "oyster2",
        media: "video/oyster2.mp4",
        mediaType: "video",
        position: { top: "25%", left: "5%" },
      },
      {
        id: "oyster3",
        media: "video/oyster3.mp4",
        mediaType: "video",
        position: { top: "40%", left: "45%" },
      },
    ],
  },

  tayne: {
    title: "Tayne",
    music: "audio/tayne.mp3",
    windows: [
      {
        id: "tayne1",
        media: "video/tayne1.mp4",
        mediaType: "video",
        position: { top: "20%", left: "35%" },
      },
      {
        id: "tayne2",
        media: "video/tayne2.mp4",
        mediaType: "video",
        position: { top: "35%", left: "65%" },
      },
      {
        id: "tayne3",
        media: "video/tayne3.mp4",
        mediaType: "video",
        position: { top: "10%", left: "5%" },
      },
      {
        id: "tayne4",
        media: "video/tayne4.mp4",
        mediaType: "video",
        position: { top: "25%", left: "20%" },
      },
      {
        id: "tayne5",
        media: "video/tayne5.mp4",
        mediaType: "video",
        position: { top: "5%", left: "50%" },
      },
      {
        id: "tayne18",
        media: "video/tayne18.png",
        mediaType: "image",
        position: { top: "50%", left: "50%" },
      },
    ],
  },

  mozza: {
    title: "MOZZA-RELL",
    windows: [
      {
        id: "mozza1",
        media: "video/mozza1.mp4",
        mediaType: "video",
        position: { top: "10%", left: "5%" },
      },
      {
        id: "mozza2",
        media: "video/mozza2.mp4",
        mediaType: "video",
        position: { top: "30%", left: "35%" },
      },
    ],
  },
};

var modes = {
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
            mediaType: "video",
            position: { top: "10%", left: "45%" },
          },
          {
            id: "celery4",
            media: "video/celery4.mp4",
            mediaType: "video",
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
            mediaType: "video",
            position: { top: "10%", left: "10%" },
          },
          {
            id: "celery2",
            media: "video/celery2.mp4",
            mediaType: "video",
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
            mediaType: "video",
            position: { top: "10%", left: "25%" },
          },
          {
            id: "oyster2",
            media: "video/oyster2.mp4",
            mediaType: "video",
            position: { top: "25%", left: "5%" },
          },
          {
            id: "oyster3",
            media: "video/oyster3.mp4",
            mediaType: "video",
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
            mediaType: "video",
            position: { top: "20%", left: "55%" },
          },
          {
            id: "tayne2",
            media: "video/tayne2.mp4",
            mediaType: "video",
            position: { top: "20%", left: "5%" },
          },
          {
            id: "tayne18",
            media: "video/tayne18.png",
            mediaType: "image",
            position: { top: "30%", left: "30%" },
          },
        ],
      },
    ],
  },
};

var state = {
  mode: null,
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
    application.show("#window-prompt");
    var textPromptContent = "";
    for (const char of text) {
      textPromptContent += char;
      document.querySelector("#window-prompt .window-content").innerHTML =
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

    if (source.mediaType == "image") {
      var image = document.createElement("img");
      image.src = source.media;

      subelement = image;
    } else if (source.mediaType == "video") {
      var video = document.createElement("video");

      video.src = source.media;
      video.autoplay = true;
      video.loop = true;
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

  cycleFrame: function (mode) {
    if (state.frame >= modes[mode].frames.length) return;
    state.frame++;
  },

  selectMode: function (mode) {
    if (state.mode == mode) {
      application.cycleFrame(mode);
    } else {
      state.mode = mode;
      state.frame = 0;
    }
  },

  renderCurrentFrame: async function () {
    if (state.frame >= modes[state.mode].frames.length) return;
    let mode = modes[state.mode];
    let frame = mode.frames[state.frame];

    if (frame.clear) {
      application.clearVideos();
      application.hide("#window-welcome");
      application.music.stop();
    }

    if (frame.element) {
      application.show(frame.element);
    }

    if (frame.music) {
      new Audio(frame.musi);
    }

    if (frame.audio) {
      await new Audio(frame.audio).play();
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

  boot: async function () {
    console.log("Booting...");

    application.music.stop();

    application.clearVideos();

    var windows = [
      "window-welcome",
      "window-loader",
      "window-prompt",
      "window-original",
    ];

    application.show("#window-welcome");

    await application.loadWelcome();

    application.selectMode("base");
    application.renderCurrentFrame();
  },

  loadWelcome: async function () {
    await application.loadingWindow("#window-welcome", (hide = false));
  },

  keybinding: function (key, mode) {
    document.addEventListener("keydown", (event) => {
      if (event.key == key) {
        application.selectMode(mode);
        application.renderCurrentFrame();
      }
    });
  },

  initialize: async function () {
    application.keybinding("c", "celery");
    application.keybinding("o", "oyster");
    application.keybinding("t", "tayne");
    application.keybinding("s", "mozza");

    document.addEventListener("keydown", (event) => {
      if (event.key == " ") {
        application.boot();
      }
    });
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
    var x = 0;
    var y = 0;

    return function (win, source) {
      x += Math.random() * 50;
      x %= 100;

      y += Math.random() * 50;
      y %= 100;

      const cx = source.position.left || x + "%";
      const cy = source.position.top || y + "%";

      requestAnimationFrame(() => {
        win.style.display = "none";
        document
          .getElementById("desktop")
          .insertAdjacentElement("beforeend", win);

        requestAnimationFrame(() => {
          win.style.left = `clamp(0px, ${cx}, calc(100% - ${win.offsetWidth}px))`;
          win.style.top = `clamp(0px, ${cy}, calc(100% - ${win.offsetHeight}px))`;
          win.style.display = "block";
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
