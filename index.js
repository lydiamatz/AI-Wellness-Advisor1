function displaySummary(response) {
  let output = response.data.answer;

  const summaryElement = document.querySelector("#summary");
  const lines = output.split("\n").filter((line) => line.trim() !== "");

  let html = "";
  let listItems = "";

  lines.forEach((line) => {
    const cleanLine = line.replace(/^[-•]\s*/, "").trim();

    if (cleanLine.toLowerCase().startsWith("recommendations")) {
      html += `<strong>${cleanLine}</strong>`;
    } else {
      listItems += `<li>${cleanLine}</li>`;
    }
  });

  html += `<ul>${listItems}</ul>`;

  // 🔥 Just render it normally
  summaryElement.innerHTML = html;
}

function generateSummary(event) {
  event.preventDefault();

  let instructionsInput = document.querySelector("#instructions-input");

  let apiKey = "2046c535afeb092fo82f1d306d8a2b2t";
  let context = `
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

  let prompt = `
Output only actionable lifestyle/health recommendations in bullet points (max five) based on the following user input. 
Do NOT repeat symptoms or mention missing information. Start with Recommendations: (no bullet on Recommendations) and then list below what you suggest in bullet points.
User input:
${instructionsInput.value}
`;

  let apiURL = `https://api.shecodes.io/ai/v1/generate?prompt=${encodeURIComponent(
    prompt,
  )}&context=${encodeURIComponent(context)}&key=${apiKey}`;

  let summaryElement = document.querySelector("#summary");
  summaryElement.classList.remove("hidden");
  summaryElement.innerHTML = `<div class="generating">🌸 Thank you for sharing a little about yourself. 🌸 </div>`;

  axios.get(apiURL).then(displaySummary);
}

let summaryFormElement = document.querySelector("#input-user");
summaryFormElement.addEventListener("submit", generateSummary);
