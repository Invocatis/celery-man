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

  aliases: [
    [/.?ick (up|out)/, "engage"],
    [/new sequence/, "load sequence tayne"],
    [/nude/, "engage nsfw"],
    [/generate/, "engage"],
    [/(4|d|3|\s+){3,}/, "4d3d3d3"],
    [/boot/, "load"],
  ],

  misheardWords: [
    [/at sequence/, "add sequence"],
    [/call/, "kyle"],
    [/sequins/, "sequence"],
    [/cabin/, "gavin"],
    [/little/, "load up"],
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
    "add sequence": async (command_string) => {
      console.log("Add sequence: " + command_string);
      let matching = Object.entries(sequences)
        .filter(([name, sequence]) => command_string.includes(name))
        .map(([name, sequence]) => sequence);

      if (matching.length > 0) {
        // TODO add multiple
        state.sequence = matching[0];
        await application.renderSequence(matching[0]);
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
        .filter(([name, sequence]) => command_string.includes(name))
        .map(([name, sequence]) => sequence);

      if (matching.length === 0) {
        desktop.say("Not supported");
        return;
      }

      state.sequence = matching[0];
      await application.renderSequence(matching[0]);
    },
    print: async (command_string) => {},
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

    for (let [from, to] of command.misheardWords) {
      if (from.test(command_string)) {
        console.log("-------", from, to);
        command_string = command_string.replace(from, to);
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
      await matching[0](command_string);
    }
  },
};
