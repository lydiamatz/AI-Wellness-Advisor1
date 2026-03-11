// ── Config ──────────────────────────────────────────────────────────────────

let API_KEY = "2046c535afeb092fo82f1d306d8a2b2t";
let API_BASE_URL = "https://api.shecodes.io/ai/v1/generate";

let AI_CONTEXT = `
  You are a preventive health assistant.
  Rules:
  - Do not diagnose.
  - Do not exaggerate risk.
  - Do not invent missing data.
  - Keep tone supportive and neutral.
  - Output structured markdown only.
  - Do NOT summarize or repeat the input.
  - Do NOT mention missing information or lack of data.
  - Focus only on evidence-informed lifestyle recommendations.
  - Use bullet points.
  - Output only the recommendations, nothing else.
  - Keep language professional and concise.
`;

function cleanLine(line) {
  return line.replace(/^[-•]\s*/, "").trim();
}

function formatResponseAsHTML(text) {
  const lines = text
    .split("\n")
    .map(cleanLine)
    .filter((line) => line !== "");

  let heading = "";
  let listItems = "";

  lines.forEach((line) => {
    if (line.toLowerCase().startsWith("recommendations")) {
      heading = `<strong>${line}</strong>`;
    } else {
      listItems += `<li>${line}</li>`;
    }
  });

  return `${heading}<ul>${listItems}</ul>`;
}

function buildApiUrl(userInput) {
  let prompt = `
    Output only actionable lifestyle/health recommendations in bullet points (max five) 
    based on the following user input. Do NOT repeat symptoms or mention missing information. 
    Start with Recommendations 🌿  (no bullet on Recommendations) and then list below what 
    you suggest in bullet points.
    User input: ${userInput}
  `;

  return (
    API_BASE_URL +
    `?prompt=${encodeURIComponent(prompt)}` +
    `&context=${encodeURIComponent(AI_CONTEXT)}` +
    `&key=${API_KEY}`
  );
}

function showLoadingMessage() {
  let summaryElement = document.querySelector("#summary");
  summaryElement.innerHTML = `<div class="generating">🌸 Thank you for sharing a little about yourself. 🌸</div>`;
}

function displaySummary(response) {
  let summaryElement = document.querySelector("#summary");
  summaryElement.innerHTML = formatResponseAsHTML(response.data.answer);
}

function generateSummary(event) {
  event.preventDefault();

  let userInput = document.querySelector("#instructions-input").value;
  let apiUrl = buildApiUrl(userInput);

  showLoadingMessage();
  axios.get(apiUrl).then(displaySummary);
}

document
  .querySelector("#input-user")
  .addEventListener("submit", generateSummary);
