var sequences = {
  celery: {
    title: "Celery Man",
    windows: [
      // { id: "celery1", position: { top: "15%", left: "5%" } },
      // { id: "celery2", position: { top: "20%", left: "45%" } },
      { id: "celery3", position: { top: "40%", left: "25%" } },
      { id: "celery4", position: { top: "10%", left: "65%" } },
    ],
  },

  celery_engaged: {
    title: "Celery Man",
    windows: [
      { id: "celery1", position: { top: "15%", left: "5%" } },
      { id: "celery2", position: { top: "20%", left: "45%" } },
      // { id: "celery3", position: { top: "40%", left: "25%" } },
      // { id: "celery4", position: { top: "10%", left: "65%" } },
    ],
  },

  oyster: {
    title: "OYSTER",
    windows: [
      { id: "oyster1", position: { top: "10%", left: "25%" } },
      { id: "oyster2", position: { top: "25%", left: "5%" } },
      { id: "oyster3", position: { top: "40%", left: "45%" } },
    ],
  },

  tayne: {
    title: "Tayne",
    windows: [
      { id: "tayne1", position: { top: "20%", left: "35%" } },
      { id: "tayne2", position: { top: "35%", left: "65%" } },
      { id: "tayne3", position: { top: "10%", left: "5%" } },
      { id: "tayne4", position: { top: "25%", left: "20%" } },
      { id: "tayne5", position: { top: "5%", left: "50%" } },
    ],
  },

  mozza: {
    title: "MOZZA-RELL",
    windows: [
      { id: "mozza1", position: { top: "10%", left: "5%" } },
      { id: "mozza2", position: { top: "30%", left: "35%" } },
    ],
  },
};

var modes = {
  base: {
    frames: [
      {
        // audio: "audio/computer/01_GoodMorningPaul.mp3",
        prompt: "Good morning, Paul.",
      },
    ],
  },
  celery: {
    keybinding: "c",
    frames: [
      {
        sequence: "celery",
        loading: true,
        prompt: "Yes, Paul.",
        audio: "audio/computer/02_YesPaul.mp3",
        clear: true,
      },
      {
        sequence: "celery_engaged",
        prompt: "4d3d3d3 Engaged.",
        audio: "audio/computer/03_4d3d3d3.mp3",
        // flash: true,
        // clear: true,
      },
      {
        sequence: "oyster",
        prompt: "add sequence: OYSTER",
        audio: "audio/computer/04_AddSequenceOyster.mp3",
      },
    ],
  },
  tayne: {
    keybinding: "t",
    frames: [
      {
        clear: true,
        prompt:
          "I have a BETA sequence I have been working on.\nWould you like to see it?",
        audio: "audio/computer/05_BetaSequence.mp3",
      },
      {
        loading: true,
        sequence: "tayne",
        prompt: "",
      },
    ],
  },
};

var state = {
  mode: null,
  frame: null,
};

var application = {
  video_dir: "video",

  changeTextPrompt: async function (text) {
    var textPromptContent = "";
    for (const char of text) {
      textPromptContent += char;
      document.querySelector("#window-prompt .window-content").innerHTML =
        textPromptContent;
      await new Promise((r) => setTimeout(r, 65));
    }

    await new Promise((r) => setTimeout(r, 300));
  },

  sequenceRenderer: async function (sequence) {
    sequence.windows
      .map((source) => application.createVideoWindow(source))
      .forEach((win) => (win.style.display = "block"));
  },

  addSequence: async function (sequence_name) {
    console.log("Add sequence: " + sequence_name);

    application.embedStop();
    application.hide("#window-original");
    application.hide("#window-welcome");

    const sequence = sequences[sequence_name];

    console.log("---- " + sequence);

    sequence.windows.forEach((source) =>
      application.buildVideo(sequence, source),
    );
    application.sequenceRenderer(sequence);
    application.finishSequence(sequence);
  },

  buildVideo: function (sequence, source) {
    var filename = this.video_dir + "/" + source.id + ".mp4",
      video = document.createElement("video");

    video.src = filename;
    video.autoplay = true;
    video.loop = true;
    video.preload = "auto";

    this.buildVideoWindow(source.id, sequence.title, video);
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

    if (frame.audio) {
      application.playAudio(frame.audio);
    }

    if (frame.prompt) {
      await application.changeTextPrompt(frame.prompt);
    }

    if (frame.loading) {
      await application.loadingWindow("#window-loader progress");
    }

    if (frame.flash) {
      application.flashVideos();
    }

    if (frame.clear) {
      application.clearVideos();
    }

    if (frame.sequence) {
      application.addSequence(frame.sequence);
    }
  },

  buildVideoWindow: function (id, title, video) {
    console.log(id + " " + title + " " + video);
    var titlebar = `
            <div class="window-titlebar">
                <button type="button" class="btn-close" title="Close"><i class="fa fa-2x fa-minus"></i></button>

                <span class="title">${title}</span>

                <button type="button" class="btn-move" title="Move"><i class="fa fa-2x fa-caret-up"></i></button>
                <button type="button" class="btn-move" title="Move"><i class="fa fa-2x fa-caret-down"></i></button>
            </div>
        `;

    var win = document.createElement("div");
    win.id = id;
    win.className = "window window-video";
    win.innerHTML = titlebar;
    win.insertAdjacentElement("beforeend", video);

    document.getElementById("desktop").insertAdjacentElement("beforeend", win);
  },

  loadingWindow: async function (selector) {
    application.show("#window-loader");
    for (
      var progress = 100;
      progress < 100;
      progress += Math.trunc(10 * Math.random())
    ) {
      await new Promise((r) => setTimeout(r, 100));
      document.querySelector(selector).value = progress;
    }
    application.hide("#window-loader");
  },

  finishSequence: function (sequence) {
    var showIdentity = function () {
      this.resetLoader();
    };

    setTimeout(showIdentity.bind(this), 1000);
  },
  resetLoader: function () {
    this.hide("#window-loader");
    document.querySelector("#window-loader progress").value = 0;
  },

  boot: function () {
    var windows = [
      "window-welcome",
      "window-loader",
      "window-prompt",
      "window-original",
    ];

    document
      .querySelector(".icon-cinco")
      .addEventListener("click", (event) => this.clickCinco(event));
    document
      .querySelector(".icon-original")
      .addEventListener("click", (event) => this.clickOriginal(event));

    windows.forEach((win) => this.createWindow(win));

    this.hide("#window-welcome .options");
    this.show("#window-welcome");

    this.loadWelcome();
  },

  loadWelcome: async function () {
    await application.loadingWindow("#window-welcome progress");

    application.initialize();
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

    this.hide("#window-welcome .progress");
    this.show("#window-welcome .options");
    this.show("#window-prompt");

    application.selectMode("base");
    application.renderCurrentFrame();

    ["celery", "oyster", "tayne", "mozza"].forEach((source) =>
      this.addClicker(source),
    );
  },
  addClicker: function (source) {
    document
      .getElementById("option-" + source)
      .addEventListener("click", () => {
        application.stopCurrentSequence();
        application.addSequence(source);
      });
  },

  clickCinco: function () {
    this.show("#window-welcome");
    this.show("#window-prompt");

    application.changeTextPrompt("Good morning, Paul.");

    this.embedStop();
    this.audioStop();
  },

  clickOriginal: function () {
    this.clickCinco();
    this.show("#window-original");
    this.embedStart();
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

  embedStart: function (e) {
    // var youtubeArgs = { event: "command", func: "playVideo", args: "" },
    //   iframe = document
    //     .querySelector("#window-original")
    //     .getElementsByTagName("iframe")[0].contentWindow;
    // iframe.postMessage(JSON.stringify(youtubeArgs), "*");
  },

  embedStop: function (e) {
    // var youtubeArgs = { event: "command", func: "pauseVideo", args: "" },
    //   iframe = document
    //     .querySelector("#window-original")
    //     .getElementsByTagName("iframe")[0].contentWindow;
    // iframe.postMessage(JSON.stringify(youtubeArgs), "*");
  },

  playAudio: async function (file) {
    await new Audio(file).play();
  },

  audioStop: function () {
    document
      .querySelectorAll("#cinco-audio audio")
      .forEach((elem) => elem.pause());
  },

  audioStart: function (sequence) {
    document.getElementById("audio-" + sequence).play();
  },

  createVideoWindow: function (source) {
    var win = this.createWindow(source.id);
    for (var coord in source.position) {
      win.style[coord] = source.position[coord];
    }

    return win;
  },

  createWindow: function (id) {
    var elem = document.getElementById(id),
      options = {
        handle: ".window-titlebar",
      };

    new Draggabilly(elem, options);

    return elem;
  },

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
