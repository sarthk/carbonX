// =======================
// AI BUTTON FIX
// =======================

function bindAIAdviceButton() {
  var btn = document.getElementById("get-ai-advice-btn");
  if (!btn) return;

  btn.onclick = async function () {
    await getAIAdvice();
  };
}

// =======================
// FOOD DROPDOWN FIX
// =======================

function setupFoodDropdown(searchInput, dropdown, slotId, foods) {

  searchInput.addEventListener("input", function () {
    var query = searchInput.value.toLowerCase();
    dropdown.innerHTML = "";

    if (!query) {
      dropdown.classList.add("hidden");
      return;
    }

    var filtered = foods.filter(f =>
      f[0].toLowerCase().includes(query)
    );

    filtered.slice(0, 10).forEach(f => {
      var item = document.createElement("div");
      item.className = "dropdown-item";
      item.textContent = f[0];

      function selectFoodItem() {
        addFoodItem(slotId, f[0], 1);
        searchInput.value = "";
        dropdown.classList.add("hidden");
      }

      item.addEventListener("mousedown", function (e) {
        e.preventDefault();
        selectFoodItem();
      });

      item.addEventListener("click", function () {
        selectFoodItem();
      });

      dropdown.appendChild(item);
    });

    dropdown.classList.remove("hidden");
  });

  searchInput.addEventListener("blur", function () {
    setTimeout(function () {
      if (!dropdown.matches(':hover')) {
        dropdown.classList.add("hidden");
      }
    }, 150);
  });
}

// =======================
// RANKING FIX
// =======================

function updateRanking(total) {
  var indiaBar = document.getElementById("india-bar");
  var globalBar = document.getElementById("global-bar");

  var percMax = 6;

  if (indiaBar) {
    indiaBar.style.width = Math.min(100, (total / percMax) * 100) + "%";
  }

  if (globalBar) {
    globalBar.style.width = Math.min(100, (total / (percMax * 2)) * 100) + "%";
  }

  var percentileText = document.getElementById("percentile-message");

  if (percentileText) {
    if (total < 1.5) {
      percentileText.textContent = "You're among the lowest emitters in India.";
    } else if (total < 3) {
      percentileText.textContent = "You're doing better than most Indians.";
    } else if (total < 6) {
      percentileText.textContent = "You're above average — room to improve.";
    } else {
      percentileText.textContent = "You're in the top emitters globally.";
    }
  }
}

// =======================
// INIT
// =======================

document.addEventListener("DOMContentLoaded", function () {
  bindAIAdviceButton();
});
