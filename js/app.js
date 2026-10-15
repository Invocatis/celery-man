var frames = {
  celery: {
    title: "Celery Man",
    windows: [
      { id: "celery1", position: { top: "15%", left: "5%" } },
      { id: "celery2", position: { top: "20%", left: "45%" } },
      { id: "celery3", position: { top: "40%", left: "25%" } },
      { id: "celery4", position: { top: "10%", left: "65%" } },
    ],
    renderer: function (app) {
      app.audioStop();
      app.audioStart("celery");

      this.windows
        .map((source) => app.createVideoWindow(source))
        .forEach((win) => (win.style.display = "block"));

      application.changeTextPrompt("4d3d3d3 Engaged.");
    },
  },

  celery: {
    title: "Celery Man",
    windows: [
      { id: "celery1", position: { top: "15%", left: "5%" } },
      { id: "celery2", position: { top: "20%", left: "45%" } },
      { id: "celery3", position: { top: "40%", left: "25%" } },
      { id: "celery4", position: { top: "10%", left: "65%" } },
    ],
    renderer: function (app) {
      app.audioStop();
      app.audioStart("celery");

      this.windows
        .map((source) => app.createVideoWindow(source))
        .forEach((win) => (win.style.display = "block"));

      application.changeTextPrompt("4d3d3d3 Engaged.");
    },
  },

  oyster: {
    title: "OYSTER",
    windows: [
      { id: "oyster1", position: { top: "10%", left: "25%" } },
      { id: "oyster2", position: { top: "25%", left: "5%" } },
      { id: "oyster3", position: { top: "40%", left: "45%" } },
    ],
    renderer: function (app) {
      app.audioStop();
      app.audioStart("celery");
      app.audioStart("oyster");

      this.windows
        .map((source) => app.createVideoWindow(source))
        .forEach((win) => (win.style.display = "block"));

      application.changeTextPrompt("add sequence: OYSTER");
    },
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
    renderer: function (app) {
      app.audioStop();
      app.audioStart("tayne");

      this.windows
        .map((source) => app.createVideoWindow(source))
        .forEach((win) => (win.style.display = "block"));

      application.changeTextPrompt(
        "I have a BETA sequence I have been working on",
      );
    },
  },

  mozza: {
    title: "MOZZA-RELL",
    windows: [
      { id: "mozza1", position: { top: "10%", left: "5%" } },
      { id: "mozza2", position: { top: "30%", left: "35%" } },
    ],
    renderer: function (app) {
      app.audioStop();
      app.audioStart("celery");

      this.windows
        .map((source) => app.createVideoWindow(source))
        .forEach((win) => (win.style.display = "block"));

      application.changeTextPrompt("Good morning, Paul.");
    },
  },
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
  },

  showSequence: async function (sequence) {
    var windows = frames[sequence].windows,
      renderer = frames[sequence].renderer.bind(frames[sequence]);

    application.embedStop();
    application.hide("#window-original");
    application.hide("#window-welcome");

    application.show("#window-loader");

    await application.loadingWindow("#window-loader progress");

    application.finishSequence(sequence);

    windows.forEach((source) => application.buildVideo(sequence, source.id));
  },

  buildVideo: function (sequence, source) {
    var filename = this.video_dir + "/" + source + ".mp4",
      title = frames[sequence].title,
      video = document.createElement("video");

    video.src = filename;
    video.autoplay = true;
    video.loop = true;
    video.preload = "auto";

    this.buildVideoWindow(source, title, video);
  },

  buildVideoWindow: function (id, title, video) {
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
    for (
      var progress = 100;
      progress < 100;
      progress += Math.trunc(10 * Math.random())
    ) {
      await new Promise((r) => setTimeout(r, 100));
      document.querySelector(selector).value = progress;
    }
  },

  finishSequence: function (sequence) {
    var showIdentity = function () {
      this.resetLoader();
      frames[sequence].renderer(this);
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

  keybinding: function (key, sequence) {
    document.addEventListener("keydown", (event) => {
      if (event.key == key) {
        application.stopCurrentSequence();
        application.showSequence(sequence);
      }
    });
  },

  initialize: function () {
    application.keybinding("c", "celery");
    application.keybinding("o", "oyster");
    application.keybinding("t", "tayne");
    application.keybinding("s", "mozza");

    this.hide("#window-welcome .progress");
    this.show("#window-welcome .options");
    this.show("#window-prompt");

    application.changeTextPrompt("Good morning, Paul.");

    ["celery", "oyster", "tayne", "mozza"].forEach((source) =>
      this.addClicker(source),
    );
  },
  addClicker: function (source) {
    document
      .getElementById("option-" + source)
      .addEventListener("click", () => {
        application.stopCurrentSequence();
        application.showSequence(source);
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
    document.querySelectorAll(".window-video").forEach((el) => el.remove());
  },

  embedStart: function (e) {
    var youtubeArgs = { event: "command", func: "playVideo", args: "" },
      iframe = document
        .querySelector("#window-original")
        .getElementsByTagName("iframe")[0].contentWindow;

    iframe.postMessage(JSON.stringify(youtubeArgs), "*");
  },

  embedStop: function (e) {
    var youtubeArgs = { event: "command", func: "pauseVideo", args: "" },
      iframe = document
        .querySelector("#window-original")
        .getElementsByTagName("iframe")[0].contentWindow;

    iframe.postMessage(JSON.stringify(youtubeArgs), "*");
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
