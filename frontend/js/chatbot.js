document.addEventListener("DOMContentLoaded", () => {
  // nodes
  const chatBtn = document.getElementById("chatBtn");
  const chatWindow = document.getElementById("chatWindow");
  const chatMessages = document.getElementById("chatMessages");
  const chatInput = document.getElementById("chatInput");

  if (!chatBtn || !chatWindow) return; // nothing to do

  // helper to open/close centrally
  function toggleChat(open) {
    // if open is undefined, toggle current
    const shouldOpen = typeof open === "boolean" ? open : !chatWindow.classList.contains("show");
    chatWindow.classList.toggle("show", shouldOpen);
    chatWindow.classList.toggle("hidden", !shouldOpen);
    chatWindow.setAttribute("aria-hidden", String(!shouldOpen));
    chatBtn.setAttribute("aria-expanded", String(shouldOpen));
  }

  // single click handler
  chatBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent document click from instantly closing
    toggleChat(); // toggles
    // focus input when opened
    if (chatWindow.classList.contains("show") && chatInput) chatInput.focus();
  });

  // close when clicking outside
  document.addEventListener("click", (e) => {
    if (!chatWindow.classList.contains("show")) return;
    if (!chatWindow.contains(e.target) && !chatBtn.contains(e.target)) {
      toggleChat(false);
    }
  });

  // close on Escape
  document.addEventListener("click", (e) => {
    if (!chatWindow.classList.contains("show")) return;

    // If click is NOT inside chatWindow and NOT on chatBtn → close
    if (!chatWindow.contains(e.target) && !chatBtn.contains(e.target)) {
      toggleChat(false);
    }
  });

  // Touch support (mobile)
  document.addEventListener("touchstart", (e) => {
    if (!chatWindow.classList.contains("show")) return;

    if (!chatWindow.contains(e.target) && !chatBtn.contains(e.target)) {
      toggleChat(false);
    }
  }, { passive: true });

  // Enter to send (and block default form submission if inside a form)
  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // Messaging functions (safe guards if chatMessages missing)
  function appendMessage(message, sender) {
    if (!chatMessages) return;
    const div = document.createElement("div");
    div.className = sender === "user" ? "msg user-msg" : "msg bot-msg";
    div.textContent = message;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function generateReply(input) {
    const s = (input || "").toLowerCase();
    if (s.includes("hello") || s.includes("hi")) return "Hello! How can I help you today?";
    if (s.includes("projects")) return "Check the Projects section — click any project card to open it.";
    if (s.includes("skills") || s.includes("tech")) return "I work with HTML, CSS, JS, React, Node.js and MongoDB.";
    if (s.includes("resume")) return "Download my resume from the Home section.";
    return "Ask me anything about my projects, skills, or resume.";
  }

  function sendMessage() {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;
    appendMessage(text, "user");
    chatInput.value = "";
    // fake reply
    setTimeout(() => {
      const reply = generateReply(text);
      appendMessage(reply, "bot");
    }, 500);
  }
});