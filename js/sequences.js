var sequences = {
  sequence_not_found: {
    prompt: "Sequence not found",
  },
  clear: {
    clear: true,
    music: null,
    prompt: "",
  },
  base: {
    frames: [
      {
        prompt: "Good morning, Paul.",
        wait: 500,
      },
      {
        prompt: "What will your first sequence of the day be?",
      },
    ],
  },
  nsfw: {
    frames: [
      {
        prompt: "This is not suitable for work",
        warning: true,
        wait: 500,
        music: null,
        warning: true,
      },
      {
        prompt: "Are you sure?",
        warning: true,
        waitForAffirmation: true,
        warning: true,
      },
    ],
  },
};

let sequence = {
  loadSequence: async function (path) {
    let root = "/sequences/" + path.join("/") + "/";
    let files = await fetch(root).then((r) => r.json());

    let music = files.filter((x) => x.name.endsWith(".mp3"));

    let visualMedia = files.filter(
      (x) =>
        x.name.endsWith(".mp4") ||
        x.name.endsWith(".webm") ||
        x.name.endsWith(".png") ||
        x.name.endsWith(".jpg"),
    );

    let windows = [];
    for (let file of visualMedia) {
      windows.push({
        media: root + file.name,
      });
    }

    let modes_array = await Promise.all(
      files
        .filter((f) => f.type === "directory")
        .map(async (f) => {
          let p = path.slice();
          p.push(f.name);
          let s = await sequence.loadSequence(p);
          return [f.name, s];
        }),
    );

    let modes = Object.fromEntries(modes_array);

    let title = path[path.length - 1];

    let f = files.filter((x) => x.name.endsWith(".json"));
    var sequence_stub = {};

    // ADD CSS
    files
      .filter((f) => f.name.endsWith(".css"))
      .forEach((f) => {
        const style = document.createElement("link");
        style.rel = "stylesheet";
        style.href = root + f.name;
        document.head.append(style);
      });

    let nsfw = title == "nude" || title == "nsfw";

    let parseFromFile = function (sequence_stub) {
      if (sequence_stub.frames) {
        sequence_stub.frames = sequence_stub.frames.map(parseFromFile);
        return sequence_stub;
      }
      if (sequence_stub.windows) {
        sequence_stub.windows.forEach((w) => (w.media = root + w.media));
      }

      let file_name = path[path.length - 1].split(".")[0];
      sequence_stub.id = file_name.replace(" ", "-");
      sequence_stub.title = sequence_stub.title || path[path.length - 1];
      sequence_stub.loading =
        sequence_stub.loading === undefined ? false : sequence_stub.loading;
      sequence_stub.modes = sequence_stub.modes || modes;
      sequence_stub.nsfw = sequence_stub.nsfw || nsfw;
      if (sequence_stub.music) {
        sequence_stub.music = root + sequence_stub.music;
      }

      if (sequence_stub.nsfw) {
        sequence_stub.audio = "audio/computer/nsfw.mp3";
        sequence_stub.prompt = null;
        sequence_stub.clear = true;
      }

      return sequence_stub;
    };

    if (f.length != 0) {
      let r = await fetch(root + f[0].name);

      let body = await r.text();

      sequence_stub = JSON.parse(body);

      if (Array.isArray(sequence_stub)) {
        sequence_stub = sequence_stub.map((s) => parseFromFile(s));
      } else {
        sequence_stub = parseFromFile(sequence_stub);
      }
    } else {
      if (title == "nude") {
        let who = path[path.length - 2];
        title += " " + who;
      }

      sequence_stub = {
        id: path.join(".").replace(" ", "-"),
        title: title,
        music: music.length > 0 ? root + music[0].name : "",
        windows: windows,
        loading: true,
        modes: modes,
        prompt: "random",
        nsfw: nsfw,
      };
    }

    return sequence_stub;
  },

  loadExternalSequences: async function () {
    console.log("Loading external sequnces");
    let response = await fetch("/sequences/");

    if (response.status === 404) {
      sequences = default_sequences;
    } else {
      let folders = await response.json();

      for (let folder of folders) {
        sequences[folder.name] = await sequence.loadSequence([folder.name]);
      }
    }
  },
};
