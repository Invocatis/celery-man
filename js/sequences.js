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

const sequenceLoadingStatements = [
  "add sequence: {sequence}",
  "initializing: {sequence}",
  "booting into: {sequence}",
  "let's give {sequence} a try",
  "perhaps {sequence} will suit your fancy",
  "this one looks like a tasty piece of meat",
  "confabulating {sequence}",
];

let sequence = {
  loadExternalSequences: async function () {
    console.log("Loading external sequnces");
    let folders = await fetch("http://localhost:8080/sequences/").then((r) =>
      r.json(),
    );

    for (let folder of folders) {
      let files = await fetch(
        "http://localhost:8080/sequences/" + folder.name,
      ).then((r) => r.json());

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
            prompt: util
              .selectRandom(sequenceLoadingStatements)
              .replace("{sequence}", folder.name),
          },
        ],
      };

      sequences[folder.name] = sequence;
    }
  },
};
