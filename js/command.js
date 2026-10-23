let command = {
  curseWords: ["fuck", "shit", "damn", "cunt", "ass", "dick", "prick"],

  retorts: [
    "no u",
    "your mom",
    "eat my ass",
    "proud of you",
    "c'mon",
    "don't be like that",
    "curse words are the crutch of the intellectually incompetent",
  ],

  aliases: [
    [/(4|d|3|\s+){3,}/, "4d3d3d3"],
    [/.?ick (up|out)/, "engage"],
    [/new sequence/, "load sequence tayne"],
  ],

  executors: {
    clear: () => {
      desktop.clearVideos();
      music.stop();
    },
    load: (command_string) => {
      command.executors.clear();
      command.executors["add sequence"](command_string);
    },
    "add sequence": (command_string) => {
      console.log("Add sequence: " + command_string);
      let matching = Object.entries(sequences)
        .filter(([name, sequence]) => command_string.includes(name))
        .map(([name, sequence]) => sequence);

      if (matching.length > 0) {
        // TODO add multiple
        application.renderSequence(matching[0]);
      } else {
        application.renderSequence(sequences["sequence_not_found"]);
      }
    },
    engage: (command_string) => {
      if (!state.sequence) {
        desktop.say("Sequence not selected");
        return;
      }

      let matching = Object.entries(state.sequence.modes)
        .filter(([name, sequence]) => command_string.includes(name))
        .map(([name, sequence]) => sequence);

      if (matching.length === 0) {
        desktop.say("Not supported");
        return;
      }

      application.renderSequence(matching[0]);
    },
  },

  execute: async function (command_string) {
    command_string = command_string.toLowerCase();
    console.log("execute: " + command_string);
    if (
      command.curseWords.filter((c) => command_string.includes(c)).length != 0
    ) {
      desktop.say(util.selectRandom(command.retorts));
      return;
    }

    for (let [from, to] of command.aliases) {
      if (from.test(command_string)) {
        command_string += " " + to;
      }
    }

    console.log("execute with alias: " + command_string);

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
