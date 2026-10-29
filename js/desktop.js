let desktop = {
  changeTextPrompt: async function (text) {
    if (text == "") {
      document.querySelector("#window-prompt .window-content").innerHTML = "";
      return;
    }

    desktop.show("#window-prompt");
    var textPromptContent = "";
    for (const char of text) {
      textPromptContent += char;
      document.querySelector("#window-prompt .window-content").innerHTML =
        textPromptContent;
      await new Promise((r) => setTimeout(r, 50));
    }

    await new Promise((r) => setTimeout(r, 300));
  },

  say: function (text) {
    return Promise.all([desktop.changeTextPrompt(text), voice.speak(text)]);
  },

  cycleWindows: async function (sequence, timing = 5000) {
    let id = setInterval(() => {
      if (state.sequence != sequence) clearInterval(id);

      let windows = Array.from(
        document.querySelectorAll(".window." + sequence.title),
      );
      if (windows.length != 0) {
        let sources = windows.map((w) => w.id);

        let removal = windows[0];
        if (removal) desktop.hide(removal);
        setTimeout(() => removal.remove(), 500);

        let next = sequence.windows.filter(
          (w) => !sources.some((s) => s === util.hash(w.media) + ""),
        );

        desktop.addWindows(sequence.title, [util.selectRandom(next)]);
      }
    }, timing);
  },

  addWindows: async function (title, windows, spaceOut = true) {
    console.log("Add sequence: " + title);

    desktop.hide("#window-welcome");

    var tick = null;
    if (spaceOut) {
      tick = 500 * Math.random() + 300;
    } else {
      tick = 0;
    }

    await util.shuffle(windows).reduce((promise, source) => {
      const win = desktop.buildVideo(title, source);
      return promise.then(
        () =>
          new Promise((resolve) =>
            setTimeout(() => {
              desktop.placeVideoWindow(win, source);
              resolve();
            }, tick),
          ),
      );
    }, Promise.resolve());
  },

  warning: function () {
    state.warning = true;

    desktop.show("#warning");
    sounds.warning();

    let id = setInterval(() => {
      let warning_text = document.querySelector("#warning-text");
      if (state.warning === false) {
        desktop.hide("#warning");
        clearInterval(id);
      }
      if (warning_text.classList.contains("hidden")) {
        desktop.show("#warning-text", (animation = false));
        sounds.warning();
      } else {
        desktop.hide("#warning-text", (animation = false));
      }
    }, 500);
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
      image.classList = "media";

      subelement = image;
    } else if (source.media.endsWith(".mp4")) {
      var video = document.createElement("video");
      video.classList = "media";

      let once = source.once == null ? false : source.once;

      video.src = source.media;
      video.autoplay = true;
      video.loop = !once;
      video.muted = source.audio == null ? true : !source.audio;
      video.preload = "auto";

      subelement = video;
    }

    var win = document.createElement("div");
    win.id = util.hash(source.media);
    win.className = "window window-video " + title;
    win.innerHTML = titlebar;
    win.insertAdjacentElement("beforeend", subelement);

    let once = source.once == null ? false : source.once;
    if (once) {
      subelement.loop = false;
      subelement.addEventListener(
        "ended",
        () => {
          desktop.hide(win);
        },
        { once: true },
      );
    }

    return win;
  },

  loadingWindow: async function (selector, hide = true, sound = true) {
    desktop.show(selector);
    if (sound) sounds.playLoading();
    for (
      var progress = 0;
      progress < 100;
      progress += Math.trunc(10 * Math.random())
    ) {
      await new Promise((r) => setTimeout(r, 50));
      document.querySelector(selector + " progress").value = progress;
    }
    if (hide) {
      desktop.hide(selector);
    }
  },

  resetLoader: function () {
    desktop.hide("#window-loader");
    document.querySelector("#window-loader progress").value = 0;
  },

  clearVideos: function () {
    document.querySelectorAll(".window-video").forEach((el) => el.remove());
  },

  loadWelcome: async function () {
    sounds.boot();
    await desktop.loadingWindow(
      "#window-welcome",
      (hide = false),
      (sound = false),
    );
  },

  lock: function () {
    state.lock = true;
  },

  unlock: function () {
    state.lock = false;
  },

  sendCommand: async function () {
    let command_input = document.querySelector("#command-input");

    state.inputing = false;
    let command_string = command_input.innerHTML;

    if (
      state.sequence.clearTextPrompt ||
      state.sequence.clearTextPrompt === undefined
    ) {
      command_input.innerHTML = "";
    }

    command_input.blur();
    await command.execute(command_string);
  },

  boot: async function () {
    console.log("Booting...");
    state.booted = true;

    music.stop();

    desktop.clearVideos();

    desktop.show("#window-welcome");

    await desktop.loadWelcome();

    let typing_queue = Promise.resolve();

    document.addEventListener("keydown", (event) => {
      typing_queue.then(() => {
        if (state.lock) return;

        let command_input = document.querySelector("#command-input");

        if (state.sequence.autoType) {
          if (!state.inputing) {
            command_input.innerHTML = "";
            state.inputing = true;
          }

          command_input.innerHTML += state.sequence.autoType.slice(0, 1);
          state.sequence.autoType = state.sequence.autoType.slice(1);
          return;
        }

        if (state.sequence.autoType === "") {
          state.sequence.autoType = null;
          desktop.sendCommand();
          return;
        }

        if (event.ctrlKey || event.altKey || event.metaKey) return;

        if (state.inputing && event.key == "Enter") {
          desktop.sendCommand();
        } else if (state.inputing && event.key == "Backspace") {
          command_input.innerHTML = command_input.innerHTML.slice(0, -1);
        } else if (!state.inputing && event.key == " ") {
          sounds.prompt();
          voice_recognition.listen();
        } else if (event.key.length === 1) {
          if (!state.inputing) {
            command_input.innerHTML = "";
            state.inputing = true;
          }

          command_input.innerHTML += event.key;
        }
      });
    });

    state.sequence = sequences.base;

    await application.renderSequence(sequences.base);

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

  remove: function (selector) {
    var element;
    if (typeof selector === "string") {
      element = document.querySelector(selector);
    } else {
      element = selector;
    }

    desktop.hide(selector);

    selector.addEventListener(
      "animationend",
      () => {
        element.remove();
      },
      { once: true },
    );
  },

  hide: function (selector, animation = true) {
    var element;
    if (typeof selector === "string") {
      element = document.querySelector(selector);
    } else {
      element = selector;
    }

    if (animation) {
      element.classList.add("hiding");
    } else {
      element.classList.add("hidden");
    }

    if (animation) {
      element.addEventListener(
        "animationend",
        () => {
          element.classList.remove("hiding");
          element.classList.add("hidden");
        },
        { once: true },
      );
    }
  },

  show: function (selector, animation = true) {
    var element;
    if (typeof selector === "string") {
      element = document.querySelector(selector);
    } else {
      element = selector;
    }

    if (!element.classList.contains("hidden")) {
      return;
    }

    element.classList.remove("hidden");
    if (animation) element.classList.add("showing");

    if (animation) {
      element.addEventListener(
        "animationend",
        () => {
          element.classList.remove("showing");
        },
        { once: true },
      );
    }
  },

  moveWindow: function (window, x, y, step = 3, trail = 5, tick = 250) {
    let left = parseInt(window.style.left);
    let top = parseInt(window.style.top);

    let trail_windows = [];

    let direction = left < x ? "right" : "left";

    let desktop = document.querySelector("#desktop");

    let id = setInterval(() => {
      top += step;
      left += step;

      let w = window.cloneNode(true);

      let srcObject = window.querySelector(".media").captureStream();
      let media = w.querySelector(".media");

      if (media.matches("video")) {
        media.removeAttribute("src");
        media.srcObject = srcObject;
      }

      window.style.left = left + "%";
      window.style.top = top + "%";

      trail_windows.push(w);

      window.before(w);

      if (trail_windows.length > trail) {
        let win = trail_windows.shift();
        win.remove();
      }

      if (direction === "right" && left >= x) {
        clearInterval(id);
      }
    }, tick);
  },

  placeVideoWindow: (() => {
    const mod = 64;
    const inc = 23;
    const rows = 4;
    const columns = 16;

    let i = Math.floor(mod * Math.random());

    const x_mul = 100 / (columns + 3);
    const y_mul = 100 / (rows + 3);

    return function (win, source) {
      let desktop_element = document.getElementById("desktop");

      requestAnimationFrame(() => {
        win.classList.add("hidden");
        desktop_element.insertAdjacentElement("beforeend", win);

        requestAnimationFrame(() => {
          var x, y;
          if (source.position) {
            x = source.position.left;
            y = source.position.top;
          } else {
            let x_jitter = 5 * Math.random();
            let y_jitter = 10 * Math.random();

            x_jitter -= x_jitter / 2;
            y_jitter -= y_jitter / 2;

            x = x_mul * (i % columns);

            y = y_mul * Math.trunc(i % rows) + y_jitter;

            x += x_jitter;
            y += y_jitter;

            i += inc;
            i %= mod;

            x += "%";
            y += "%";
          }

          requestAnimationFrame(() => {
            win.style.left = x;
            win.style.top = y;
            desktop.show(win);
          });
        });
      });

      return win;
    };
  })(),

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
};
