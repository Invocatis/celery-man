let prerecordings = {
  "4d3d3d3 engaged": "4d3d3d3.mp3",
  "add sequence oyster": "add_sequence_oyster.mp3",
  "good morning paul": "good_morning_paul.mp3",
  "i have a beta sequence i have been working on": "beta_sequence.mp3",
  "not computing": "not_computing.mp3",
  "please repeat": "please_repeat.mp3",
  "what will your first sequence of the day be": "what_will_your.mp3",
  "would you like to see it": "would_you_like_to_see_it.mp3",
  "yes paul": "yes_paul.mp3",
  yes: "yes.mp3",
  "this is not suitable for work": "nsfw.mp3",
  "are you sure": "are_you_sure.mp3",
  okay: "okay.mp3",
};

var asdf = null;

let voice = {
  speak: function (text) {
    let simple_text = text.toLowerCase().replaceAll(/[^0-9a-z\s]/g, "");

    console.log("Speaking: " + simple_text);

    if (prerecordings[simple_text]) {
      return sounds.play("audio/voice/" + prerecordings[simple_text]);
    } else {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();

      // Prefer a male-sounding English voice if one exists, otherwise use any English voice
      const voice = voices.find((v) => v.lang.startsWith("en")) || voices[2];

      const u = new SpeechSynthesisUtterance(text);
      u.voice = voice;
      u.pitch = 1; // lowest allowed (range 0–2)
      u.rate = 0.9; // clip is fast, about 5 syllables/sec
      u.volume = 1;

      asdf = u;

      synth.cancel();
      synth.speak(u);
    }
  },
};
