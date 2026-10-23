function listen() {
  console.log("listening ...");

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    status.textContent = "Speech recognition is unsupported.";
  } else {
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      let transcript =
        event.results[event.results.length - 1][0].transcript.toLowerCase();

      console.log("heard: " + transcript);

      command.execute(transcript);
    };

    recognition.onerror = (event) => {
      console.log("Error: " + event.error);
    };

    recognition.onend = () => {
      console.log("Stopped.");
    };

    recognition.start();
  }
}
