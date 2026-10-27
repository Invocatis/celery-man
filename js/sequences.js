var sequences = {
  sequence_not_found: {
    prompt: "Sequence not found",
  },
  clear: {
    clear: true,
    music: null,
    prompt: "",
  },
  base: [
    {
      prompt: "Good morning, Paul.",
      wait: 500,
    },
    {
      prompt: "What will your first sequence of the day be?",
    },
  ],
  nsfw: [
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
};

let sequence = {
  loadSequence: async function (path) {
    let root = "/sequences/" + path.join("/") + "/";
    let files = await fetch(root).then((r) => r.json());

    let music = files.filter((x) => x.name.endsWith(".mp3"));

    let visualMedia = files.filter(
      (x) =>
        x.name.endsWith(".mp4") ||
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

    let nsfw = title == "nude";

    if (f.length != 0) {
      let r = await fetch(root + f[0].name);

      let body = await r.text();

      sequence_stub = JSON.parse(body);

      if (sequence_stub.windows) {
        sequence_stub.windows.forEach((w) => (w.media = root + w.media));
      }

      sequence_stub.title = sequence_stub.title || path[path.length - 1];
      sequence_stub.music =
        sequence_stub.music || music.length > 0 ? root + music[0].name : "";
      sequence_stub.windows = sequence_stub.windows || windows;
      sequence_stub.loading =
        sequence_stub.loading === undefined ? false : sequence_stub.loading;
      sequence_stub.modes = sequence_stub.modes || modes;
      sequence_stub.prompt =
        sequence_stub.prompt === null ? null : sequence_stub.prompt || "random";
      sequence_stub.nsfw = sequence_stub.nsfw || nsfw;
    } else {
      if (title == "nude") {
        let who = path[path.length - 2];
        title += " " + who;
      }

      sequence_stub = {
        title: title,
        music: music.length > 0 ? root + music[0].name : "",
        windows: windows,
        loading: true,
        modes: modes,
        prompt: "random",
        nsfw: nsfw,
      };
    }

    if (sequence_stub.nsfw) {
      sequence_stub.audio = "audio/computer/nsfw.mp3";
      sequence_stub.prompt = null;
      sequence_stub.clear = true;
    }

    return sequence_stub;
  },

  loadExternalSequences: async function () {
    console.log("Loading external sequnces");
    let response = await fetch("/sequences/");

    if (response.status === 404) {
      state.sequences = default_sequences;
    } else {
      let folders = await response.json();

      for (let folder of folders) {
        sequences[folder.name] = await sequence.loadSequence([folder.name]);
      }
    }
  },
};
