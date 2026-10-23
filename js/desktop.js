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
    desktop.changeTextPrompt(text);
    voice.speak(text);
  },

  addWindows: async function (title, windows) {
    console.log("Add sequence: " + title);

    desktop.hide("#window-original");
    desktop.hide("#window-welcome");

    await util.shuffle(windows).reduce((promise, source) => {
      const win = desktop.buildVideo(title, source);
      return promise.then(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => {
                desktop.placeVideoWindow(win, source);
                resolve();
              },
              500 * Math.random() + 300,
            ),
          ),
      );
    }, Promise.resolve());
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

  loadingWindow: async function (selector, hide = true) {
    desktop.show(selector);
    sounds.playLoading();
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
    await desktop.loadingWindow("#window-welcome", (hide = false));
  },

  lock: function () {
    state.lock = true;
  },

  unlock: function () {
    state.lock = false;
  },

  sendCommand() {
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
    command.execute(command_string);
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
          sounds.beep();
          listen();
        } else if (event.key.length === 1) {
          if (!state.inputing) {
            command_input.innerHTML = "";
            state.inputing = true;
          }

          command_input.innerHTML += event.key;
        }
      });
    });

    await application.renderSequence(sequences.base);

    listen_to_all();
    listen();
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
