// ----------------------
// BACK TO TOP BUTTON
// ----------------------
const backToTopBtn = document.getElementById("backToTop");

if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ----------------------
// CHATBOT SYSTEM
// ----------------------
const chatWindow = document.getElementById("chatWindow");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(sender === "bot" ? "bot-message" : "user-message");
  messageDiv.innerHTML = text;

  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function botReply(userText) {
  const msg = userText.toLowerCase();

  if (msg.includes("phishing") || msg.includes("scam") || msg.includes("email")) {
    return `🚨 That might be phishing.<br><br>
    Look for: urgent wording, fake links, or someone asking for passwords/codes.<br>
    Tip: Never click suspicious links — go directly to the official website instead.`;
  }

  if (msg.includes("deepfake") || msg.includes("fake video") || msg.includes("ai video")) {
    return `🎭 Deepfakes are AI-generated videos or audio that can impersonate someone.<br><br>
    Signs include weird blinking, strange mouth movement, and unnatural lighting.<br>
    If you're unsure, check multiple trusted sources before believing it.`;
  }

  if (msg.includes("password")) {
    return `🔐 Strong passwords are one of your best defenses.<br><br>
    Use 12+ characters, mix symbols + numbers, and NEVER reuse passwords across accounts.<br>
    Bonus tip: A password manager makes this way easier.`;
  }

  if (msg.includes("watermark") || msg.includes("art") || msg.includes("creative")) {
    return `🎨 If you're an artist or creator, watermarking is super helpful.<br><br>
    You can also post lower-resolution versions online and keep the original file as proof of ownership.<br>
    If someone steals your work, report it and save screenshots.`;
  }

  if (msg.includes("help")) {
    return `👋 I can help with scams, phishing, deepfakes, password safety, and protecting your online identity.<br><br>
    Try asking: <b>"Is this message suspicious?"</b>`;
  }

  return `Hmm 🤔 I’m not fully sure about that yet.<br><br>
  Try asking me about <b>phishing</b>, <b>deepfakes</b>, <b>password safety</b>, or <b>watermarking</b>.`;
}

if (sendBtn && chatInput && chatWindow) {
  sendBtn.addEventListener("click", () => {
    const userText = chatInput.value.trim();
    if (!userText) return;

    addMessage(userText, "user");

    setTimeout(() => {
      addMessage(botReply(userText), "bot");
    }, 600);

    chatInput.value = "";
  });

  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendBtn.click();
  });
}

// ----------------------
// SCAM RISK SCORE TOOL
// ----------------------
const analyzeBtn = document.getElementById("analyzeBtn");
const riskInput = document.getElementById("riskInput");
const riskResult = document.getElementById("riskResult");

function calculateRisk(text) {
  let score = 1;
  let reasons = [];

  const lower = text.toLowerCase();

  if (lower.includes("urgent") || lower.includes("immediately") || lower.includes("act now")) {
    score += 2;
    reasons.push("Uses urgent pressure tactics.");
  }

  if (lower.includes("click here") || lower.includes("link") || lower.includes("verify")) {
    score += 2;
    reasons.push("Encourages clicking links or verifying info.");
  }

  if (lower.includes("password") || lower.includes("code") || lower.includes("ssn")) {
    score += 3;
    reasons.push("Asks for sensitive personal information.");
  }

  if (lower.includes("bank") || lower.includes("paypal") || lower.includes("credit card")) {
    score += 2;
    reasons.push("Mentions financial services (common scam target).");
  }

  if (lower.includes("free") || lower.includes("winner") || lower.includes("congratulations")) {
    score += 2;
    reasons.push("Uses reward bait like free prizes.");
  }

  if (score > 10) score = 10;

  return { score, reasons };
}

if (analyzeBtn && riskInput && riskResult) {
  analyzeBtn.addEventListener("click", () => {
    const text = riskInput.value.trim();

    if (!text) {
      riskResult.innerHTML = "⚠️ Please paste a message to analyze.";
      return;
    }

    const result = calculateRisk(text);

    let riskLevel = "Low";
    if (result.score >= 7) riskLevel = "High";
    else if (result.score >= 4) riskLevel = "Medium";

    riskResult.innerHTML = `
      <b>Risk Score:</b> ${result.score}/10 <br>
      <b>Risk Level:</b> ${riskLevel} <br><br>
      <b>Why?</b><br>
      ${result.reasons.length > 0 ? "• " + result.reasons.join("<br>• ") : "No major scam patterns detected."}
      <br><br>
      <b>Tip:</b> If you're unsure, do NOT reply or click links. Search the company directly instead.
    `;
  });
}

// ----------------------
// PHISHING DETECTIVE GAME
// ----------------------
const gameMessage = document.getElementById("gameMessage");
const safeBtn = document.getElementById("safeBtn");
const scamBtn = document.getElementById("scamBtn");
const correctScoreEl = document.getElementById("correctScore");
const wrongScoreEl = document.getElementById("wrongScore");
const feedbackEl = document.getElementById("gameFeedback");
const nextBtn = document.getElementById("nextBtn");

let correct = 0;
let wrong = 0;

const messages = [
  {
    text: "Your account has been locked. Click here immediately to verify your password.",
    type: "scam",
    explanation: "This is phishing because it uses urgency and asks for password verification."
  },
  {
    text: "Hi! Your teacher posted the homework assignment in Google Classroom.",
    type: "safe",
    explanation: "This sounds normal and doesn't ask for personal info or suspicious links."
  },
  {
    text: "Congratulations! You won a free iPhone. Claim your prize now by entering your credit card info.",
    type: "scam",
    explanation: "Prize bait + asking for credit card information is a major scam sign."
  },
  {
    text: "Reminder: Your dentist appointment is tomorrow at 3 PM.",
    type: "safe",
    explanation: "A simple reminder with no link or request for private info."
  },
  {
    text: "We noticed unusual activity. Confirm your 6-digit security code to keep your account safe.",
    type: "scam",
    explanation: "Real companies do NOT ask you to send security codes."
  },
  {
    text: "Your friend tagged you in a photo on Instagram.",
    type: "safe",
    explanation: "This could be normal, but always check if the account is real."
  }
];

let currentMessage = null;

function loadNewMessage() {
  if (!gameMessage) return;

  currentMessage = messages[Math.floor(Math.random() * messages.length)];
  gameMessage.textContent = currentMessage.text;
  feedbackEl.textContent = "";
}

function checkAnswer(userChoice) {
  if (!currentMessage) return;

  if (userChoice === currentMessage.type) {
    correct++;
    correctScoreEl.textContent = correct;
    feedbackEl.innerHTML = `✅ Correct!<br><br><b>Explanation:</b> ${currentMessage.explanation}`;
  } else {
    wrong++;
    wrongScoreEl.textContent = wrong;
    feedbackEl.innerHTML = `❌ Wrong!<br><br><b>Explanation:</b> ${currentMessage.explanation}`;
  }
}

if (safeBtn && scamBtn && nextBtn) {
  safeBtn.addEventListener("click", () => checkAnswer("safe"));
  scamBtn.addEventListener("click", () => checkAnswer("scam"));
  nextBtn.addEventListener("click", loadNewMessage);

  loadNewMessage();
}
