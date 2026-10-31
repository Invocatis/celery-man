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
    [/^(?!.*load.*nude)^(?!.*add sequence.*nude)nude/, "engage nsfw"],
    [/generate/, "engage"],
    [/can i get/, "engage"],
    [/(4|d|3|\s+){4,}/, "4d3d3d3"],
    [/boot/, "load"],
  ],

  misheardWords: [
    [/at sequence/, "add sequence"],
    [/call/, "kyle"],
    [/sequins/, "sequence"],
    [/cabin/, "gavin"],
    [/little/, "load up"],
    [/tain|ten|10|chain/, "tayne"],
    [/connor/, "conor"],
    [/and net|in net/, "annette"],
    [/devin|devon/, "devan"],
    [/doctor/, "dr"],
    [/hot/, "hat"],
  ],

  get_mode: function (sequence, command_string) {
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
