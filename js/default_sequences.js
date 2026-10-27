var default_sequences = {
  "celery man": {
    title: "Celery Man",
    loading: true,
    prompt: "Yes, Paul.",
    beep: true,
    clear: true,
    music: "audio/music/celery.mp3",
    windows: [
      {
        id: "celery3",
        media: "celery3.mp4",
        position: { top: "10%", left: "55%" },
      },
      {
        id: "celery4",
        media: "celery4.mp4",
        position: { top: "15%", left: "10%" },
      },
    ],
    modes: {
      "4d3d3d3": {
        title: "Celery Man",
        prompt: "4d3d3d3 Engaged.",
        loading: false,
        autoType: "add sequence: OYSTER",
        clearTextPrompt: false,
        windows: [
          {
            media: "celery1.mp4",
            position: { top: "10%", left: "10%" },
          },
          {
            media: "celery2.mp4",
            position: { top: "10%", left: "45%" },
          },
        ],
      },
    },
  },
  oyster: {
    title: "Oyster",
    prompt: null,
    audio: "audio/voice/add_sequence_oyster.mp3",
    music: "audio/music/oyster.mp3",
    loading: false,
    wait: 500,
    windows: [
      {
        id: "oyster1",
        media: "oyster1.mp4",
        position: { top: "10%", left: "25%" },
      },
      {
        id: "oyster2",
        media: "oyster2.mp4",
        position: { top: "25%", left: "5%" },
      },
      {
        id: "oyster3",
        media: "oyster3.mp4",
        position: { top: "40%", left: "45%" },
      },
    ],
  },
  tayne: [
    {
      music: null,
      clear: true,
      prompt: "I have a BETA sequence I have been working on.",
      wait: 2500,
    },
    {
      prompt: "Would you like to see it?",
      waitForSpeech: ["sure", "alright", "all right", "okay"],
    },
    {
      loading: true,
      prompt: "",
      title: "Tayne",
      windows: [
        {
          id: "tayne1",
          media: "sequences/tayne/tayne1.mp4",
          position: { top: "20%", left: "55%" },
        },
        {
          id: "tayne2",
          media: "sequences/tayne/tayne2.mp4",
          position: { top: "20%", left: "5%" },
        },
        {
          id: "tayne18",
          media: "sequences/tayne/tayne18.png",
          position: { top: "30%", left: "30%" },
        },
      ],
    },
    {
      title: "Tayne",
      clear: true,
      music: "sequences/tayne/tayne.mp3",
      windows: [
        {
          media: "sequences/tayne/tayne3.mp4",
          position: { top: "30%", left: "15%" },
        },
        {
          media: "sequences/tayne/tayne3.mp4",
          position: { top: "30%", left: "40%" },
        },
        {
          media: "sequences/tayne/tayne3.mp4",
          position: { top: "30%", left: "65%" },
        },
      ],
    },
  ],
};
