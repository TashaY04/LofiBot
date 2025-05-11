document.addEventListener("DOMContentLoaded", function () {
    const chatbox = document.getElementById("chatbox");
    const userInput = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");
  
    function appendMessage(sender, text) {
      const msg = document.createElement("div");
      msg.className = `message ${sender}`;
      msg.innerText = text;
      chatbox.appendChild(msg);
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  
    // Joke API URL (using an online API to get jokes)
    const jokeAPI = "https://official-joke-api.appspot.com/random_joke";
  
    async function fetchJoke() {
      try {
        const response = await fetch(jokeAPI);
        const data = await response.json();
        return `${data.setup} - ${data.punchline}`;
      } catch (error) {
        return "Oops! Couldn't fetch a joke. Try again later.";
      }
    }
  
    function getMoodRecommendations(mood) {
      switch (mood) {
        case "sad":
          return [
            "🎧 Listen to your favorite playlist and vibe to the music!",
            "🎬 Watch a feel-good movie or show to lighten the mood.",
            "📚 Read an inspiring book or listen to an audiobook."
          ];
        case "happy":
          return [
            "💪 Go for a walk and enjoy the fresh air.",
            "🎨 Try a new hobby or craft project to express your creativity.",
            "📝 Write down what you're grateful for today."
          ];
        case "angry":
          return [
            "🌬️ Try a quick meditation to calm your mind.",
            "💧 Hydrate and take a few deep breaths.",
            "🎯 Engage in a physical activity like yoga or a workout."
          ];
        case "excited":
          return [
            "🚀 Channel your energy into something creative like writing or drawing!",
            "🌍 Plan an exciting adventure or day out with friends.",
            "💡 Try learning something new that excites you!"
          ];
        default:
          return [
            "💬 Tell me more about how you're feeling, let's chat more!"
          ];
      }
    }
  
    function getBotResponse(message) {
      const lowerMsg = message.toLowerCase();
  
      // Mood-based responses
      if (lowerMsg.includes("sad") || lowerMsg.includes("upset")) {
        const recommendations = getMoodRecommendations("sad");
        return {
          message: "I'm here for you! 💛 Want to hear a joke to cheer you up?",
          recommendations
        };
      } else if (lowerMsg.includes("happy") || lowerMsg.includes("great")) {
        const recommendations = getMoodRecommendations("happy");
        return {
          message: "That's awesome! 🌟 Keep spreading those good vibes!",
          recommendations
        };
      } else if (lowerMsg.includes("angry") || lowerMsg.includes("frustrated")) {
        const recommendations = getMoodRecommendations("angry");
        return {
          message: "Take a deep breath 🌬️ and relax. How about a calming quote?\n'In the middle of difficulty lies opportunity.'",
          recommendations
        };
      } else if (lowerMsg.includes("excited") || lowerMsg.includes("joyful")) {
        const recommendations = getMoodRecommendations("excited");
        return {
          message: "Your excitement is contagious! 💫 How about a motivational quote?\n'Success is not final, failure is not fatal: It is the courage to continue that counts.'",
          recommendations
        };
      }
  
      // Joke-related responses
      else if (lowerMsg.includes("joke") || lowerMsg.includes("crack a joke")) {
        return fetchJoke();
      }
  
      // Fun fact response
      else if (lowerMsg.includes("fun fact") || lowerMsg.includes("tell me something interesting")) {
        return "Did you know? A group of flamingos is called a 'flamboyance'.";
      }
  
      // Default response
      else {
        return {
          message: "Tell me more about how you're feeling 😊 I'm all ears!",
          recommendations: ["💬 Let's chat! What's on your mind?"]
        };
      }
    }
  
    function handleSend() {
      const message = userInput.value.trim();
      if (message) {
        appendMessage("user", message);
        const response = getBotResponse(message);
  
        // If it's a joke, handle it asynchronously
        if (response instanceof Promise) {
          response.then((joke) => {
            setTimeout(() => appendMessage("bot", joke), 500);
          });
        } else {
          setTimeout(() => appendMessage("bot", response.message), 500);
  
          // Adding recommendations
          if (response.recommendations) {
            setTimeout(() => {
              response.recommendations.forEach((rec) => appendMessage("bot", `📌 Recommendation: ${rec}`));
            }, 1000);
          }
        }
  
        userInput.value = "";
      }
    }
  
    sendButton.addEventListener("click", handleSend);
    userInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") handleSend();
    });
  });
  