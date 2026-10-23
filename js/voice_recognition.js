function listen() {
  state.listening = true;
}

function listen_to_all() {
  console.log("listening ...");

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    status.textContent = "Speech recognition is unsupported.";
  } else {
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      let transcript = event.results[event.results.length - 1][0].transcript
        .toLowerCase()
        .trim();

      console.log("heard: " + transcript);

      console.log("computer" === transcript);

      if (state.listening) {
        command.execute(transcript);
        state.listening = false;
      } else if (transcript === "computer") {
        state.listening = true;
        desktop.say("Yes?");
      }
    };

    recognition.onerror = (event) => {
      console.log("Error: " + event.error);
    };

    recognition.onend = () => {
      console.log("Stopped.");
      listen_to_all();
    };

    recognition.start();
  }
}
