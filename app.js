const stateKeys = [
  ["A", "n-a"], ["B", "n-b"], ["C", "n-c"], ["D", "n-d"], ["E", "n-e"],
  ["F", "n-f"], ["G", "n-g"], ["H", "n-h"], ["I", "n-i"], ["J", null],
  ["K", "n-k"], ["L", "n-l"], ["M", "n-m"], ["N", "n-n"], ["O", "n-o"],
  ["P", "n-p"], ["Q", "n-q"], ["R", null], ["S", null],
];

const profileDefs = [
  ["Destined Dream", ["A", "E", "G"], "reduce"],
  ["Father Gene/Career", ["A", "B", "C"]],
  ["Mother Gene/Marriage", ["D", "E", "F"]],
  ["Main Character/Self", ["C", "F", "G"]],
  ["Life Journey/Internally", ["C", "G", "H"]],
  ["Life Journey/Externally", ["F", "G", "I"]],
  ["Children/Subordinate", ["I", "H", "J"]],
  ["Career Journey 1", ["A", "C", "K"]],
  ["Career Journey 2", ["B", "C", "L"]],
  ["Current Friends", ["K", "L", "M"]],
  ["Marriage Journey 1", ["D", "F", "N"]],
  ["Marriage Journey 2", ["E", "F", "O"]],
  ["Future Wealth/Health/In law", ["N", "O", "P"]],
  ["Hidden Potential/Subconscious", ["Q", "R", "S"]],
];

const elements = [
  { name: "Water", nums: [2, 7], color: "#2f7dd1", soft: "rgba(47, 125, 209, 0.12)" },
  { name: "Wood", nums: [4, 9], color: "#2f9b72", soft: "rgba(47, 155, 114, 0.13)" },
  { name: "Fire", nums: [3, 8], color: "#d14f65", soft: "rgba(209, 79, 101, 0.13)" },
  { name: "Earth", nums: [5], color: "#b88735", soft: "rgba(184, 135, 53, 0.14)" },
  { name: "Metal", nums: [1, 6], color: "#687184", soft: "rgba(104, 113, 132, 0.14)" },
];

const relationshipOrders = {
  Water: ["Water", "Wood", "Fire", "Earth", "Metal"],
  Wood: ["Wood", "Fire", "Earth", "Metal", "Water"],
  Fire: ["Fire", "Earth", "Metal", "Water", "Wood"],
  Earth: ["Earth", "Metal", "Water", "Wood", "Fire"],
  Metal: ["Metal", "Water", "Wood", "Fire", "Earth"],
};

const relationshipLabels = [
  "Self",
  "Children/Wealth (I Generate)",
  "Career/Partner (I Overcome)",
  "Official (Overcome Me)",
  "Parents/Benefactor (Generate Me)",
];
const $ = (selector) => document.querySelector(selector);
let latestResult = null;
let latestDobText = "";

function digitReduce(...numbers) {
  const total = numbers.reduce((sum, value) => sum + Number(value), 0);
  return String(total).split("").reduce((sum, digit) => sum + Number(digit), 0);
}

function normalizeDobText(value) {
  return value.replace(/\D/g, "").slice(0, 8);
}

function displayDob(value) {
  const digits = normalizeDobText(value);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join("/");
}

function elementForNumber(number) {
  return elements.find((element) => element.nums.includes(Number(number))) || elements[0];
}

function calculate(dobText) {
  const digits = normalizeDobText(dobText).padEnd(8, "0").split("").map(Number);
  const n = {};

  function set(key, refs) {
    n[key] = digitReduce(...refs.map((ref) => n[ref]));
  }

  n.A = digitReduce(digits[0], digits[1]);
  n.B = digitReduce(digits[2], digits[3]);
  set("C", ["A", "B"]);
  n.D = digitReduce(digits[4], digits[5]);
  n.E = digitReduce(digits[6], digits[7]);
  set("F", ["D", "E"]);
  set("G", ["C", "F"]);
  set("H", ["C", "G"]);
  set("I", ["F", "G"]);
  set("J", ["H", "I"]);
  set("K", ["A", "C"]);
  set("L", ["B", "C"]);
  set("M", ["K", "L"]);
  set("N", ["D", "F"]);
  set("O", ["E", "F"]);
  set("P", ["N", "O"]);

  const mainDigits = [n.C, n.F, n.G];
  n.Q = digitReduce(mainDigits[0], mainDigits[0]);
  n.R = digitReduce(mainDigits[1], mainDigits[1]);
  n.S = digitReduce(mainDigits[2], mainDigits[2]);

  const profiles = profileDefs.map(([label, refs, mode]) => ({
    label,
    refs,
    code: mode === "reduce" ? String(digitReduce(...refs.map((ref) => n[ref]))) : refs.map((ref) => n[ref]).join(""),
  }));

  const coreMissing = missingFrom(Object.values(n).slice(0, 7));
  const profileMissing = missingFrom(profiles.flatMap((profile) => profile.code.split("").map(Number)));
  const elementCounts = Object.fromEntries(elements.map((element) => [
    element.name,
    Object.entries(n)
      .filter(([key]) => key >= "A" && key <= "P")
      .filter(([, value]) => element.nums.includes(value)).length,
  ]));
  const selfElement = elementForNumber(n.G);

  return { digits, n, profiles, coreMissing, profileMissing, elementCounts, selfElement };
}

function missingFrom(values) {
  const present = new Set(values.map(Number));
  return Array.from({ length: 9 }, (_, index) => index + 1).filter((num) => !present.has(num));
}

function render(result, dobText) {
  latestResult = result;
  latestDobText = dobText;
  $("#dob-display").textContent = displayDob(dobText);
  $("#destined-dream").textContent = result.profiles[0].code;
  $("#n-dream").textContent = result.profiles[0].code;
  $("#main-character").textContent = result.profiles.find((profile) => profile.label === "Main Character/Self").code;
  $("#hidden-potential").textContent = result.profiles.find((profile) => profile.label === "Hidden Potential/Subconscious").code;
  $("#missing-core").textContent = result.coreMissing.length ? result.coreMissing.join(",") : "None";

  stateKeys.forEach(([key, id]) => {
    if (id) document.getElementById(id).textContent = result.n[key];
  });

  $("#element-list").innerHTML = elements.map((element) => {
    const count = result.elementCounts[element.name];
    const width = Math.max(8, count * 13);
    return `
      <div class="element-row">
        <div class="element-name"><span class="swatch" style="background:${element.color}"></span>${element.name}</div>
        <div class="bar"><span style="width:${width}%;background:${element.color}"></span></div>
        <div class="count">${count}</div>
      </div>
    `;
  }).join("");

  $("#profile-table").innerHTML = result.profiles.map((profile) => `
    <div class="profile-row">
      <div>${profile.label}</div>
      <div class="profile-code">${profile.code}</div>
    </div>
  `).join("") + `
    <div class="profile-row">
      <div>Profile Missing Number</div>
      <div class="profile-code">${result.profileMissing.length ? result.profileMissing.join(",") : "None"}</div>
    </div>
  `;

  $("#relationship-table").style.setProperty("--self-color", result.selfElement.color);
  $("#relationship-table").style.setProperty("--self-soft", result.selfElement.soft);
  $("#relationship-table").innerHTML = `
    <div class="relationship-row highlighted">
      ${relationshipOrders[result.selfElement.name].map((elementName, index) => `
        <div class="relationship-cell ${index === 0 ? "primary" : ""}">
          <strong>${relationshipLabels[index]}</strong>
          <span>${elementName} - ${result.elementCounts[elementName]}</span>
        </div>
      `).join("")}
    </div>
  `;

  $("#dream-title").textContent = `Destined Dream ${result.profiles[0].code}`;
  $("#character-title").textContent = `Main Character ${result.profiles.find((profile) => profile.label === "Main Character/Self").code}`;
  $("#missing-title").textContent = `Core Missing ${result.coreMissing.length ? result.coreMissing.join(",") : "None"}`;
}

function run() {
  const dobText = normalizeDobText($("#dob-text").value);
  $("#dob-text").value = displayDob(dobText);
  render(calculate(dobText), dobText);
}

$("#dob-form").addEventListener("submit", (event) => {
  event.preventDefault();
  run();
});

$("#dob-text").addEventListener("input", run);

$("#full-read-toggle").addEventListener("click", () => {
  const form = $("#full-read-form");
  form.hidden = !form.hidden;
  if (!form.hidden) $("#reader-name").focus();
});

$("#full-read-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!latestResult) return;

  const name = $("#reader-name").value.trim();
  const email = $("#reader-email").value.trim();
  const remarks = $("#reader-remarks").value.trim() || "None";
  const mainCharacter = latestResult.profiles.find((profile) => profile.label === "Main Character/Self").code;
  const hiddenPotential = latestResult.profiles.find((profile) => profile.label === "Hidden Potential/Subconscious").code;
  const missing = latestResult.coreMissing.length ? latestResult.coreMissing.join(",") : "None";
  const elementLines = elements.map((element) => `${element.name}: ${latestResult.elementCounts[element.name]}`).join("\n");
  const submittedAt = new Date();
  const submittedDateTime = submittedAt.toLocaleString("en-SG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const submittedDate = submittedAt.toLocaleDateString("en-SG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const birthDate = displayDob(latestDobText);

  const subject = `${submittedDate} - ${name} - ${birthDate}`;
  const body = [
    `Date of Submission and Time: ${submittedDateTime}`,
    `Name: ${name}`,
    `Birth Date: ${birthDate}`,
    `Email Address: ${email}`,
    `Remarks: ${remarks}`,
    "",
    "NUMERA Results:",
    `Destined Dream: ${latestResult.profiles[0].code}`,
    `Main Character: ${mainCharacter}`,
    `Hidden Potential: ${hiddenPotential}`,
    `Core Missing: ${missing}`,
    `Self Element: ${latestResult.selfElement.name}`,
    "",
    "Five Elements:",
    elementLines,
    "",
    "Consent:",
    "I consent to my name, contact details, notes, birth figures, and NUMERA results being collected and used only to review this enquiry, prepare a full reading, and contact me about the birth figures provided.",
  ].join("\n");

  window.location.href = `mailto:angie219@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

run();
