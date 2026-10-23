let command = {
  curseWords: ["fuck", "shit", "damn", "cunt", "ass", "dick", "prick"],

  retorts: [],

  executors: {
    clear: () => {
      desktop.clearVideos();
      music.stop();
    },
    load: (command_string) => {
      command.executors.clear();
      command.executors["add sequence"](command_string);
    },
    "add sequence": (command) => {
      console.log("Add sequence: " + command);
      let matching = Object.entries(sequences)
        .filter(([name, sequence]) => command.includes(name))
        .map(([name, sequence]) => sequence);

      if (matching.length > 0) {
        // TODO add multiple
        application.selectSequence(matching[0]);
        application.renderCurrentFrame();
      } else {
        application.selectSequence(sequences["sequence_not_found"]);
      }
    },
  },

  execute: async function (command_string) {
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
      matching[0](command_string);
    }
  },
};
