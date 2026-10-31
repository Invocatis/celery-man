let desktop = {
  changeTextPrompt: async function (text) {
    let prompt = document.querySelector("#window-prompt .window-content");
    if (text == "") {
      prompt.innerHTML = "";
      return;
    }

    if (text === prompt.innerHTML) {
      return;
    }

    desktop.show("#window-prompt");
    var textPromptContent = "";
    for (const char of text) {
      textPromptContent += char;
      prompt.innerHTML = textPromptContent;
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
        let sources = windows.map((w) => w.querySelector("[src]").src);

        let removal = windows[0];
        if (removal) desktop.hide(removal);
        setTimeout(() => removal.remove(), 500);

        let next = sequence.windows.filter(
          (w) => !sources.some((s) => s.includes(w.media)),
        );

        desktop.addWindows(sequence, [util.selectRandom(next)]);
      }
    }, timing);
  },

  addWindows: function (sequence, windows, spaceOut = true) {
    let title = sequence.title;

    let add_to;

    if (sequence.container) {
      let div = document.createElement("div");
      div.id = sequence.id + "-container";
      div.className = "extra-container";

      document.getElementById("desktop").appendChild(div);

      add_to = div;
    } else {
      add_to = document.getElementById("desktop");
    }

    var tick = null;
    if (spaceOut) {
      tick = 500 * Math.random() + 300;
    } else {
      tick = 0;
    }

    let promises = [];
    let window_elements = [];

    let time = tick;

    for (let source of windows) {
      const win = desktop.buildVideo(sequence, source);
      window_elements.push(win);
    }

    function add(win, source, t) {
      let p = new Promise((resolve) =>
        setTimeout(() => {
          desktop.placeVideoWindow(
            add_to,
            win,
            source,
            (hidden = false),
            (arranged = sequence.arranged),
          );
          resolve();
        }, t),
      );
      promises.push(p);
    }

    for (let i = 0; i < windows.length; i++) {
      let win = window_elements[i];
      let source = windows[i];

      let t = source.time === undefined ? (time += tick) : source.time;

      if (source.swap) {
        let p = new Promise((resolve) =>
          setTimeout(() => {
            if (state.sequence != sequence) return;
            let id = source.swap;
            let swap_to = document.querySelector("#" + id + " .media");

            if (!swap_to && source.addIfNoSwap) {
              add(win, source, t);
              return;
            }
            let { width, height } = swap_to.getBoundingClientRect();

            swap_to.style.width = width + "px";
            swap_to.style.height = height + "px";

            let to_flash = document.getElementById(id);
            desktop.flash(to_flash, () => {
              swap_to.src = source.media;
            });
            resolve();
          }, t),
        );

        promises.push(p);
      } else if (sequence.sync) {
        desktop.placeVideoWindow(
          add_to,
          win,
          source,
          (hidden = true),
          (arranged = sequence.arranged),
        );
        let p = new Promise((resolve) =>
          setTimeout(() => {
            desktop.show(win);
            resolve();
          }, t),
        );
        promises.push(p);
      } else {
        add(win, source, t);
      }
    }

    return [window_elements, Promise.all(promises)];
  },

  flash: function (win, inbetween = () => {}) {
    const r = win.getBoundingClientRect();
    const flash = document.createElement("div");
    flash.className = "flash up";
    win.appendChild(flash);
    flash.addEventListener("animationend", (e) => {
      if (e.animationName === "flash-up") {
        inbetween();
        flash.className = "flash down";
      } else if (e.animationName === "flash-up") {
        flash.remove();
      }
    });
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

  buildVideo: function (sequence, source) {
    let title = sequence.title;
    var titlebar = `
            <div>

              <div class="window-titlebar">
                  <button type="button" class="btn-close" title="Close"><i class="fa fa-2x fa-minus"></i></button>
                  <button type="button" class="btn-move" title="Move"><i class="fa fa-2x fa-caret-up"></i></button>
                  <button type="button" class="btn-move" title="Move"><i class="fa fa-2x fa-caret-down"></i></button>
              </div>
              <div class="window-titlebar">
                  <span class="title">${title}</span>
              </div>
            </div>
        `;

    var subelement = null;

    if (source.media.endsWith(".jpg") || source.media.endsWith(".png")) {
      var image = document.createElement("img");
      image.src = source.media;
      image.classList = "media";

      subelement = image;
    } else if (
      source.media.endsWith(".mp4") ||
      source.media.endsWith(".webm")
    ) {
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

    if (source.size) {
      if (source.size.height) subelement.height = source.size.height;
      if (source.size.width) subelement.width = source.size.width;
    }

    var win = document.createElement("div");

    var file_name = source.media.split("/");
    file_name = file_name[file_name.length - 1];
    file_name = file_name.split(".")[0];
    win.id = source.id || file_name;
    if (source.window === undefined || source.window) {
      win.className = "window window-video " + sequence.id;
      win.innerHTML = titlebar;
    } else {
      win.className = "window-container";
    }
    win.insertAdjacentElement("beforeend", subelement);

    let once = source.once == undefined ? false : source.once;
    let persist = source.persist == undefined ? false : source.persist;
    if (once) {
      subelement.loop = false;
      if (!persist) {
        subelement.addEventListener(
          "ended",
          () => {
            desktop.hide(win);
          },
          { once: true },
        );
      }
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

    document.querySelector(selector + " progress").value = 100;
    if (hide) {
      desktop.hide(selector);
    }
  },

  resetLoader: function () {
    desktop.hide("#window-loader");
    document.querySelector("#window-loader progress").value = 0;
  },

  clearVideos: function () {
    document.querySelectorAll(".extra-container").forEach((el) => el.remove());
    document.querySelectorAll(".window-video").forEach((el) => el.remove());
    document.querySelectorAll(".window-container").forEach((el) => el.remove());
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
    voice_recognition.initialize();

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
      try {
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
      } catch (exception) {
        console.log(exception);
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

    return function (add_to, win, source, hidden = false, arranged = false) {
      requestAnimationFrame(() => {
        win.classList.add("hidden");
        add_to.insertAdjacentElement("beforeend", win);

        requestAnimationFrame(() => {
          if (source.position) {
            win.style.left = source.position.left;
            win.style.top = source.position.top;
          } else if (arranged) {
          } else {
            var x, y;
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

            win.style.left = x;
            win.style.top = y;
          }

          requestAnimationFrame(() => {
            if (!hidden) {
              desktop.show(win);
              let video = win.querySelector("video");
              if (video != null) {
                video.play();
              }
            }
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
