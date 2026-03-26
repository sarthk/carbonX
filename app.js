// Carbon emission factors (approximate tonnes CO2 per year)
const FACTORS = {
  commute: {
    car: 2.4,
    bike: 0.8,
    public: 0.5,
    walk: 0.0,
  },
  diet: {
    "non-veg": 2.5,
    vegetarian: 1.7,
    vegan: 1.5,
  },
  energy: {
    coal: 3.0,
    mixed: 1.8,
    renewable: 0.5,
  },
  flightPerTrip: 0.9, // tonnes CO2 per round-trip flight
};

const GLOBAL_AVG = 4.0;
const INDIA_AVG = 1.9;
const MAX_BAR = 10; // scale bar chart to 10 tonnes

// Suggestion bank keyed by category
const SUGGESTIONS = {
  commute: {
    car: "Switch to public transport or carpooling — it can cut your commute emissions by up to 75%.",
    bike: "Consider public transport for longer trips to further reduce your travel footprint.",
  },
  diet: {
    "non-veg":
      "Try going meat-free 2-3 days a week — even small dietary shifts can save over 0.5 tonnes CO2 a year.",
    vegetarian:
      "Switching to more plant-based meals and reducing dairy can shave another 0.2 tonnes off your footprint.",
  },
  energy: {
    coal: "Explore switching to a renewable energy provider — it's one of the highest-impact changes you can make at home.",
    mixed:
      "Look into rooftop solar or a 100% green energy plan to cut your home emissions significantly.",
  },
  flights: {
    high: "Reducing one long-haul flight a year saves roughly 0.9 tonnes CO2. Consider trains or video calls for shorter trips.",
    moderate:
      "Offset your flights through verified carbon offset programmes, and prefer direct routes which emit less.",
  },
  general: [
    "Unplug devices when not in use and switch to LED lighting to reduce standby energy waste.",
    "Buy local and seasonal produce to cut emissions from food transport.",
    "Reduce, reuse, and recycle — cutting waste also cuts the carbon used to produce new goods.",
  ],
};

function calculateFootprint({ commute, diet, energy, flights }) {
  const commuteEmission = FACTORS.commute[commute];
  const dietEmission = FACTORS.diet[diet];
  const energyEmission = FACTORS.energy[energy];
  const flightEmission = flights * FACTORS.flightPerTrip;

  return commuteEmission + dietEmission + energyEmission + flightEmission;
}

function getSuggestions({ commute, diet, energy, flights }) {
  const tips = [];

  // Prioritise the biggest contributors
  const contributions = [
    { category: "commute", value: FACTORS.commute[commute], key: commute },
    { category: "diet", value: FACTORS.diet[diet], key: diet },
    { category: "energy", value: FACTORS.energy[energy], key: energy },
    {
      category: "flights",
      value: flights * FACTORS.flightPerTrip,
      key: flights >= 4 ? "high" : "moderate",
    },
  ];

  contributions.sort((a, b) => b.value - a.value);

  for (const item of contributions) {
    if (tips.length >= 3) break;
    const pool = SUGGESTIONS[item.category];
    if (!pool) continue;
    const tip = pool[item.key];
    if (tip) tips.push(tip);
  }

  // Fill remaining with general tips
  let i = 0;
  while (tips.length < 3 && i < SUGGESTIONS.general.length) {
    tips.push(SUGGESTIONS.general[i]);
    i++;
  }

  return tips.slice(0, 3);
}

// DOM
const form = document.getElementById("carbon-form");
const calculatorSection = document.querySelector(".calculator");
const resultsSection = document.getElementById("results");
const footprintNumber = document.getElementById("footprint-number");
const barYou = document.getElementById("bar-you");
const barYouVal = document.getElementById("bar-you-val");
const suggestionsList = document.getElementById("suggestions-list");
const recalculateBtn = document.getElementById("recalculate");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    commute: document.getElementById("commute").value,
    diet: document.getElementById("diet").value,
    energy: document.getElementById("energy").value,
    flights: parseInt(document.getElementById("flights").value, 10) || 0,
  };

  const total = calculateFootprint(data);
  const tips = getSuggestions(data);

  // Update results
  footprintNumber.textContent = total.toFixed(1);

  // Update comparison bar
  const youPercent = Math.min((total / MAX_BAR) * 100, 100);
  barYou.style.width = youPercent + "%";
  barYouVal.textContent = total.toFixed(1) + "t";

  // Colour the bar based on how they compare
  if (total <= INDIA_AVG) {
    barYou.style.background = "var(--green-400)";
  } else if (total <= GLOBAL_AVG) {
    barYou.style.background = "var(--green-500)";
  } else {
    barYou.style.background = "#f59e0b"; // amber for above average
  }

  // Update suggestions
  suggestionsList.innerHTML = "";
  tips.forEach(function (tip, i) {
    const li = document.createElement("li");
    li.innerHTML =
      '<span class="suggestion-icon">' + (i + 1) + "</span><span>" + tip + "</span>";
    suggestionsList.appendChild(li);
  });

  // Show results, hide form
  calculatorSection.style.display = "none";
  resultsSection.classList.remove("hidden");
  resultsSection.scrollIntoView({ behavior: "smooth" });
});

recalculateBtn.addEventListener("click", function () {
  resultsSection.classList.add("hidden");
  calculatorSection.style.display = "block";
  calculatorSection.scrollIntoView({ behavior: "smooth" });
});
