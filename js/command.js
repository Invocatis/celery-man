let command = {
  curseWords: ["fuck", "shit", "damn", "cunt", "ass", "dick", "prick"],

  retorts: [
    "no u",
    "your mom",
    "proud of you",
    "c'mon",
    "don't be like that",
    "curse words are the crutch of the intellectually incompetent",
  ],

  get_mode: function (sequence, command_string) {
    if (!sequence.modes) return [];
    return Object.entries(sequence.modes)
      .filter(([name, _]) => command_string.includes(name))
      .map(([name, mode]) => mode);
  },

  executors: {
    clear: () => {
      desktop.clearVideos();
      music.stop();
    },
    load: (command_string) => {
      command.executors.clear();
      command.executors["add sequence"](command_string);
    },
    "add sequence": async (command_string) => {
      console.log("Add sequence: " + command_string);

      let sequence = Object.entries(sequences)
        .filter(([name, _]) => command_string.includes(name))
        .sort((a, b) => b[0].length - a[0].length)
        .map(([name, sequence]) => sequence);

      if (sequence.length > 0) {
        sequence = sequence[0];
        modes = command.get_mode(sequence, command_string);
        if (modes.length > 0) {
          state.sequence = mode[0];
        } else {
          state.sequence = sequence;
        }
        await application.renderSequence(state.sequence);
      } else {
        await application.renderSequence(sequences["sequence_not_found"]);
      }
    },
    engage: async (command_string) => {
      if (!state.sequence) {
        desktop.say("Sequence not selected");
        return;
      }

      let matching = Object.entries(state.sequence.modes)
        .filter(([name, _]) => command_string.includes(name))
        .map(([name, mode]) => mode);

      if (matching.length === 0) {
        desktop.say("Not supported");
        return;
      }

      state.sequence = matching[0];
      await application.renderSequence(matching[0]);
    },
    print: async (command_string) => {
      let sequence = Object.entries(sequences)
        .filter(([name, _]) => command_string.includes(name))
        .map(([name, sequence]) => sequence)[0];

      let modes = command.get_mode(sequence, command_string);

      var file;
      if (modes.length > 0) {
        let mode = modes[0];
        file = util.selectRandom(
          mode.windows
            .filter((w) => w.media.endsWith(".jpg") || w.media.endsWith(".png"))
            .map((w) => w.media),
        );
      } else {
        file = util.selectRandom(
          sequence.windows
            .filter((w) => w.media.endsWith(".jpg") || w.media.endsWith(".png"))
            .map((w) => w.media),
        );
      }

      console.log(file);

      if (file) {
        await fetch("/print" + file);
      }
    },
  },

  execute: async function (command_string) {
    chaos.enact_chaos();
    chaos.increment_chaos();
    command_string = command_string.toLowerCase();
    console.log("execute: " + command_string);
    if (
      command.curseWords.filter((c) => command_string.includes(c)).length != 0
    ) {
      desktop.say(util.selectRandom(command.retorts));
      return;
    }

    let matching = Object.entries(command.executors)
      .map(([key, executor]) => ({
        index: command_string.indexOf(key),
        executor: executor,
      }))
      .filter((match) => match.index >= 0)
      .sort((a, b) => a.index - b.index)
      .map((e) => e.executor);

    console.log(matching);

    if (matching.length === 0) {
      desktop.say("Malformed command");
    } else {
      await matching[0](command_string);
    }
  },
};
