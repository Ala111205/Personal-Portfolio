const contactForm = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    // basic validation
    if (!name || !email || !subject || !message) {
      showMsg("All fields are required.", true);
      return;
    }

    // basic email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMsg("Please enter a valid email.", true);
      return;
    }

    try {
      const res = await fetch("https://personal-portfolio-6qmz.onrender.com/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message })
      });

      const data = await res.json();
      if (data.success) {
        showMsg("Message sent successfully!", false);
        contactForm.reset();
      } else {
        showMsg("Error: " + data.msg, true);
      }
    } catch (err) {
      console.error(err);
      showMsg("Server error. Try again later.", true);
    }
  });
}

function showMsg(text, isError = false) {
  formMsg.textContent = text;
  formMsg.style.color = isError ? "#ff6b6b" : "#7efc9f";
  setTimeout(() => {
    formMsg.textContent = "";
  }, 6000);
}