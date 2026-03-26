// Vehicle database: name, kmpl (null for electric/zero-emission), type
var VEHICLES = [
  { id: "swift", name: "Maruti Swift", kmpl: 24.8, type: "car" },
  { id: "wagonr", name: "Maruti WagonR", kmpl: 23.56, type: "car" },
  { id: "baleno", name: "Maruti Baleno", kmpl: 22.35, type: "car" },
  { id: "i20", name: "Hyundai i20", kmpl: 20.35, type: "car" },
  { id: "city", name: "Honda City", kmpl: 17.8, type: "car" },
  { id: "creta", name: "Hyundai Creta", kmpl: 17.0, type: "car" },
  { id: "nexon-ev", name: "Tata Nexon EV", kmpl: null, type: "electric" },
  { id: "activa", name: "Honda Activa", kmpl: 45, type: "bike" },
  { id: "public", name: "Public Transport (Bus/Metro)", kmpl: null, type: "public" },
  { id: "walk", name: "Walk / Cycle", kmpl: null, type: "walk" },
];

// CO2 per litre of petrol in kg
var CO2_PER_LITRE = 2.31;

// Public transport emission factor: ~0.04 kg CO2 per km
var PUBLIC_CO2_PER_KM = 0.04;

// Meal CO2 values in kg per day
var MEALS = {
  "chicken-biryani": { name: "Chicken Biryani", co2: 3.5 },
  "mutton-curry": { name: "Mutton Curry", co2: 5.0 },
  "dal-tadka": { name: "Dal Tadka", co2: 0.4 },
  "paneer-butter-masala": { name: "Paneer Butter Masala", co2: 1.1 },
  "rajma-chawal": { name: "Rajma Chawal", co2: 0.6 },
  "egg-curry": { name: "Egg Curry", co2: 1.2 },
  "veg-thali": { name: "Veg Thali", co2: 0.5 },
};

var ENERGY_FACTORS = { coal: 3.0, mixed: 1.8, renewable: 0.5 };
var FLIGHT_FACTOR = 0.9; // tonnes per round-trip

var GLOBAL_AVG = 4.0;
var INDIA_AVG = 1.9;
var MAX_BAR = 10;

// Badges
var BADGES = [
  { max: 0.5, emoji: "\uD83C\uDF0D", title: "Earth Guardian" },
  { max: 1.9, emoji: "\uD83C\uDF33", title: "Green Champion" },
  { max: 4.0, emoji: "\uD83C\uDF31", title: "Climate Aware" },
  { max: 8.0, emoji: "\u26A1", title: "Needs Action" },
  { max: Infinity, emoji: "\uD83D\uDD25", title: "High Emitter" },
];

// City transport alternatives
var CITY_ALTERNATIVES = [
  {
    name: "Delhi Metro",
    co2PerKm: 0.03,
    cost: 40,
    costLabel: "\u20B940/day",
  },
  {
    name: "DTC Electric Bus",
    co2PerKm: 0.02,
    cost: 25,
    costLabel: "\u20B925/day",
  },
  {
    name: "Ola Electric Scooter",
    co2PerKm: 0.005,
    cost: null,
    costLabel: null,
  },
];

// Suggestion bank
var SUGGESTIONS = {
  car: "Switch to public transport or carpooling \u2014 it can cut your commute emissions by up to 75%.",
  bike: "Consider public transport for longer trips to further reduce your travel footprint.",
  "non-veg-high":
    "Try going meat-free 2\u20133 days a week \u2014 even small dietary shifts can save over 0.5 tonnes CO2 a year.",
  "non-veg-low":
    "Switching to more plant-based meals and reducing dairy can shave another 0.2 tonnes off your footprint.",
  coal: "Explore switching to a renewable energy provider \u2014 it's one of the highest-impact changes you can make at home.",
  mixed:
    "Look into rooftop solar or a 100% green energy plan to cut your home emissions significantly.",
  "flights-high":
    "Reducing one long-haul flight a year saves roughly 0.9 tonnes CO2. Consider trains or video calls for shorter trips.",
  "flights-moderate":
    "Offset your flights through verified carbon offset programmes, and prefer direct routes which emit less.",
  general: [
    "Unplug devices when not in use and switch to LED lighting to reduce standby energy waste.",
    "Buy local and seasonal produce to cut emissions from food transport.",
    "Reduce, reuse, and recycle \u2014 cutting waste also cuts the carbon used to produce new goods.",
  ],
};

// ---------- VEHICLE SEARCH ----------
var vehicleInput = document.getElementById("vehicle-input");
var vehicleHidden = document.getElementById("vehicle");
var vehicleDropdown = document.getElementById("vehicle-dropdown");
var kmGroup = document.getElementById("km-group");
var selectedVehicle = null;

function renderDropdown(filter) {
  var query = (filter || "").toLowerCase();
  var matches = VEHICLES.filter(function (v) {
    return v.name.toLowerCase().indexOf(query) !== -1;
  });
  vehicleDropdown.innerHTML = "";
  matches.forEach(function (v) {
    var li = document.createElement("li");
    var detail = v.kmpl ? v.kmpl + " kmpl" : v.type === "electric" ? "Electric" : "";
    li.innerHTML =
      "<span>" +
      v.name +
      '</span><span class="vehicle-detail">' +
      detail +
      "</span>";
    li.addEventListener("mousedown", function (e) {
      e.preventDefault();
      selectVehicle(v);
    });
    vehicleDropdown.appendChild(li);
  });
  vehicleDropdown.classList.toggle("hidden", matches.length === 0);
}

function selectVehicle(v) {
  selectedVehicle = v;
  vehicleInput.value = v.name;
  vehicleHidden.value = v.id;
  vehicleDropdown.classList.add("hidden");
  // Show/hide km slider based on type
  var needsKm = v.type === "car" || v.type === "bike" || v.type === "electric" || v.type === "public";
  kmGroup.style.display = needsKm ? "block" : "none";
}

vehicleInput.addEventListener("focus", function () {
  renderDropdown(vehicleInput.value);
});

vehicleInput.addEventListener("input", function () {
  selectedVehicle = null;
  vehicleHidden.value = "";
  renderDropdown(vehicleInput.value);
});

vehicleInput.addEventListener("blur", function () {
  setTimeout(function () {
    vehicleDropdown.classList.add("hidden");
  }, 150);
});

// ---------- KM SLIDER ----------
var kmSlider = document.getElementById("daily-km");
var kmValue = document.getElementById("km-value");

kmSlider.addEventListener("input", function () {
  kmValue.textContent = kmSlider.value;
});

// ---------- MEAL SELECTION ----------
var mealCards = document.querySelectorAll(".meal-card");
var mealHidden = document.getElementById("meal");

mealCards.forEach(function (card) {
  card.addEventListener("click", function () {
    mealCards.forEach(function (c) {
      c.classList.remove("selected");
    });
    card.classList.add("selected");
    mealHidden.value = card.getAttribute("data-meal");
  });
});

// ---------- CALCULATION ----------
function calcCommuteEmission(vehicle, dailyKm) {
  if (!vehicle) return 0;
  if (vehicle.type === "walk") return 0;
  if (vehicle.type === "electric") return 0; // negligible for EV
  if (vehicle.type === "public") {
    return ((dailyKm * PUBLIC_CO2_PER_KM * 365) / 1000); // tonnes
  }
  if (vehicle.kmpl) {
    return ((dailyKm / vehicle.kmpl) * CO2_PER_LITRE * 365) / 1000; // tonnes
  }
  return 0;
}

function calcMealEmission(mealId) {
  var meal = MEALS[mealId];
  if (!meal) return 0;
  return (meal.co2 * 365) / 1000; // tonnes
}

function getBadge(total) {
  for (var i = 0; i < BADGES.length; i++) {
    if (total <= BADGES[i].max) return BADGES[i];
  }
  return BADGES[BADGES.length - 1];
}

function getSuggestions(data) {
  var tips = [];
  var contributions = [];

  // Commute
  if (data.vehicle && (data.vehicle.type === "car" || data.vehicle.type === "bike")) {
    contributions.push({ val: data.commuteEmission, tip: SUGGESTIONS[data.vehicle.type] });
  }

  // Meal
  var mealCo2Daily = MEALS[data.mealId] ? MEALS[data.mealId].co2 : 0;
  if (mealCo2Daily > 1.5) {
    contributions.push({ val: data.mealEmission, tip: SUGGESTIONS["non-veg-high"] });
  } else if (mealCo2Daily > 0.6) {
    contributions.push({ val: data.mealEmission, tip: SUGGESTIONS["non-veg-low"] });
  }

  // Energy
  if (data.energy === "coal" || data.energy === "mixed") {
    contributions.push({ val: ENERGY_FACTORS[data.energy], tip: SUGGESTIONS[data.energy] });
  }

  // Flights
  if (data.flights > 0) {
    var key = data.flights >= 4 ? "flights-high" : "flights-moderate";
    contributions.push({ val: data.flights * FLIGHT_FACTOR, tip: SUGGESTIONS[key] });
  }

  contributions.sort(function (a, b) {
    return b.val - a.val;
  });

  for (var i = 0; i < contributions.length && tips.length < 3; i++) {
    if (contributions[i].tip) tips.push(contributions[i].tip);
  }

  var gi = 0;
  while (tips.length < 3 && gi < SUGGESTIONS.general.length) {
    tips.push(SUGGESTIONS.general[gi]);
    gi++;
  }

  return tips.slice(0, 3);
}

function getCityAlternatives(vehicle, dailyKm) {
  if (!vehicle || (vehicle.type !== "car" && vehicle.type !== "bike")) return [];
  var userTonnes = calcCommuteEmission(vehicle, dailyKm);

  return CITY_ALTERNATIVES.map(function (alt) {
    var altTonnes = (dailyKm * alt.co2PerKm * 365) / 1000;
    var saving = userTonnes - altTonnes;
    return {
      name: alt.name,
      saving: saving,
      costLabel: alt.costLabel,
    };
  }).filter(function (a) {
    return a.saving > 0;
  });
}

// ---------- DOM ----------
var form = document.getElementById("carbon-form");
var calculatorSection = document.querySelector(".calculator");
var resultsSection = document.getElementById("results");
var footprintNumber = document.getElementById("footprint-number");
var barYou = document.getElementById("bar-you");
var barYouVal = document.getElementById("bar-you-val");
var suggestionsList = document.getElementById("suggestions-list");
var recalculateBtn = document.getElementById("recalculate");
var badgeEmoji = document.getElementById("badge-emoji");
var badgeTitle = document.getElementById("badge-title");
var cityAltSection = document.getElementById("city-alternatives");
var altList = document.getElementById("alternatives-list");
var whatsappBtn = document.getElementById("whatsapp-btn");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!selectedVehicle) {
    vehicleInput.focus();
    return;
  }
  if (!mealHidden.value) {
    document.querySelector(".meal-grid").scrollIntoView({ behavior: "smooth" });
    return;
  }

  var dailyKm = parseInt(kmSlider.value, 10);
  var energy = document.getElementById("energy").value;
  var flights = parseInt(document.getElementById("flights").value, 10) || 0;

  var commuteEmission = calcCommuteEmission(selectedVehicle, dailyKm);
  var mealEmission = calcMealEmission(mealHidden.value);
  var energyEmission = ENERGY_FACTORS[energy] || 0;
  var flightEmission = flights * FLIGHT_FACTOR;
  var total = commuteEmission + mealEmission + energyEmission + flightEmission;

  // Badge
  var badge = getBadge(total);
  badgeEmoji.textContent = badge.emoji;
  badgeTitle.textContent = badge.title;

  // Footprint number
  footprintNumber.textContent = total.toFixed(1);

  // Comparison bar
  var youPercent = Math.min((total / MAX_BAR) * 100, 100);
  barYou.style.width = youPercent + "%";
  barYouVal.textContent = total.toFixed(1) + "t";

  if (total <= INDIA_AVG) {
    barYou.style.background = "var(--green-400)";
  } else if (total <= GLOBAL_AVG) {
    barYou.style.background = "var(--green-500)";
  } else {
    barYou.style.background = "#f59e0b";
  }

  // City alternatives
  var alternatives = getCityAlternatives(selectedVehicle, dailyKm);
  if (alternatives.length > 0) {
    altList.innerHTML = "";
    alternatives.forEach(function (alt) {
      var li = document.createElement("li");
      var costStr = alt.costLabel ? ' <span class="alt-cost">(' + alt.costLabel + ")</span>" : "";
      li.innerHTML =
        '<span class="alt-name">' +
        alt.name +
        "</span>: saves <span class=\"alt-saving\">" +
        alt.saving.toFixed(2) +
        " tonnes/year</span>" +
        costStr;
      altList.appendChild(li);
    });
    cityAltSection.classList.remove("hidden");
  } else {
    cityAltSection.classList.add("hidden");
  }

  // Suggestions
  var tips = getSuggestions({
    vehicle: selectedVehicle,
    commuteEmission: commuteEmission,
    mealId: mealHidden.value,
    mealEmission: mealEmission,
    energy: energy,
    flights: flights,
  });
  suggestionsList.innerHTML = "";
  tips.forEach(function (tip, i) {
    var li = document.createElement("li");
    li.innerHTML =
      '<span class="suggestion-icon">' + (i + 1) + "</span><span>" + tip + "</span>";
    suggestionsList.appendChild(li);
  });

  // WhatsApp share
  var shareText =
    "I just calculated my carbon footprint on CarbonX and it's " +
    total.toFixed(1) +
    " tonnes/year! " +
    badge.emoji +
    " Calculate yours: sarthk.github.io/carbonX";
  whatsappBtn.href =
    "https://wa.me/?text=" + encodeURIComponent(shareText);

  // Show results
  calculatorSection.style.display = "none";
  resultsSection.classList.remove("hidden");
  resultsSection.scrollIntoView({ behavior: "smooth" });
});

recalculateBtn.addEventListener("click", function () {
  resultsSection.classList.add("hidden");
  cityAltSection.classList.add("hidden");
  calculatorSection.style.display = "block";
  calculatorSection.scrollIntoView({ behavior: "smooth" });
});
