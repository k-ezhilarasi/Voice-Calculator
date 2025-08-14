function startListening() {
  const output = document.getElementById("output");

  // Speech Recognition Setup
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();

  output.innerText = "🎧 Listening...";

  recognition.onresult = function(event) {
    const spokenText = event.results[0][0].transcript;
    output.innerText = "🔊 You said: " + spokenText;

    const expression = convertToMath(spokenText);
    try {
      const result = eval(expression);
      output.innerText += `\n🧮 ${expression} = ${result}`;
    } catch (e) {
      output.innerText += "\n❌ Error in expression";
    }
  };

  recognition.onerror = function() {
    output.innerText = "❌ Voice not recognized. Try again.";
  };
}

function convertToMath(spokenText) {
  const wordsToNumbers = {
    "zero": "0", "one": "1", "two": "2", "three": "3",
    "four": "4", "five": "5", "six": "6", "seven": "7",
    "eight": "8", "nine": "9", "ten": "10"
  };

  const operators = {
    "plus": "+", "minus": "-", "times": "*",
    "multiplied by": "*", "into": "*",
    "divided by": "/", "over": "/"
  };

  let expression = spokenText;

  for (let word in wordsToNumbers) {
    const regex = new RegExp("\\b" + word + "\\b", "g");
    expression = expression.replace(regex, wordsToNumbers[word]);
  }

  for (let word in operators) {
    const regex = new RegExp("\\b" + word + "\\b", "g");
    expression = expression.replace(regex, operators[word]);
  }

  return expression.replace(/[^0-9+\-*/(). ]/g, "").trim();
}
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(() => {
    console.log("✅ Service Worker Registered!");
  });
}
