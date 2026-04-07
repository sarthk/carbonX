// ============================================================
// CarbonX App — Homepage: Leaf Particles & Mobile Menu
// ============================================================
// Mobile hamburger menu
(function () {
  var hamburger = document.getElementById("nav-hamburger");
  var mobileMenu = document.getElementById("mobile-menu");
  if (!hamburger || !mobileMenu) return;
  hamburger.addEventListener("click", function () {
    mobileMenu.classList.toggle("hidden");
  });
  // Close menu on link click
  var links = mobileMenu.querySelectorAll(".mobile-link");
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      mobileMenu.classList.add("hidden");
    });
  });
})();
// Floating leaf particles animation
(function () {
  var canvas = document.getElementById("leaf-canvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  function resize() {
    var hero = canvas.parentElement;
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);
  var leaves = [];
  var LEAF_COUNT = 18;
  var COLORS = ["#22c55e", "#4ade80", "#86efac", "#16a34a", "#bbf7d0"];
  function createLeaf() {
    return {
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 40,
      size: 6 + Math.random() * 10,
      speedY: 0.3 + Math.random() * 0.6,
      speedX: (Math.random() - 0.5) * 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      opacity: 0.15 + Math.random() * 0.25,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
  }
  for (var i = 0; i < LEAF_COUNT; i++) {
    var l = createLeaf();
    l.y = Math.random() * canvas.height;
    leaves.push(l);
  }
  function drawLeaf(l) {
    ctx.save();
    ctx.translate(l.x, l.y);
    ctx.rotate(l.rotation);
    ctx.globalAlpha = l.opacity;
    ctx.fillStyle = l.color;
    ctx.beginPath();
    ctx.moveTo(0, -l.size);
    ctx.bezierCurveTo(l.size * 0.6, -l.size * 0.6, l.size * 0.6, l.size * 0.3, 0, l.size);
    ctx.bezierCurveTo(-l.size * 0.6, l.size * 0.3, -l.size * 0.6, -l.size * 0.6, 0, -l.size);
    ctx.fill();
    ctx.restore();
  }
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var j = 0; j < leaves.length; j++) {
      var l = leaves[j];
      l.y += l.speedY;
      l.x += l.speedX + Math.sin(l.y * 0.01) * 0.3;
      l.rotation += l.rotSpeed;
      if (l.y > canvas.height + 20) {
        leaves[j] = createLeaf();
      }
      drawLeaf(l);
    }
    requestAnimationFrame(animate);
  }
  animate();
})();
// ============================================================
// CarbonX App — Part 1: Vehicle Database & Cascade Dropdowns
// ============================================================
// Emission factors
var EF = {
  petrol: 2.31,   // kg CO2 per litre
  diesel: 2.68,   // kg CO2 per litre
  cng: 2.04,      // kg CO2 per kg
  electric: 0.82, // kg CO2 per kWh (India grid avg)
  public: 0.04,   // kg CO2 per km (bus/metro)
  auto: 0.09,     // kg CO2 per km (auto rickshaw)
  erickshaw: 0.02 // kg CO2 per km
};
// Vehicle database: brand → models → variants
// Each variant: [name, cc/desc, fuel, claimed_mileage, mileage_unit]
// mileage_unit: "kmpl" | "km/kg" | "km/kWh" | "km" | null
var DB = {
  "Maruti Suzuki": {
    "Swift": [
      ["LXi", "1197cc", "petrol", 24.8, "kmpl"],
      ["VXi", "1197cc", "petrol", 24.8, "kmpl"],
      ["ZXi", "1197cc", "petrol", 24.8, "kmpl"],
      ["ZXi+", "1197cc", "petrol", 24.8, "kmpl"],
      ["VXi CNG", "1197cc", "cng", 30.9, "km/kg"],
      ["ZXi CNG", "1197cc", "cng", 30.9, "km/kg"]
    ],
    "WagonR": [
      ["LXi", "998cc", "petrol", 24.4, "kmpl"],
      ["VXi", "1197cc", "petrol", 23.56, "kmpl"],
      ["ZXi", "1197cc", "petrol", 23.56, "kmpl"],
      ["ZXi+", "1197cc", "petrol", 23.56, "kmpl"],
      ["VXi CNG", "1197cc", "cng", 34.0, "km/kg"]
    ],
    "Baleno": [
      ["Sigma", "1197cc", "petrol", 22.35, "kmpl"],
      ["Delta", "1197cc", "petrol", 22.35, "kmpl"],
      ["Zeta", "1197cc", "petrol", 22.35, "kmpl"],
      ["Alpha", "1197cc", "petrol", 22.35, "kmpl"],
      ["Delta CNG", "1197cc", "cng", 30.6, "km/kg"]
    ],
    "Dzire": [
      ["LXi", "1197cc", "petrol", 23.26, "kmpl"],
      ["VXi", "1197cc", "petrol", 23.26, "kmpl"],
      ["ZXi", "1197cc", "petrol", 23.26, "kmpl"],
      ["ZXi+", "1197cc", "petrol", 23.26, "kmpl"],
      ["VXi CNG", "1197cc", "cng", 31.1, "km/kg"]
    ],
    "Brezza": [
      ["LXi", "1462cc", "petrol", 17.38, "kmpl"],
      ["VXi", "1462cc", "petrol", 17.38, "kmpl"],
      ["ZXi", "1462cc", "petrol", 17.38, "kmpl"],
      ["ZXi+", "1462cc", "petrol", 17.38, "kmpl"],
      ["ZXi CNG", "1462cc", "cng", 25.5, "km/kg"]
    ],
    "Ertiga": [
      ["LXi", "1462cc", "petrol", 20.51, "kmpl"],
      ["VXi", "1462cc", "petrol", 20.51, "kmpl"],
      ["ZXi", "1462cc", "petrol", 20.51, "kmpl"],
      ["ZXi+", "1462cc", "petrol", 20.51, "kmpl"],
      ["VXi CNG", "1462cc", "cng", 26.1, "km/kg"]
    ],
    "Alto": [
      ["Std", "796cc", "petrol", 22.05, "kmpl"],
      ["LXi", "796cc", "petrol", 22.05, "kmpl"],
      ["VXi", "796cc", "petrol", 22.05, "kmpl"],
      ["LXi CNG", "796cc", "cng", 31.6, "km/kg"]
    ],
    "Celerio": [
      ["LXi", "998cc", "petrol", 25.24, "kmpl"],
      ["VXi", "998cc", "petrol", 25.24, "kmpl"],
      ["ZXi", "998cc", "petrol", 25.24, "kmpl"],
      ["VXi CNG", "998cc", "cng", 34.4, "km/kg"]
    ],
    "Fronx": [
      ["Sigma", "1197cc", "petrol", 21.79, "kmpl"],
      ["Delta", "1197cc", "petrol", 21.79, "kmpl"],
      ["Delta+ Turbo", "998cc turbo", "petrol", 21.5, "kmpl"],
      ["Zeta Turbo", "998cc turbo", "petrol", 21.5, "kmpl"],
      ["Alpha Turbo", "998cc turbo", "petrol", 21.5, "kmpl"]
    ]
  },
  "Hyundai": {
    "i20": [
      ["Magna", "1197cc", "petrol", 20.35, "kmpl"],
      ["Sportz", "1197cc", "petrol", 20.35, "kmpl"],
      ["Asta", "1197cc", "petrol", 20.35, "kmpl"],
      ["Asta(O) Turbo", "998cc turbo", "petrol", 20.0, "kmpl"]
    ],
    "Creta": [
      ["EX", "1497cc", "petrol", 17.0, "kmpl"],
      ["S", "1497cc", "petrol", 17.0, "kmpl"],
      ["SX", "1497cc", "petrol", 17.0, "kmpl"],
      ["SX(O)", "1497cc", "petrol", 17.0, "kmpl"],
      ["SX Diesel", "1493cc", "diesel", 21.4, "kmpl"],
      ["SX(O) Diesel", "1493cc", "diesel", 21.4, "kmpl"]
    ],
    "Venue": [
      ["E", "1197cc", "petrol", 17.5, "kmpl"],
      ["S", "1197cc", "petrol", 17.5, "kmpl"],
      ["SX", "998cc turbo", "petrol", 18.1, "kmpl"],
      ["SX(O)", "998cc turbo", "petrol", 18.1, "kmpl"]
    ],
    "Verna": [
      ["EX", "1497cc", "petrol", 19.0, "kmpl"],
      ["S", "1497cc", "petrol", 19.0, "kmpl"],
      ["SX", "1497cc", "petrol", 19.0, "kmpl"],
      ["SX Turbo", "1482cc turbo", "petrol", 20.3, "kmpl"]
    ],
    "Tucson": [
      ["GL", "1999cc", "petrol", 14.2, "kmpl"],
      ["GLS", "1999cc", "petrol", 14.2, "kmpl"],
      ["Signature Diesel", "1995cc", "diesel", 18.4, "kmpl"]
    ],
    "Aura": [
      ["E", "1197cc", "petrol", 20.5, "kmpl"],
      ["S", "1197cc", "petrol", 20.5, "kmpl"],
      ["S CNG", "1197cc", "cng", 28.0, "km/kg"],
      ["SX", "1197cc", "petrol", 20.5, "kmpl"]
    ],
    "Grand i10 Nios": [
      ["Era", "1197cc", "petrol", 20.7, "kmpl"],
      ["Magna", "1197cc", "petrol", 20.7, "kmpl"],
      ["Sportz", "1197cc", "petrol", 20.7, "kmpl"],
      ["Sportz CNG", "1197cc", "cng", 28.3, "km/kg"]
    ],
    "Creta EV [EV]": [
      ["Executive", "electric", "electric", 6.2, "km/kWh"],
      ["Smart", "electric", "electric", 6.2, "km/kWh"],
      ["Premium", "electric", "electric", 6.2, "km/kWh"]
    ],
    "Ioniq 5 [EV]": [
      ["Standard Range", "electric", "electric", 5.8, "km/kWh"],
      ["Long Range", "electric", "electric", 5.8, "km/kWh"],
      ["Long Range AWD", "electric", "electric", 5.8, "km/kWh"]
    ],
    "Kona EV [EV]": [
      ["Premium", "electric", "electric", 6.5, "km/kWh"],
      ["Premium Dual Tone", "electric", "electric", 6.5, "km/kWh"]
    ]
  },
  "Tata Motors": {
    "Nexon": [
      ["Smart", "1199cc", "petrol", 17.4, "kmpl"],
      ["Smart+", "1199cc", "petrol", 17.4, "kmpl"],
      ["Pure", "1199cc", "petrol", 17.4, "kmpl"],
      ["Creative", "1199cc", "petrol", 17.4, "kmpl"],
      ["Creative+ Diesel", "1497cc", "diesel", 23.2, "kmpl"],
      ["Fearless Diesel", "1497cc", "diesel", 23.2, "kmpl"]
    ],
    "Punch": [
      ["Pure", "1199cc", "petrol", 18.97, "kmpl"],
      ["Adventure", "1199cc", "petrol", 18.97, "kmpl"],
      ["Accomplished", "1199cc", "petrol", 18.97, "kmpl"],
      ["Creative", "1199cc", "petrol", 18.97, "kmpl"]
    ],
    "Altroz": [
      ["XE", "1199cc", "petrol", 22.0, "kmpl"],
      ["XM", "1199cc", "petrol", 22.0, "kmpl"],
      ["XZ", "1199cc", "petrol", 22.0, "kmpl"],
      ["XZ+ Diesel", "1497cc", "diesel", 25.1, "kmpl"]
    ],
    "Harrier": [
      ["Smart", "1956cc", "diesel", 16.35, "kmpl"],
      ["Pure", "1956cc", "diesel", 16.35, "kmpl"],
      ["Adventure", "1956cc", "diesel", 16.35, "kmpl"],
      ["Fearless", "1956cc", "diesel", 16.35, "kmpl"]
    ],
    "Safari": [
      ["Smart", "1956cc", "diesel", 16.3, "kmpl"],
      ["Pure", "1956cc", "diesel", 16.3, "kmpl"],
      ["Adventure", "1956cc", "diesel", 16.3, "kmpl"],
      ["Accomplished", "1956cc", "diesel", 16.3, "kmpl"]
    ],
    "Tiago": [
      ["XE", "1199cc", "petrol", 20.09, "kmpl"],
      ["XM", "1199cc", "petrol", 20.09, "kmpl"],
      ["XZ", "1199cc", "petrol", 20.09, "kmpl"],
      ["XZ CNG", "1199cc", "cng", 26.5, "km/kg"]
    ],
    "Tigor": [
      ["XE", "1199cc", "petrol", 20.0, "kmpl"],
      ["XM", "1199cc", "petrol", 20.0, "kmpl"],
      ["XZ+", "1199cc", "petrol", 20.0, "kmpl"],
      ["XZ CNG", "1199cc", "cng", 26.5, "km/kg"]
    ],
    "Nexon EV [EV]": [
      ["Creative+ LR", "electric", "electric", 6.5, "km/kWh"],
      ["Fearless+ LR", "electric", "electric", 6.5, "km/kWh"],
      ["Empowered+ LR", "electric", "electric", 6.5, "km/kWh"]
    ],
    "Punch EV [EV]": [
      ["Adventure", "electric", "electric", 7.0, "km/kWh"],
      ["Accomplished", "electric", "electric", 7.0, "km/kWh"],
      ["Creative", "electric", "electric", 7.0, "km/kWh"]
    ],
    "Tiago EV [EV]": [
      ["XE MR", "electric", "electric", 7.2, "km/kWh"],
      ["XT LR", "electric", "electric", 7.2, "km/kWh"],
      ["XZ+ LR", "electric", "electric", 7.2, "km/kWh"]
    ],
    "Tigor EV [EV]": [
      ["XE", "electric", "electric", 6.8, "km/kWh"],
      ["XM", "electric", "electric", 6.8, "km/kWh"],
      ["XZ+", "electric", "electric", 6.8, "km/kWh"]
    ],
    "Curvv EV [EV]": [
      ["Creative", "electric", "electric", 6.2, "km/kWh"],
      ["Accomplished", "electric", "electric", 6.2, "km/kWh"],
      ["Empowered+", "electric", "electric", 6.2, "km/kWh"]
    ]
  },
  "Mahindra": {
    "Scorpio-N": [
      ["Z4", "1997cc", "diesel", 15.0, "kmpl"],
      ["Z6", "1997cc", "diesel", 15.0, "kmpl"],
      ["Z8", "1997cc", "diesel", 15.0, "kmpl"],
      ["Z8L", "1997cc", "diesel", 15.0, "kmpl"]
    ],
    "XUV700": [
      ["MX", "1997cc", "petrol", 13.2, "kmpl"],
      ["AX3", "1997cc", "petrol", 13.2, "kmpl"],
      ["AX5 Diesel", "2184cc", "diesel", 16.0, "kmpl"],
      ["AX7 Diesel", "2184cc", "diesel", 16.0, "kmpl"]
    ],
    "XUV300": [
      ["W4", "1197cc", "petrol", 17.0, "kmpl"],
      ["W6", "1197cc", "petrol", 17.0, "kmpl"],
      ["W8 Diesel", "1497cc", "diesel", 20.0, "kmpl"],
      ["W8(O) Diesel", "1497cc", "diesel", 20.0, "kmpl"]
    ],
    "Thar": [
      ["AX Std Petrol", "1497cc turbo", "petrol", 15.2, "kmpl"],
      ["LX Petrol", "1497cc turbo", "petrol", 15.2, "kmpl"],
      ["AX Diesel", "2184cc", "diesel", 15.2, "kmpl"],
      ["LX Diesel", "2184cc", "diesel", 15.2, "kmpl"]
    ],
    "Bolero": [
      ["B2", "1493cc", "diesel", 16.0, "kmpl"],
      ["B4", "1493cc", "diesel", 16.0, "kmpl"],
      ["B6", "1493cc", "diesel", 16.0, "kmpl"],
      ["B6(O)", "1493cc", "diesel", 16.0, "kmpl"]
    ],
    "XUV400 EV [EV]": [
      ["EC", "electric", "electric", 4.0, "km/kWh"],
      ["EL", "electric", "electric", 4.0, "km/kWh"],
      ["EL Pro", "electric", "electric", 4.0, "km/kWh"]
    ]
  },
  "Kia": {
    "Seltos": [
      ["HTE", "1497cc", "petrol", 16.8, "kmpl"],
      ["HTK", "1497cc", "petrol", 16.8, "kmpl"],
      ["HTK+", "1497cc", "petrol", 16.8, "kmpl"],
      ["HTX Diesel", "1493cc", "diesel", 20.7, "kmpl"],
      ["GTX+ Turbo", "1482cc turbo", "petrol", 16.5, "kmpl"]
    ],
    "Sonet": [
      ["HTE", "1197cc", "petrol", 18.4, "kmpl"],
      ["HTK+", "1197cc", "petrol", 18.4, "kmpl"],
      ["HTX Diesel", "1493cc", "diesel", 24.1, "kmpl"],
      ["GTX+ Turbo", "998cc turbo", "petrol", 18.2, "kmpl"]
    ],
    "Carens": [
      ["Premium", "1497cc", "petrol", 16.5, "kmpl"],
      ["Prestige", "1497cc", "petrol", 16.5, "kmpl"],
      ["Luxury", "1497cc", "petrol", 16.5, "kmpl"],
      ["Luxury+ Diesel", "1493cc", "diesel", 21.3, "kmpl"]
    ],
    "EV6 [EV]": [
      ["GT-Line", "electric", "electric", 5.8, "km/kWh"],
      ["GT-Line AWD", "electric", "electric", 5.8, "km/kWh"],
      ["GT AWD", "electric", "electric", 5.8, "km/kWh"]
    ],
    "EV9 [EV]": [
      ["GT-Line", "electric", "electric", 5.2, "km/kWh"],
      ["GT-Line AWD", "electric", "electric", 5.2, "km/kWh"]
    ]
  },
  "Toyota": {
    "Innova Crysta": [
      ["GX", "2393cc", "diesel", 15.1, "kmpl"],
      ["VX", "2393cc", "diesel", 15.1, "kmpl"],
      ["ZX", "2393cc", "diesel", 15.1, "kmpl"]
    ],
    "Innova HyCross": [
      ["G Petrol", "1987cc", "petrol", 14.8, "kmpl"],
      ["GX Hybrid", "1987cc hybrid", "petrol", 21.1, "kmpl"],
      ["VX Hybrid", "1987cc hybrid", "petrol", 21.1, "kmpl"],
      ["ZX(O) Hybrid", "1987cc hybrid", "petrol", 21.1, "kmpl"]
    ],
    "Fortuner": [
      ["4x2 MT", "2755cc", "diesel", 12.0, "kmpl"],
      ["4x2 AT", "2755cc", "diesel", 11.0, "kmpl"],
      ["Legender 4x2", "2755cc", "diesel", 11.0, "kmpl"],
      ["4x4 AT", "2755cc", "diesel", 10.0, "kmpl"]
    ],
    "Urban Cruiser Hyryder": [
      ["E Petrol", "1462cc", "petrol", 20.6, "kmpl"],
      ["S Hybrid", "1490cc hybrid", "petrol", 27.9, "kmpl"],
      ["G Hybrid", "1490cc hybrid", "petrol", 27.9, "kmpl"],
      ["V Hybrid", "1490cc hybrid", "petrol", 27.9, "kmpl"],
      ["S CNG", "1462cc", "cng", 26.1, "km/kg"]
    ],
    "Glanza": [
      ["E", "1197cc", "petrol", 22.8, "kmpl"],
      ["S", "1197cc", "petrol", 22.8, "kmpl"],
      ["G", "1197cc", "petrol", 22.8, "kmpl"],
      ["V", "1197cc", "petrol", 22.8, "kmpl"],
      ["S CNG", "1197cc", "cng", 30.6, "km/kg"],
      ["G CNG", "1197cc", "cng", 30.6, "km/kg"]
    ],
    "Camry": [
      ["Hybrid", "2487cc hybrid", "petrol", 19.1, "kmpl"]
    ]
  },
  "Honda": {
    "City": [
      ["V", "1498cc", "petrol", 17.8, "kmpl"],
      ["VX", "1498cc", "petrol", 17.8, "kmpl"],
      ["ZX", "1498cc", "petrol", 17.8, "kmpl"],
      ["V Hybrid", "1498cc hybrid", "petrol", 26.5, "kmpl"],
      ["ZX Hybrid", "1498cc hybrid", "petrol", 26.5, "kmpl"]
    ],
    "Amaze": [
      ["E", "1199cc", "petrol", 18.6, "kmpl"],
      ["S", "1199cc", "petrol", 18.6, "kmpl"],
      ["VX", "1199cc", "petrol", 18.6, "kmpl"],
      ["VX Diesel", "1498cc", "diesel", 24.7, "kmpl"]
    ],
    "Elevate": [
      ["SV", "1498cc", "petrol", 15.3, "kmpl"],
      ["V", "1498cc", "petrol", 15.3, "kmpl"],
      ["VX", "1498cc", "petrol", 15.3, "kmpl"],
      ["ZX", "1498cc", "petrol", 15.3, "kmpl"]
    ],
    "WR-V": [
      ["S", "1199cc", "petrol", 16.5, "kmpl"],
      ["VX", "1199cc", "petrol", 16.5, "kmpl"],
      ["VX Diesel", "1498cc", "diesel", 23.7, "kmpl"]
    ]
  },
  "MG Motor": {
    "Hector": [
      ["Style", "1451cc turbo", "petrol", 14.5, "kmpl"],
      ["Smart", "1451cc turbo", "petrol", 14.5, "kmpl"],
      ["Sharp", "1451cc turbo", "petrol", 14.5, "kmpl"],
      ["Sharp Diesel", "1956cc", "diesel", 15.8, "kmpl"]
    ],
    "Astor": [
      ["Style", "1349cc turbo", "petrol", 15.0, "kmpl"],
      ["Smart", "1349cc turbo", "petrol", 15.0, "kmpl"],
      ["Sharp", "1498cc", "petrol", 14.2, "kmpl"]
    ],
    "ZS EV [EV]": [
      ["Excite", "electric", "electric", 6.0, "km/kWh"],
      ["Exclusive", "electric", "electric", 6.0, "km/kWh"],
      ["Exclusive Pro", "electric", "electric", 6.0, "km/kWh"]
    ],
    "Comet EV [EV]": [
      ["Lite", "electric", "electric", 8.5, "km/kWh"],
      ["Play", "electric", "electric", 8.5, "km/kWh"]
    ],
    "Windsor EV [EV]": [
      ["Excite", "electric", "electric", 6.8, "km/kWh"],
      ["Exclusive", "electric", "electric", 6.8, "km/kWh"],
      ["Exclusive Pro", "electric", "electric", 6.8, "km/kWh"]
    ]
  },
  "Renault": {
    "Kiger": [
      ["RXE", "999cc", "petrol", 20.5, "kmpl"],
      ["RXL", "999cc", "petrol", 20.5, "kmpl"],
      ["RXT Turbo", "999cc turbo", "petrol", 20.0, "kmpl"]
    ],
    "Triber": [
      ["RXE", "999cc", "petrol", 20.0, "kmpl"],
      ["RXL", "999cc", "petrol", 20.0, "kmpl"],
      ["RXT", "999cc", "petrol", 20.0, "kmpl"]
    ],
    "Kwid": [
      ["RXE", "799cc", "petrol", 22.0, "kmpl"],
      ["RXL", "999cc", "petrol", 21.7, "kmpl"],
      ["Climber", "999cc", "petrol", 21.7, "kmpl"]
    ]
  },
  "Volkswagen": {
    "Taigun": [
      ["Comfortline", "999cc turbo", "petrol", 19.0, "kmpl"],
      ["Highline", "999cc turbo", "petrol", 19.0, "kmpl"],
      ["Topline", "1498cc turbo", "petrol", 17.8, "kmpl"],
      ["GT", "1498cc turbo", "petrol", 17.8, "kmpl"]
    ],
    "Virtus": [
      ["Comfortline", "999cc turbo", "petrol", 19.4, "kmpl"],
      ["Highline", "999cc turbo", "petrol", 19.4, "kmpl"],
      ["Topline", "1498cc turbo", "petrol", 18.0, "kmpl"],
      ["GT+", "1498cc turbo", "petrol", 18.0, "kmpl"]
    ]
  },
  "Skoda": {
    "Kushaq": [
      ["Active", "999cc turbo", "petrol", 19.0, "kmpl"],
      ["Ambition", "999cc turbo", "petrol", 19.0, "kmpl"],
      ["Style", "1498cc turbo", "petrol", 17.8, "kmpl"],
      ["Monte Carlo", "1498cc turbo", "petrol", 17.8, "kmpl"]
    ],
    "Slavia": [
      ["Active", "999cc turbo", "petrol", 19.4, "kmpl"],
      ["Ambition", "999cc turbo", "petrol", 19.4, "kmpl"],
      ["Style", "1498cc turbo", "petrol", 18.0, "kmpl"],
      ["Laurin & Klement", "1498cc turbo", "petrol", 18.0, "kmpl"]
    ]
  },
  "Hero MotoCorp (2W)": {
    "Splendor Plus": [
      ["Kick", "97.2cc", "petrol", 60.0, "kmpl"],
      ["Self", "97.2cc", "petrol", 60.0, "kmpl"],
      ["Black & Accent", "97.2cc", "petrol", 60.0, "kmpl"]
    ],
    "HF Deluxe": [
      ["Kick", "97.2cc", "petrol", 65.0, "kmpl"],
      ["Self", "97.2cc", "petrol", 65.0, "kmpl"],
      ["i3S", "97.2cc", "petrol", 65.0, "kmpl"]
    ],
    "Passion Pro": [
      ["Drum", "113.2cc", "petrol", 55.0, "kmpl"],
      ["Disc", "113.2cc", "petrol", 55.0, "kmpl"]
    ],
    "Glamour": [
      ["Drum", "124.7cc", "petrol", 50.0, "kmpl"],
      ["Disc", "124.7cc", "petrol", 50.0, "kmpl"],
      ["Disc Self", "124.7cc", "petrol", 50.0, "kmpl"]
    ],
    "Xtreme 160R": [
      ["Standard", "163cc", "petrol", 45.0, "kmpl"],
      ["Double Disc", "163cc", "petrol", 45.0, "kmpl"]
    ]
  },
  "Bajaj (2W)": {
    "Pulsar 150": [
      ["Standard", "149.5cc", "petrol", 45.0, "kmpl"],
      ["Twin Disc", "149.5cc", "petrol", 45.0, "kmpl"]
    ],
    "Pulsar NS200": [
      ["Standard", "199.5cc", "petrol", 35.0, "kmpl"],
      ["ABS", "199.5cc", "petrol", 35.0, "kmpl"]
    ],
    "Platina": [
      ["Drum", "102cc", "petrol", 80.0, "kmpl"],
      ["Disc", "102cc", "petrol", 80.0, "kmpl"]
    ],
    "CT 110": [
      ["KS", "115.45cc", "petrol", 70.0, "kmpl"],
      ["ES Alloy", "115.45cc", "petrol", 70.0, "kmpl"]
    ],
    "Dominar 400": [
      ["Standard", "373.3cc", "petrol", 30.0, "kmpl"],
      ["Touring", "373.3cc", "petrol", 30.0, "kmpl"]
    ]
  },
  "TVS (2W)": {
    "Jupiter": [
      ["Standard", "109.7cc", "petrol", 50.0, "kmpl"],
      ["ZX", "109.7cc", "petrol", 50.0, "kmpl"],
      ["Classic", "109.7cc", "petrol", 50.0, "kmpl"]
    ],
    "Apache RTR 160": [
      ["Drum", "159.7cc", "petrol", 45.0, "kmpl"],
      ["Disc", "159.7cc", "petrol", 45.0, "kmpl"],
      ["4V", "159.7cc", "petrol", 45.0, "kmpl"]
    ],
    "Star City+": [
      ["Drum", "109.7cc", "petrol", 60.0, "kmpl"],
      ["Disc", "109.7cc", "petrol", 60.0, "kmpl"]
    ],
    "Raider 125": [
      ["Drum", "124.8cc", "petrol", 55.0, "kmpl"],
      ["Disc", "124.8cc", "petrol", 55.0, "kmpl"]
    ],
    "Ntorq": [
      ["Race XP", "124.8cc", "petrol", 45.0, "kmpl"],
      ["Super Squad", "124.8cc", "petrol", 45.0, "kmpl"]
    ]
  },
  "Ola Electric (2W)": {
    "S1 Pro [EV]": [
      ["S1 Pro", "electric", "electric", 4.5, "km/kWh"],
      ["S1 Pro+", "electric", "electric", 4.5, "km/kWh"]
    ],
    "S1 Air [EV]": [
      ["S1 Air", "electric", "electric", 4.8, "km/kWh"]
    ],
    "S1 X": [
      ["2 kWh", "electric", "electric", 4.8, "km/kWh"],
      ["3 kWh", "electric", "electric", 4.8, "km/kWh"]
    ]
  },
  "Ather Energy (2W)": {
    "450X [EV]": [
      ["450X", "electric", "electric", 4.5, "km/kWh"],
      ["450X Gen 3", "electric", "electric", 4.5, "km/kWh"]
    ],
    "450 Apex [EV]": [
      ["450 Apex", "electric", "electric", 4.3, "km/kWh"]
    ],
    "450S": [
      ["450S", "electric", "electric", 4.5, "km/kWh"]
    ]
  },
  "BMW": {
    "3 Series": [
      ["320d Sport", "1995cc", "diesel", 13.0, "kmpl"],
      ["320d Luxury", "1995cc", "diesel", 13.0, "kmpl"],
      ["320Ld Luxury", "1995cc", "diesel", 13.0, "kmpl"]
    ],
    "5 Series": [
      ["520d Sport", "1995cc", "diesel", 11.0, "kmpl"],
      ["520d Luxury", "1995cc", "diesel", 11.0, "kmpl"],
      ["530d M Sport", "2993cc", "diesel", 11.0, "kmpl"]
    ],
    "7 Series": [
      ["740Li M Sport", "2998cc", "petrol", 9.0, "kmpl"],
      ["730Ld DPE", "2993cc", "diesel", 9.0, "kmpl"]
    ],
    "X1": [
      ["sDrive18i", "1499cc turbo", "petrol", 15.0, "kmpl"],
      ["sDrive20d", "1995cc", "diesel", 15.0, "kmpl"],
      ["sDrive20d M Sport", "1995cc", "diesel", 15.0, "kmpl"]
    ],
    "X3": [
      ["xDrive20d", "1995cc", "diesel", 13.0, "kmpl"],
      ["xDrive20d M Sport", "1995cc", "diesel", 13.0, "kmpl"],
      ["xDrive30i M Sport", "1998cc turbo", "petrol", 13.0, "kmpl"]
    ],
    "X5": [
      ["xDrive30d", "2993cc", "diesel", 10.0, "kmpl"],
      ["xDrive30d M Sport", "2993cc", "diesel", 10.0, "kmpl"],
      ["xDrive40i M Sport", "2998cc turbo", "petrol", 10.0, "kmpl"]
    ],
    "X7": [
      ["xDrive30d", "2993cc", "diesel", 9.0, "kmpl"],
      ["xDrive30d M Sport", "2993cc", "diesel", 9.0, "kmpl"],
      ["xDrive40i M Sport", "2998cc turbo", "petrol", 9.0, "kmpl"]
    ],
    "i4 [EV]": [
      ["eDrive40", "electric", "electric", 6.3, "km/kWh"],
      ["M50", "electric", "electric", 6.3, "km/kWh"]
    ],
    "iX [EV]": [
      ["xDrive40", "electric", "electric", 5.8, "km/kWh"],
      ["xDrive50", "electric", "electric", 5.8, "km/kWh"]
    ],
    "iX1 [EV]": [
      ["eDrive20", "electric", "electric", 6.5, "km/kWh"],
      ["xDrive30", "electric", "electric", 6.5, "km/kWh"]
    ]
  },
  "Mercedes-Benz": {
    "A-Class": [
      ["A 200", "1332cc turbo", "petrol", 15.0, "kmpl"],
      ["A 200d", "1950cc", "diesel", 15.0, "kmpl"]
    ],
    "C-Class": [
      ["C 200", "1496cc turbo", "petrol", 13.0, "kmpl"],
      ["C 220d", "1993cc", "diesel", 13.0, "kmpl"],
      ["C 300d", "1993cc", "diesel", 13.0, "kmpl"]
    ],
    "E-Class": [
      ["E 200", "1991cc turbo", "petrol", 11.0, "kmpl"],
      ["E 220d", "1950cc", "diesel", 11.0, "kmpl"],
      ["E 350d", "2925cc", "diesel", 11.0, "kmpl"]
    ],
    "S-Class": [
      ["S 350d", "2925cc", "diesel", 9.0, "kmpl"],
      ["S 400d", "2925cc", "diesel", 9.0, "kmpl"],
      ["S 450", "2999cc turbo", "petrol", 9.0, "kmpl"]
    ],
    "GLA": [
      ["GLA 200", "1332cc turbo", "petrol", 14.0, "kmpl"],
      ["GLA 200d", "1950cc", "diesel", 14.0, "kmpl"],
      ["GLA 220d", "1950cc", "diesel", 14.0, "kmpl"]
    ],
    "GLC": [
      ["GLC 200", "1991cc turbo", "petrol", 13.0, "kmpl"],
      ["GLC 220d", "1993cc", "diesel", 13.0, "kmpl"],
      ["GLC 300", "1991cc turbo", "petrol", 13.0, "kmpl"]
    ],
    "GLE": [
      ["GLE 300d", "1950cc", "diesel", 10.0, "kmpl"],
      ["GLE 400d", "2925cc", "diesel", 10.0, "kmpl"],
      ["GLE 450", "2999cc turbo", "petrol", 10.0, "kmpl"]
    ],
    "EQS [EV]": [
      ["EQS 580", "electric", "electric", 5.5, "km/kWh"],
      ["EQS 450+", "electric", "electric", 5.5, "km/kWh"]
    ],
    "EQB [EV]": [
      ["EQB 250+", "electric", "electric", 6.0, "km/kWh"],
      ["EQB 350", "electric", "electric", 6.0, "km/kWh"]
    ]
  },
  "Audi": {
    "A4": [
      ["Premium", "1984cc turbo", "petrol", 13.0, "kmpl"],
      ["Premium Plus", "1984cc turbo", "petrol", 13.0, "kmpl"],
      ["Technology", "1984cc turbo", "petrol", 13.0, "kmpl"]
    ],
    "A6": [
      ["Premium Plus", "1984cc turbo", "petrol", 11.0, "kmpl"],
      ["Technology", "1984cc turbo", "petrol", 11.0, "kmpl"]
    ],
    "Q3": [
      ["Premium Plus", "1984cc turbo", "petrol", 14.0, "kmpl"],
      ["Technology", "1984cc turbo", "petrol", 14.0, "kmpl"]
    ],
    "Q5": [
      ["Premium Plus", "1984cc turbo", "petrol", 12.0, "kmpl"],
      ["Technology", "1984cc turbo", "petrol", 12.0, "kmpl"]
    ],
    "Q7": [
      ["Premium Plus", "2967cc", "diesel", 10.0, "kmpl"],
      ["Technology", "2967cc", "diesel", 10.0, "kmpl"]
    ],
    "Q8": [
      ["Celebration", "2995cc turbo", "petrol", 9.0, "kmpl"],
      ["Technology", "2995cc turbo", "petrol", 9.0, "kmpl"]
    ]
  },
  "Porsche": {
    "Cayenne": [
      ["Cayenne", "2995cc turbo", "petrol", 10.0, "kmpl"],
      ["Cayenne S", "2894cc turbo", "petrol", 10.0, "kmpl"],
      ["Cayenne GTS", "3996cc turbo", "petrol", 10.0, "kmpl"]
    ],
    "Macan": [
      ["Macan", "1984cc turbo", "petrol", 13.0, "kmpl"],
      ["Macan S", "2894cc turbo", "petrol", 13.0, "kmpl"]
    ],
    "Panamera": [
      ["Panamera", "2894cc turbo", "petrol", 10.0, "kmpl"],
      ["Panamera 4", "2894cc turbo", "petrol", 10.0, "kmpl"]
    ]
  },
  "Jaguar": {
    "XE": [
      ["S", "1997cc turbo", "petrol", 14.0, "kmpl"],
      ["SE", "1999cc", "diesel", 14.0, "kmpl"],
      ["R-Dynamic", "1997cc turbo", "petrol", 14.0, "kmpl"]
    ],
    "XF": [
      ["S", "1997cc turbo", "petrol", 12.0, "kmpl"],
      ["SE", "1999cc", "diesel", 12.0, "kmpl"],
      ["R-Dynamic", "1997cc turbo", "petrol", 12.0, "kmpl"]
    ],
    "F-Pace": [
      ["S", "1997cc turbo", "petrol", 12.0, "kmpl"],
      ["SE", "1999cc", "diesel", 12.0, "kmpl"],
      ["R-Dynamic", "1997cc turbo", "petrol", 12.0, "kmpl"]
    ]
  },
  "Land Rover": {
    "Defender": [
      ["90 X", "1997cc turbo", "petrol", 10.0, "kmpl"],
      ["110 S", "1999cc", "diesel", 10.0, "kmpl"],
      ["110 X", "2996cc", "petrol", 10.0, "kmpl"]
    ],
    "Discovery": [
      ["S", "1999cc", "diesel", 9.0, "kmpl"],
      ["SE", "2996cc", "petrol", 9.0, "kmpl"],
      ["HSE", "2996cc", "petrol", 9.0, "kmpl"]
    ],
    "Range Rover Evoque": [
      ["S", "1998cc turbo", "petrol", 13.0, "kmpl"],
      ["SE", "1999cc", "diesel", 13.0, "kmpl"],
      ["R-Dynamic", "1998cc turbo", "petrol", 13.0, "kmpl"]
    ],
    "Range Rover Sport": [
      ["SE", "2996cc", "petrol", 9.0, "kmpl"],
      ["HSE", "2996cc", "diesel", 9.0, "kmpl"],
      ["Autobiography", "4395cc", "petrol", 9.0, "kmpl"]
    ],
    "Range Rover Vogue": [
      ["SE", "2996cc", "diesel", 8.0, "kmpl"],
      ["HSE", "4395cc", "petrol", 8.0, "kmpl"],
      ["Autobiography", "4395cc", "petrol", 8.0, "kmpl"]
    ]
  },
  "Volvo": {
    "XC40": [
      ["B4 Momentum", "1969cc turbo", "petrol", 14.0, "kmpl"],
      ["B4 Inscription", "1969cc turbo", "petrol", 14.0, "kmpl"],
      ["B4 R-Design", "1969cc turbo", "petrol", 14.0, "kmpl"]
    ],
    "XC60": [
      ["B5 Momentum", "1969cc turbo", "petrol", 13.0, "kmpl"],
      ["B5 Inscription", "1969cc turbo", "petrol", 13.0, "kmpl"],
      ["B5 R-Design", "1969cc turbo", "petrol", 13.0, "kmpl"]
    ],
    "XC90": [
      ["B5 Momentum", "1969cc turbo", "petrol", 11.0, "kmpl"],
      ["B5 Inscription", "1969cc turbo", "petrol", 11.0, "kmpl"],
      ["B6 R-Design", "1969cc turbo", "petrol", 11.0, "kmpl"]
    ],
    "XC40 Recharge [EV]": [
      ["Single Motor", "electric", "electric", 5.8, "km/kWh"],
      ["Twin Motor", "electric", "electric", 5.8, "km/kWh"]
    ],
    "C40 Recharge [EV]": [
      ["Single Motor", "electric", "electric", 6.0, "km/kWh"],
      ["Twin Motor", "electric", "electric", 6.0, "km/kWh"]
    ]
  },
  "Lexus": {
    "ES 300h": [
      ["Exquisite", "2487cc hybrid", "petrol", 16.0, "kmpl"],
      ["Luxury", "2487cc hybrid", "petrol", 16.0, "kmpl"]
    ],
    "NX 300h": [
      ["Exquisite", "2494cc hybrid", "petrol", 17.0, "kmpl"],
      ["Luxury", "2494cc hybrid", "petrol", 17.0, "kmpl"],
      ["F-Sport", "2494cc hybrid", "petrol", 17.0, "kmpl"]
    ],
    "RX 450h": [
      ["Luxury", "3456cc hybrid", "petrol", 15.0, "kmpl"],
      ["F-Sport", "3456cc hybrid", "petrol", 15.0, "kmpl"]
    ]
  },
  "BYD": {
    "Seal [EV]": [
      ["Dynamic", "electric", "electric", 6.5, "km/kWh"],
      ["Premium", "electric", "electric", 6.5, "km/kWh"],
      ["Performance", "electric", "electric", 6.5, "km/kWh"]
    ],
    "Atto 3 [EV]": [
      ["Dynamic", "electric", "electric", 6.0, "km/kWh"],
      ["Premium", "electric", "electric", 6.0, "km/kWh"]
    ],
    "Sealion 6 [EV]": [
      ["Dynamic", "electric", "electric", 6.2, "km/kWh"],
      ["Premium", "electric", "electric", 6.2, "km/kWh"]
    ]
  },
  "Honda (2W)": {
    "Activa 6G": [
      ["Standard", "109.51cc", "petrol", 50.0, "kmpl"],
      ["DLX", "109.51cc", "petrol", 50.0, "kmpl"]
    ],
    "Shine": [
      ["Drum", "124cc", "petrol", 55.0, "kmpl"],
      ["Disc", "124cc", "petrol", 55.0, "kmpl"]
    ],
    "Unicorn": [
      ["Standard", "162.71cc", "petrol", 55.0, "kmpl"],
      ["Disc", "162.71cc", "petrol", 55.0, "kmpl"]
    ],
    "CB Hornet 2.0": [
      ["Standard", "184.4cc", "petrol", 40.0, "kmpl"],
      ["Repsol", "184.4cc", "petrol", 40.0, "kmpl"]
    ],
    "SP 125": [
      ["Drum", "124cc", "petrol", 60.0, "kmpl"],
      ["Disc", "124cc", "petrol", 60.0, "kmpl"]
    ]
  },
  "Royal Enfield (2W)": {
    "Classic 350": [
      ["Halcyon", "349cc", "petrol", 35.0, "kmpl"],
      ["Signals", "349cc", "petrol", 35.0, "kmpl"],
      ["Dark", "349cc", "petrol", 35.0, "kmpl"],
      ["Chrome", "349cc", "petrol", 35.0, "kmpl"]
    ],
    "Bullet 350": [
      ["Standard", "346cc", "petrol", 35.0, "kmpl"],
      ["ES", "346cc", "petrol", 35.0, "kmpl"],
      ["Military Silver", "346cc", "petrol", 35.0, "kmpl"]
    ],
    "Meteor 350": [
      ["Fireball", "349cc", "petrol", 36.0, "kmpl"],
      ["Stellar", "349cc", "petrol", 36.0, "kmpl"],
      ["Supernova", "349cc", "petrol", 36.0, "kmpl"]
    ],
    "Himalayan": [
      ["Standard", "411cc", "petrol", 30.0, "kmpl"],
      ["Granite", "411cc", "petrol", 30.0, "kmpl"],
      ["Sleet", "411cc", "petrol", 30.0, "kmpl"]
    ],
    "Hunter 350": [
      ["Retro", "349cc", "petrol", 36.0, "kmpl"],
      ["Metro", "349cc", "petrol", 36.0, "kmpl"],
      ["Rebel", "349cc", "petrol", 36.0, "kmpl"]
    ],
    "Thunderbird": [
      ["350", "346cc", "petrol", 30.0, "kmpl"],
      ["350X", "346cc", "petrol", 30.0, "kmpl"]
    ]
  },
  "Yamaha (2W)": {
    "FZ-S": [
      ["V3", "149cc", "petrol", 45.0, "kmpl"],
      ["FI V4", "149cc", "petrol", 45.0, "kmpl"],
      ["Dark Knight", "149cc", "petrol", 45.0, "kmpl"]
    ],
    "R15": [
      ["V4", "155cc", "petrol", 40.0, "kmpl"],
      ["V4 M", "155cc", "petrol", 40.0, "kmpl"],
      ["V4 Racing Blue", "155cc", "petrol", 40.0, "kmpl"]
    ],
    "MT-15": [
      ["V2", "155cc", "petrol", 40.0, "kmpl"],
      ["V2 Dark", "155cc", "petrol", 40.0, "kmpl"]
    ],
    "Fascino": [
      ["125 Fi", "125cc", "petrol", 55.0, "kmpl"],
      ["125 Fi Hybrid", "125cc", "petrol", 55.0, "kmpl"]
    ],
    "Ray ZR": [
      ["125 Fi", "125cc", "petrol", 55.0, "kmpl"],
      ["125 Street Rally", "125cc", "petrol", 55.0, "kmpl"]
    ]
  },
  "Suzuki (2W)": {
    "Access 125": [
      ["Standard", "124cc", "petrol", 50.0, "kmpl"],
      ["Disc", "124cc", "petrol", 50.0, "kmpl"],
      ["Special Edition", "124cc", "petrol", 50.0, "kmpl"]
    ],
    "Burgman Street": [
      ["Standard", "124cc", "petrol", 45.0, "kmpl"],
      ["EX", "124cc", "petrol", 45.0, "kmpl"]
    ],
    "Gixxer": [
      ["Standard", "155cc", "petrol", 45.0, "kmpl"],
      ["SF", "155cc", "petrol", 45.0, "kmpl"]
    ]
  },
  "TVS iQube (2W)": {
    "iQube [EV]": [
      ["Standard", "electric", "electric", 4.8, "km/kWh"],
      ["S", "electric", "electric", 4.8, "km/kWh"],
      ["ST", "electric", "electric", 4.8, "km/kWh"]
    ]
  },
  "Bajaj Chetak (2W)": {
    "Chetak [EV]": [
      ["Urbane", "electric", "electric", 4.5, "km/kWh"],
      ["Premium", "electric", "electric", 4.5, "km/kWh"]
    ]
  },
  "Revolt (2W)": {
    "RV400 [EV]": [
      ["Standard", "electric", "electric", 4.0, "km/kWh"],
      ["Premium", "electric", "electric", 4.0, "km/kWh"]
    ]
  },
  "Public Transport": {
    "Delhi Metro": [
      ["Delhi Metro", "metro", "public", null, "km"]
    ],
    "DTC Bus": [
      ["DTC Bus", "bus", "public", null, "km"]
    ],
    "Auto Rickshaw": [
      ["Auto Rickshaw", "auto", "auto", null, "km"]
    ],
    "E-Rickshaw": [
      ["E-Rickshaw", "erickshaw", "erickshaw", null, "km"]
    ]
  },
  "Walk/Cycle": {
    "Walk": [
      ["Walking", "zero emission", "walk", null, null]
    ],
    "Cycle": [
      ["Cycling", "zero emission", "walk", null, null]
    ]
  }
};
// ============================================================
// State for selected vehicle
// ============================================================
var selectedBrand = null;
var selectedModel = null;
var selectedVariant = null; // [name, desc, fuel, mileage, unit]
// ============================================================
// Cascade dropdown logic
// ============================================================
var brandSelect = document.getElementById("brand");
var modelSelect = document.getElementById("model");
var variantSelect = document.getElementById("variant");
var modelGroup = document.getElementById("model-group");
var variantGroup = document.getElementById("variant-group");
var mileageGroup = document.getElementById("mileage-group");
var claimedMileageEl = document.getElementById("claimed-mileage");
var useActualCheckbox = document.getElementById("use-actual-mileage");
var actualMileageInput = document.getElementById("actual-mileage-input");
var actualMileageField = document.getElementById("actual-mileage");
var kmGroup = document.getElementById("km-group");
var kmSlider = document.getElementById("daily-km");
var kmValue = document.getElementById("km-value");
// Populate brands
Object.keys(DB).forEach(function (brand) {
  var opt = document.createElement("option");
  opt.value = brand;
  opt.textContent = brand;
  brandSelect.appendChild(opt);
});
brandSelect.addEventListener("change", function () {
  selectedBrand = brandSelect.value;
  selectedModel = null;
  selectedVariant = null;
  modelSelect.innerHTML = '<option value="" disabled selected>Select model</option>';
  variantSelect.innerHTML = '<option value="" disabled selected>Select variant</option>';
  variantGroup.classList.add("hidden");
  mileageGroup.classList.add("hidden");
  kmGroup.classList.add("hidden");
  useActualCheckbox.checked = false;
  actualMileageInput.classList.add("hidden");
  var models = DB[selectedBrand];
  if (!models) return;
  Object.keys(models).forEach(function (model) {
    var opt = document.createElement("option");
    opt.value = model;
    opt.textContent = model;
    modelSelect.appendChild(opt);
  });
  modelGroup.classList.remove("hidden");
});
modelSelect.addEventListener("change", function () {
  selectedModel = modelSelect.value;
  selectedVariant = null;
  variantSelect.innerHTML = '<option value="" disabled selected>Select variant</option>';
  mileageGroup.classList.add("hidden");
  kmGroup.classList.add("hidden");
  useActualCheckbox.checked = false;
  actualMileageInput.classList.add("hidden");
  var variants = DB[selectedBrand][selectedModel];
  if (!variants) return;
  variants.forEach(function (v, i) {
    var opt = document.createElement("option");
    opt.value = i;
    var label = v[0] + " (" + v[1] + ", " + v[2];
    if (v[3] !== null && v[4]) {
      label += ", " + v[3] + " " + v[4];
    }
    label += ")";
    opt.textContent = label;
    variantSelect.appendChild(opt);
  });
  variantGroup.classList.remove("hidden");
});
variantSelect.addEventListener("change", function () {
  var idx = parseInt(variantSelect.value, 10);
  selectedVariant = DB[selectedBrand][selectedModel][idx];
  var fuel = selectedVariant[2];
  var showMileage = (fuel === "petrol" || fuel === "diesel" || fuel === "cng");
  if (showMileage) {
    var unit = selectedVariant[4] || "kmpl";
    claimedMileageEl.textContent = selectedVariant[3] + " " + unit;
    mileageGroup.classList.remove("hidden");
  } else {
    mileageGroup.classList.add("hidden");
  }
  if (fuel === "walk") {
    kmGroup.classList.add("hidden");
  } else {
    kmGroup.classList.remove("hidden");
  }
  useActualCheckbox.checked = false;
  actualMileageInput.classList.add("hidden");
});
// Mileage toggle
useActualCheckbox.addEventListener("change", function () {
  if (useActualCheckbox.checked) {
    actualMileageInput.classList.remove("hidden");
    actualMileageField.focus();
  } else {
    actualMileageInput.classList.add("hidden");
  }
});
// KM slider
kmSlider.addEventListener("input", function () {
  kmValue.textContent = kmSlider.value;
});
// ============================================================
// Helper: get effective mileage for selected variant
// ============================================================
function getEffectiveMileage() {
  if (!selectedVariant) return null;
  if (useActualCheckbox.checked && actualMileageField.value) {
    return parseFloat(actualMileageField.value);
  }
  return selectedVariant[3];
}
// ============================================================
// Helper: calculate commute CO2 in tonnes/year
// ============================================================
// Vehicle usage frequency multiplier
var FREQ_MULTIPLIER = { daily: 1.0, frequent: 0.7, occasional: 0.35, rare: 0.1 };
function getFreqMultiplier() {
  var checked = document.querySelector('input[name="usage-freq"]:checked');
  return checked ? (FREQ_MULTIPLIER[checked.value] || 1.0) : 1.0;
}
function calcCommuteEmission() {
  if (!selectedVariant) return 0;
  var fuel = selectedVariant[2];
  var dailyKm = parseInt(kmSlider.value, 10) || 0;
  var freqMult = getFreqMultiplier();
  if (fuel === "walk") return 0;
  if (fuel === "public") return (dailyKm * EF.public * 365 * freqMult) / 1000;
  if (fuel === "auto") return (dailyKm * EF.auto * 365 * freqMult) / 1000;
  if (fuel === "erickshaw") return (dailyKm * EF.erickshaw * 365 * freqMult) / 1000;
  if (fuel === "electric") {
    var kmPerKwh = getEffectiveMileage();
    if (!kmPerKwh || kmPerKwh === 0) return 0;
    return (dailyKm / kmPerKwh) * EF.electric * 365 * freqMult / 1000;
  }
  var mileage = getEffectiveMileage();
  if (!mileage || mileage === 0) return 0;
  var factor = fuel === "cng" ? EF.cng : fuel === "diesel" ? EF.diesel : EF.petrol;
  return ((dailyKm / mileage) * factor * 365 * freqMult) / 1000;
}
// Show usage frequency when a non-walk/PT vehicle is selected
variantSelect.addEventListener("change", function () {
  var freqGroup = document.getElementById("usage-freq-group");
  if (freqGroup && selectedVariant) {
    var fuel = selectedVariant[2];
    if (fuel !== "walk" && fuel !== "public" && fuel !== "auto" && fuel !== "erickshaw") {
      freqGroup.classList.remove("hidden");
    } else {
      freqGroup.classList.add("hidden");
    }
  }
});
// ============================================================
// Public Transport — toggle, checkboxes, CO2 calculation
// ============================================================
(function initPublicTransport() {
  var ptNoBtn = document.getElementById("pt-no-btn");
  var ptYesBtn = document.getElementById("pt-yes-btn");
  var ptFields = document.getElementById("pt-fields");
  if (!ptNoBtn || !ptYesBtn || !ptFields) return;

  ptNoBtn.classList.add("active");
  ptNoBtn.addEventListener("click", function () {
    ptNoBtn.classList.add("active");
    ptYesBtn.classList.remove("active");
    ptFields.classList.add("hidden");
  });
  ptYesBtn.addEventListener("click", function () {
    ptYesBtn.classList.add("active");
    ptNoBtn.classList.remove("active");
    ptFields.classList.remove("hidden");
  });

  // Wire checkboxes to show/hide km inputs
  var ptTypes = ["metro", "bus", "auto"];
  ptTypes.forEach(function (type) {
    var checkbox = document.getElementById("pt-" + type + "-check");
    var kmGroup = document.getElementById("pt-" + type + "-km-group");
    if (!checkbox || !kmGroup) return;
    checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
        kmGroup.classList.remove("hidden");
      } else {
        kmGroup.classList.add("hidden");
      }
    });
  });
})();

// Public transport emission factors (kg CO2 per km)
var PT_EF = { metro: 0.031, bus: 0.089, auto: 0.12 };

function calcPublicTransportEmission() {
  var ptYesBtn = document.getElementById("pt-yes-btn");
  if (!ptYesBtn || !ptYesBtn.classList.contains("active")) return 0;
  var total = 0;
  var ptTypes = ["metro", "bus", "auto"];
  ptTypes.forEach(function (type) {
    var checkbox = document.getElementById("pt-" + type + "-check");
    var kmInput = document.getElementById("pt-" + type + "-km");
    if (checkbox && checkbox.checked && kmInput) {
      var km = parseFloat(kmInput.value) || 0;
      total += km * PT_EF[type] * 365;
    }
  });
  return total / 1000; // tonnes/year
}
// ============================================================
// Part 2: Meals & Electricity
// ============================================================
// ---------- FOOD UI STYLES (injected) ----------
(function () {
  var s = document.createElement("style");
  s.textContent =
    ".food-slot-wrapper { margin-top: 0.5rem; }" +
    ".food-search-wrap { position: relative; }" +
    ".food-search-input { width: 100%; padding: 0.75rem 1rem; font-size: 1rem;" +
    "  border: 2px solid #e5e7eb; border-radius: 12px; background: #fff; color: #1f2937;" +
    "  transition: border-color 0.2s; outline: none; }" +
    ".food-search-input:focus { border-color: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,0.15); }" +
    ".food-dropdown { position: absolute; top: 100%; left: 0; right: 0; z-index: 100;" +
    "  background: #fff; border: 2px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;" +
    "  max-height: 260px; overflow-y: auto; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }" +
    ".food-dropdown-cat { padding: 0.35rem 0.75rem; font-size: 0.7rem; font-weight: 700;" +
    "  text-transform: uppercase; letter-spacing: 0.05em; color: #16a34a; background: #f0fdf4; }" +
    ".food-dropdown-item { padding: 0.5rem 0.75rem; cursor: pointer; display: flex;" +
    "  justify-content: space-between; align-items: center; font-size: 0.9rem; }" +
    ".food-dropdown-item:hover, .food-dropdown-item.active { background: #dcfce7; }" +
    ".food-item-name { font-weight: 500; color: #1f2937; }" +
    ".food-item-meta { font-size: 0.78rem; color: #4b5563; }" +
    ".food-items-list { margin-top: 0.5rem; }" +
    ".food-item-row { display: flex; align-items: center; gap: 0.5rem; padding: 0.45rem 0;" +
    "  border-bottom: 1px solid #f3f4f6; flex-wrap: wrap; }" +
    ".food-item-row:last-child { border-bottom: none; }" +
    ".food-item-row-name { flex: 1; font-size: 0.9rem; font-weight: 500; color: #374151; min-width: 100px; }" +
    ".food-item-row-controls { display: flex; align-items: center; gap: 0.25rem; }" +
    ".food-qty-btn { width: 26px; height: 26px; border: 1px solid #e5e7eb; border-radius: 6px;" +
    "  background: #f9fafb; cursor: pointer; font-size: 1rem; line-height: 1; display: flex;" +
    "  align-items: center; justify-content: center; color: #374151; font-family: inherit; }" +
    ".food-qty-btn:hover { background: #dcfce7; border-color: #22c55e; }" +
    ".food-qty-input { width: 40px; text-align: center; padding: 0.2rem; border: 1px solid #e5e7eb;" +
    "  border-radius: 6px; font-size: 0.85rem; font-family: inherit; }" +
    ".food-qty-input:focus { outline: none; border-color: #22c55e; }" +
    ".food-item-row-unit { font-size: 0.72rem; color: #6b7280; min-width: 55px; }" +
    ".food-item-row-co2 { font-size: 0.85rem; font-weight: 600; color: #15803d; min-width: 60px; text-align: right; }" +
    ".food-item-remove { background: none; border: none; color: #9ca3af; cursor: pointer;" +
    "  font-size: 1.1rem; padding: 0 0.2rem; line-height: 1; }" +
    ".food-item-remove:hover { color: #ef4444; }" +
    ".food-slot-subtotal { margin-top: 0.35rem; font-size: 0.85rem; color: #4b5563;" +
    "  padding: 0.25rem 0; }" +
    ".food-slot-subtotal strong { color: #15803d; }" +
    "@media (max-width: 768px) {" +
    "  .food-item-row { gap: 0.3rem; }" +
    "  .food-item-row-name { font-size: 0.82rem; min-width: 80px; }" +
    "  .food-item-row-unit { display: none; }" +
    "}";
  document.head.appendChild(s);
})();
// ---------- EXPANDED FOOD DATABASE ----------
// Each item: [name, co2_per_serving, unit_label, category]
var FOOD_DB = [
  // BREAKFAST
  ["Boiled Egg", 0.2, "per egg", "breakfast"],
  ["Scrambled Eggs", 0.22, "per egg", "breakfast"],
  ["Omelette (2 eggs)", 0.45, "per serving", "breakfast"],
  ["Paratha plain", 0.15, "per piece", "breakfast"],
  ["Paratha with butter", 0.18, "per piece", "breakfast"],
  ["Aloo Paratha", 0.2, "per piece", "breakfast"],
  ["Idli", 0.05, "per piece", "breakfast"],
  ["Dosa plain", 0.12, "per serving", "breakfast"],
  ["Masala Dosa", 0.18, "per serving", "breakfast"],
  ["Uttapam", 0.15, "per serving", "breakfast"],
  ["Poha", 0.1, "per bowl", "breakfast"],
  ["Upma", 0.1, "per bowl", "breakfast"],
  ["White Bread toast", 0.04, "per slice", "breakfast"],
  ["Brown Bread toast", 0.035, "per slice", "breakfast"],
  ["Cornflakes with milk", 0.25, "per bowl", "breakfast"],
  ["Oats with milk", 0.22, "per bowl", "breakfast"],
  ["Banana", 0.08, "per piece", "breakfast"],
  ["Apple", 0.07, "per piece", "breakfast"],
  ["Curd/Yoghurt", 0.15, "per bowl", "breakfast"],
  ["Tea with milk", 0.06, "per cup", "breakfast"],
  ["Coffee with milk", 0.07, "per cup", "breakfast"],
  ["Black Tea", 0.01, "per cup", "breakfast"],
  ["Black Coffee", 0.01, "per cup", "breakfast"],
  // LUNCH/DINNER
  ["Dal Tadka", 0.2, "per bowl", "meal"],
  ["Dal Makhani", 0.35, "per bowl", "meal"],
  ["Rajma", 0.25, "per bowl", "meal"],
  ["Chole", 0.28, "per bowl", "meal"],
  ["Paneer Butter Masala", 0.45, "per serving", "meal"],
  ["Shahi Paneer", 0.5, "per serving", "meal"],
  ["Palak Paneer", 0.38, "per serving", "meal"],
  ["Kadai Paneer", 0.42, "per serving", "meal"],
  ["Chicken Curry", 0.55, "per serving", "meal"],
  ["Butter Chicken", 0.6, "per serving", "meal"],
  ["Chicken Biryani", 0.65, "per serving", "meal"],
  ["Grilled Chicken", 0.5, "per serving", "meal"],
  ["Mutton Curry", 0.85, "per serving", "meal"],
  ["Mutton Biryani", 0.9, "per serving", "meal"],
  ["Fish Curry", 0.4, "per serving", "meal"],
  ["Prawns", 0.5, "per serving", "meal"],
  ["Egg Curry", 0.35, "per serving", "meal"],
  ["Egg Biryani", 0.4, "per serving", "meal"],
  ["Veg Biryani", 0.3, "per serving", "meal"],
  ["Veg Pulao", 0.25, "per serving", "meal"],
  ["Jeera Rice", 0.2, "per bowl", "meal"],
  ["Plain Rice", 0.18, "per bowl", "meal"],
  ["Roti/Chapati", 0.05, "per piece", "meal"],
  ["Naan", 0.08, "per piece", "meal"],
  ["Puri", 0.07, "per piece", "meal"],
  ["Sambar", 0.12, "per bowl", "meal"],
  ["Rasam", 0.08, "per bowl", "meal"],
  ["Aloo Sabzi", 0.12, "per serving", "meal"],
  ["Bhindi", 0.1, "per serving", "meal"],
  ["Gobi", 0.1, "per serving", "meal"],
  ["Mixed Veg", 0.12, "per serving", "meal"],
  ["Green Salad", 0.05, "per serving", "meal"],
  ["Raita", 0.1, "per bowl", "meal"],
  ["Pizza slice", 0.35, "per slice", "meal"],
  ["Burger", 0.45, "per piece", "meal"],
  ["Sandwich", 0.2, "per piece", "meal"],
  ["Noodles", 0.22, "per serving", "meal"],
  ["Pasta", 0.25, "per serving", "meal"],
  ["Fried Rice", 0.28, "per serving", "meal"],
  // SNACKS
  ["Samosa", 0.12, "per piece", "snack"],
  ["Pakora", 0.15, "per 4 pieces", "snack"],
  ["Biscuits", 0.08, "per 4 pieces", "snack"],
  ["Namkeen/Chips", 0.1, "per small pack", "snack"],
  ["Fruit", 0.07, "per piece", "snack"],
  ["Mixed Nuts", 0.1, "per handful", "snack"],
  ["Cold drink/Soda", 0.05, "per glass", "snack"],
  ["Juice", 0.08, "per glass", "snack"],
  ["Lassi", 0.15, "per glass", "snack"]
];
// Build lookup map: name -> co2
var FOOD_CO2 = {};
FOOD_DB.forEach(function (f) { FOOD_CO2[f[0]] = f[1]; });
// Per-slot state: each meal slot stores array of {name, qty, co2}
var mealSlotItems = {
  "meal-breakfast": [],
  "meal-lunch": [],
  "meal-snack": [],
  "meal-dinner": []
};
// Transform the original <select> elements into searchable autocomplete + quantity UI
(function initFoodUI() {
  var slotIds = ["meal-breakfast", "meal-lunch", "meal-snack", "meal-dinner"];
  slotIds.forEach(function (slotId) {
    var origSelect = document.getElementById(slotId);
    if (!origSelect) return;
    var formGroup = origSelect.parentElement;
    var labelEl = formGroup.querySelector("label");
    var labelText = labelEl ? labelEl.textContent : slotId;
    // Hide the original select
    origSelect.style.display = "none";
    origSelect.removeAttribute("required");
    // Create wrapper
    var wrapper = document.createElement("div");
    wrapper.className = "food-slot-wrapper";
    wrapper.setAttribute("data-slot", slotId);
    // Search input
    var searchWrap = document.createElement("div");
    searchWrap.className = "food-search-wrap";
    var searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.className = "food-search-input";
    searchInput.placeholder = "Search food items...";
    searchInput.setAttribute("autocomplete", "off");
    var dropdown = document.createElement("div");
    dropdown.className = "food-dropdown hidden";
    searchWrap.appendChild(searchInput);
    searchWrap.appendChild(dropdown);
    wrapper.appendChild(searchWrap);
    // Items list for this slot
    var itemsList = document.createElement("div");
    itemsList.className = "food-items-list";
    itemsList.setAttribute("data-slot", slotId);
    wrapper.appendChild(itemsList);
    // Slot CO2 subtotal
    var subtotalEl = document.createElement("div");
    subtotalEl.className = "food-slot-subtotal";
    subtotalEl.innerHTML = '<span class="food-slot-label">' + labelText + ' CO2:</span> <strong>0</strong> kg';
    wrapper.appendChild(subtotalEl);
    formGroup.appendChild(wrapper);
    // Populate dropdown on focus/input
    function renderDropdown(query) {
      dropdown.innerHTML = "";
      var q = (query || "").toLowerCase().trim();
      var matches = FOOD_DB.filter(function (f) {
        return q === "" || f[0].toLowerCase().indexOf(q) !== -1;
      });
      if (matches.length === 0) {
        dropdown.classList.add("hidden");
        return;
      }
      var maxShow = 8;
      var shown = 0;
      // Group by category for display
      var cats = { breakfast: "Breakfast", meal: "Lunch / Dinner", snack: "Snack" };
      var grouped = {};
      matches.forEach(function (f) {
        var cat = f[3];
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(f);
      });
      Object.keys(cats).forEach(function (catKey) {
        if (!grouped[catKey] || shown >= maxShow) return;
        var catLabel = document.createElement("div");
        catLabel.className = "food-dropdown-cat";
        catLabel.textContent = cats[catKey];
        dropdown.appendChild(catLabel);
        grouped[catKey].forEach(function (f) {
          if (shown >= maxShow) return;
          var item = document.createElement("div");
          item.className = "food-dropdown-item";
          item.innerHTML = '<span class="food-item-name">' + f[0] + '</span>' +
            '<span class="food-item-meta">' + f[1] + ' kg CO2 ' + f[2] + '</span>';
          item.setAttribute("data-food-name", f[0]);
          item.addEventListener("mousedown", function (e) {
            e.preventDefault();
            addFoodItem(slotId, f[0], 1);
            searchInput.value = "";
            dropdown.classList.add("hidden");
          });
          dropdown.appendChild(item);
          shown++;
        });
      });
      dropdown.classList.remove("hidden");
    }
    searchInput.addEventListener("focus", function () {
      renderDropdown(searchInput.value);
    });
    searchInput.addEventListener("input", function () {
      renderDropdown(searchInput.value);
    });
    searchInput.addEventListener("blur", function () {
      // Delay to allow click on dropdown item
      setTimeout(function () { dropdown.classList.add("hidden"); }, 200);
    });
    // Keyboard navigation
    searchInput.addEventListener("keydown", function (e) {
      var items = dropdown.querySelectorAll(".food-dropdown-item");
      var active = dropdown.querySelector(".food-dropdown-item.active");
      var idx = -1;
      if (active) {
        for (var i = 0; i < items.length; i++) {
          if (items[i] === active) { idx = i; break; }
        }
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (active) active.classList.remove("active");
        idx = (idx + 1) % items.length;
        items[idx].classList.add("active");
        items[idx].scrollIntoView({ block: "nearest" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (active) active.classList.remove("active");
        idx = idx <= 0 ? items.length - 1 : idx - 1;
        items[idx].classList.add("active");
        items[idx].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (active) {
          var foodName = active.getAttribute("data-food-name");
          addFoodItem(slotId, foodName, 1);
          searchInput.value = "";
          dropdown.classList.add("hidden");
        }
      }
    });
  });
})();
// Add a food item to a meal slot
function addFoodItem(slotId, foodName, qty) {
  var co2 = FOOD_CO2[foodName];
  if (co2 === undefined) return;
  // Check if already in slot, if so increment qty
  var items = mealSlotItems[slotId];
  for (var i = 0; i < items.length; i++) {
    if (items[i].name === foodName) {
      items[i].qty += qty;
      renderFoodSlot(slotId);
      updateMealTotal();
      return;
    }
  }
  items.push({ name: foodName, qty: qty, co2: co2 });
  renderFoodSlot(slotId);
  updateMealTotal();
}
// Remove a food item from a meal slot
function removeFoodItem(slotId, foodName) {
  mealSlotItems[slotId] = mealSlotItems[slotId].filter(function (it) {
    return it.name !== foodName;
  });
  renderFoodSlot(slotId);
  updateMealTotal();
}
// Render the items list for a slot
function renderFoodSlot(slotId) {
  var listEl = document.querySelector('.food-items-list[data-slot="' + slotId + '"]');
  if (!listEl) return;
  listEl.innerHTML = "";
  var slotTotal = 0;
  mealSlotItems[slotId].forEach(function (item) {
    var itemCo2 = item.co2 * item.qty;
    slotTotal += itemCo2;
    var row = document.createElement("div");
    row.className = "food-item-row";
    // Find unit label
    var unitLabel = "";
    for (var i = 0; i < FOOD_DB.length; i++) {
      if (FOOD_DB[i][0] === item.name) { unitLabel = FOOD_DB[i][2]; break; }
    }
    row.innerHTML =
      '<span class="food-item-row-name">' + item.name + '</span>' +
      '<div class="food-item-row-controls">' +
        '<button type="button" class="food-qty-btn" data-action="dec">&minus;</button>' +
        '<input type="number" class="food-qty-input" value="' + item.qty + '" min="1" max="20" step="1">' +
        '<button type="button" class="food-qty-btn" data-action="inc">+</button>' +
        '<span class="food-item-row-unit">' + unitLabel + '</span>' +
      '</div>' +
      '<span class="food-item-row-co2">' + itemCo2.toFixed(2) + ' kg</span>' +
      '<button type="button" class="food-item-remove" title="Remove">&times;</button>';
    // Qty buttons
    row.querySelector('[data-action="dec"]').addEventListener("click", function () {
      if (item.qty > 1) {
        item.qty--;
        renderFoodSlot(slotId);
        updateMealTotal();
      }
    });
    row.querySelector('[data-action="inc"]').addEventListener("click", function () {
      if (item.qty < 20) {
        item.qty++;
        renderFoodSlot(slotId);
        updateMealTotal();
      }
    });
    // Qty input direct edit
    var qtyInput = row.querySelector(".food-qty-input");
    qtyInput.addEventListener("change", function () {
      var v = parseInt(qtyInput.value, 10);
      if (isNaN(v) || v < 1) v = 1;
      if (v > 20) v = 20;
      item.qty = v;
      renderFoodSlot(slotId);
      updateMealTotal();
    });
    // Remove button
    row.querySelector(".food-item-remove").addEventListener("click", function () {
      removeFoodItem(slotId, item.name);
    });
    listEl.appendChild(row);
  });
  // Update slot subtotal
  var wrapper = listEl.closest(".food-slot-wrapper");
  if (wrapper) {
    var sub = wrapper.querySelector(".food-slot-subtotal strong");
    if (sub) sub.textContent = slotTotal.toFixed(2);
  }
}
// Calculate total daily food CO2
var mealDailyTotal = document.getElementById("meal-daily-total");
function updateMealTotal() {
  var total = 0;
  var slotIds = ["meal-breakfast", "meal-lunch", "meal-snack", "meal-dinner"];
  slotIds.forEach(function (sid) {
    mealSlotItems[sid].forEach(function (item) {
      total += item.co2 * item.qty;
    });
  });
  if (mealDailyTotal) mealDailyTotal.textContent = total.toFixed(1);
  return total;
}
function calcMealEmission() {
  var dailyKg = updateMealTotal();
  return (dailyKg * 365) / 1000;
}
// ---------- ELECTRICITY DATA ----------
var STATE_EF = {
  "Delhi": 0.82, "Maharashtra": 0.72, "Karnataka": 0.61,
  "Tamil Nadu": 0.78, "Uttar Pradesh": 0.88, "Gujarat": 0.76,
  "Rajasthan": 0.84, "West Bengal": 0.90, "Telangana": 0.74,
  "Andhra Pradesh": 0.72, "Kerala": 0.40, "Punjab": 0.80,
  "Haryana": 0.83, "Madhya Pradesh": 0.86, "Bihar": 0.89,
  "Odisha": 0.88, "Jharkhand": 0.91, "Chhattisgarh": 0.92,
  "Assam": 0.78, "Uttarakhand": 0.50, "Himachal Pradesh": 0.30,
  "Goa": 0.75, "Jammu & Kashmir": 0.55, "Other": 0.82
};
var STATE_PROVIDERS = {
  "Delhi": ["Tata Power DDL", "BSES Rajdhani", "BSES Yamuna", "NDPL"],
  "Maharashtra": ["Tata Power Mumbai", "MSEDCL", "Adani Electricity"],
  "Karnataka": ["BESCOM", "HESCOM", "GESCOM", "CESCOM"],
  "Tamil Nadu": ["TNEB (TANGEDCO)"],
  "Uttar Pradesh": ["UPPCL", "PVVNL", "DVVNL", "MVVNL"],
  "Gujarat": ["UGVCL", "DGVCL", "MGVCL", "PGVCL", "Torrent Power"],
  "Rajasthan": ["JVVNL", "AVVNL", "JdVVNL"],
  "West Bengal": ["WBSEDCL", "CESC Kolkata"],
  "Telangana": ["TSSPDCL", "TSNPDCL"],
  "Andhra Pradesh": ["APSPDCL", "APEPDCL"],
  "Kerala": ["KSEB"], "Punjab": ["PSPCL"],
  "Haryana": ["UHBVNL", "DHBVNL"],
  "Madhya Pradesh": ["MPEB", "MPPKVVCL"],
  "Bihar": ["SBPDCL", "NBPDCL"],
  "Odisha": ["TPCODL", "TPSODL", "TPNODL", "TPWODL"],
  "Jharkhand": ["JBVNL"], "Chhattisgarh": ["CSPDCL"],
  "Assam": ["APDCL"], "Uttarakhand": ["UPCL"],
  "Himachal Pradesh": ["HPSEB"], "Goa": ["Goa Electricity Dept"],
  "Jammu & Kashmir": ["JKPDD"]
};
var stateSelect = document.getElementById("state");
var providerGroup = document.getElementById("provider-group");
var providerSelect = document.getElementById("provider");
var monthlyUnitsInput = document.getElementById("monthly-units");
var elecResult = document.getElementById("elec-result");
var elecTonnes = document.getElementById("elec-tonnes");
Object.keys(STATE_EF).forEach(function (s) {
  var opt = document.createElement("option");
  opt.value = s;
  opt.textContent = s;
  stateSelect.appendChild(opt);
});
stateSelect.addEventListener("change", function () {
  var state = stateSelect.value;
  var providers = STATE_PROVIDERS[state];
  providerSelect.innerHTML = '<option value="" disabled selected>Select provider</option>';
  if (providers && providers.length > 0) {
    providers.forEach(function (p) {
      var opt = document.createElement("option");
      opt.value = p;
      opt.textContent = p;
      providerSelect.appendChild(opt);
    });
    providerGroup.classList.remove("hidden");
  } else {
    providerGroup.classList.add("hidden");
  }
  updateElecResult();
});
monthlyUnitsInput.addEventListener("input", updateElecResult);
function getStateEF() {
  return STATE_EF[stateSelect.value] || 0.82;
}
function updateElecResult() {
  var units = parseFloat(monthlyUnitsInput.value) || 0;
  var ef = getStateEF();
  if (units > 0 && stateSelect.value) {
    elecTonnes.textContent = ((units * ef * 12) / 1000).toFixed(2);
    elecResult.classList.remove("hidden");
  } else {
    elecResult.classList.add("hidden");
  }
}
function calcElecEmission() {
  var units = parseFloat(monthlyUnitsInput.value) || 0;
  return (units * getStateEF() * 12) / 1000;
}
// ============================================================
// Solar Panel Calculation Logic
// ============================================================
// Solar state — will be wired to HTML inputs in next session
var solarEnabled = false;
var solarSystemSize = 0;     // kW
var solarMonthlyGen = 0;     // kWh generated per month
var solarMonthlyExport = 0;  // kWh exported to grid per month

// Inject solar UI into the calculator (between Electricity and Flights)
(function initSolarUI() {
  var elecResult = document.getElementById("elec-result");
  if (!elecResult) return;
  var insertPoint = elecResult.parentElement || elecResult;
  // Find the flights section label to insert before it
  var allLabels = document.querySelectorAll(".section-label");
  var flightsLabel = null;
  for (var i = 0; i < allLabels.length; i++) {
    if (allLabels[i].textContent.indexOf("Flights") !== -1) {
      flightsLabel = allLabels[i];
      break;
    }
  }
  if (!flightsLabel) return;

  var solarSection = document.createElement("div");
  solarSection.id = "solar-section";
  solarSection.innerHTML =
    '<div class="section-label">\u2600\uFE0F Solar Panels</div>' +
    '<div class="form-group">' +
      '<label>Do you have solar panels at home?</label>' +
      '<div class="toggle-row">' +
        '<button type="button" class="toggle-btn" id="solar-no-btn">No</button>' +
        '<button type="button" class="toggle-btn" id="solar-yes-btn">Yes</button>' +
      '</div>' +
    '</div>' +
    '<div id="solar-fields" class="hidden">' +
      '<div class="form-group">' +
        '<label for="solar-size">System Size (kW)</label>' +
        '<input type="number" id="solar-size" min="0" max="50" step="0.5" placeholder="e.g. 3">' +
        '<small class="input-helper">Most Delhi homes install 3\u20135kW</small>' +
      '</div>' +
      '<div class="form-group">' +
        '<label for="solar-gen">Monthly Units Generated (kWh)</label>' +
        '<input type="number" id="solar-gen" min="0" max="5000" placeholder="e.g. 350">' +
        '<small class="input-helper">Check your solar inverter app or net meter</small>' +
      '</div>' +
      '<div class="form-group">' +
        '<label for="solar-export">Units Exported to Grid (kWh/month)</label>' +
        '<input type="number" id="solar-export" min="0" max="5000" placeholder="e.g. 100">' +
        '<small class="input-helper">Units sent back to DISCOM \u2014 check net meter reading</small>' +
      '</div>' +
      '<div id="solar-result" class="hidden" style="background:#f0fdf4;padding:0.75rem 1rem;border-radius:12px;font-size:0.95rem;margin-bottom:0.5rem;border:2px solid #bbf7d0">' +
        '<strong style="color:#15803d">\u2600\uFE0F Solar Savings</strong><br>' +
        'Your solar panels avoid <strong id="solar-savings-kg" style="color:#15803d">0</strong> kg CO2/month' +
        ' \u2014 equivalent to planting <strong id="solar-trees" style="color:#15803d">0</strong> trees' +
      '</div>' +
    '</div>';

  flightsLabel.parentNode.insertBefore(solarSection, flightsLabel);

  var solarYesBtn = document.getElementById("solar-yes-btn");
  var solarNoBtn = document.getElementById("solar-no-btn");
  var solarFields = document.getElementById("solar-fields");
  var solarSizeInput = document.getElementById("solar-size");
  var solarGenInput = document.getElementById("solar-gen");
  var solarExportInput = document.getElementById("solar-export");
  var solarResultEl = document.getElementById("solar-result");
  var solarSavingsKg = document.getElementById("solar-savings-kg");
  var solarTreesEl = document.getElementById("solar-trees");

  // Default: No selected
  solarNoBtn.classList.add("active");

  solarYesBtn.addEventListener("click", function () {
    solarEnabled = true;
    solarYesBtn.classList.add("active");
    solarNoBtn.classList.remove("active");
    solarFields.classList.remove("hidden");
  });
  solarNoBtn.addEventListener("click", function () {
    solarEnabled = false;
    solarNoBtn.classList.add("active");
    solarYesBtn.classList.remove("active");
    solarFields.classList.add("hidden");
    solarResultEl.classList.add("hidden");
    solarSystemSize = 0;
    solarMonthlyGen = 0;
    solarMonthlyExport = 0;
  });

  function updateSolarResult() {
    solarSystemSize = parseFloat(solarSizeInput.value) || 0;
    solarMonthlyGen = parseFloat(solarGenInput.value) || 0;
    solarMonthlyExport = parseFloat(solarExportInput.value) || 0;
    if (solarMonthlyGen > 0) {
      var ef = getStateEF();
      var monthlySavings = (solarMonthlyGen + solarMonthlyExport) * ef;
      var trees = Math.round(monthlySavings / 1.83);
      solarSavingsKg.textContent = monthlySavings.toFixed(1);
      solarTreesEl.textContent = trees;
      solarResultEl.classList.remove("hidden");
    } else {
      solarResultEl.classList.add("hidden");
    }
  }

  solarSizeInput.addEventListener("input", updateSolarResult);
  solarGenInput.addEventListener("input", updateSolarResult);
  solarExportInput.addEventListener("input", updateSolarResult);
})();

// Wire up static HTML solar toggles (solar-html-* IDs from index.html)
(function initStaticSolarHTML() {
  var htmlNo = document.getElementById("solar-html-no");
  var htmlYes = document.getElementById("solar-html-yes");
  var htmlFields = document.getElementById("solar-html-fields");
  var htmlSize = document.getElementById("solar-html-size");
  var htmlGen = document.getElementById("solar-html-gen");
  var htmlExport = document.getElementById("solar-html-export");
  var htmlResult = document.getElementById("solar-html-result");
  var htmlSavingsKg = document.getElementById("solar-html-savings-kg");
  var htmlTrees = document.getElementById("solar-html-trees");
  if (!htmlNo || !htmlYes) return;

  htmlNo.classList.add("active");
  htmlYes.addEventListener("click", function () {
    solarEnabled = true;
    htmlYes.classList.add("active");
    htmlNo.classList.remove("active");
    if (htmlFields) htmlFields.classList.remove("hidden");
  });
  htmlNo.addEventListener("click", function () {
    solarEnabled = false;
    htmlNo.classList.add("active");
    htmlYes.classList.remove("active");
    if (htmlFields) htmlFields.classList.add("hidden");
    if (htmlResult) htmlResult.classList.add("hidden");
    solarSystemSize = 0;
    solarMonthlyGen = 0;
    solarMonthlyExport = 0;
  });

  function updateStaticSolar() {
    if (!htmlSize || !htmlGen || !htmlExport) return;
    solarSystemSize = parseFloat(htmlSize.value) || 0;
    solarMonthlyGen = parseFloat(htmlGen.value) || 0;
    solarMonthlyExport = parseFloat(htmlExport.value) || 0;
    if (solarMonthlyGen > 0 && htmlResult && htmlSavingsKg && htmlTrees) {
      var ef = getStateEF();
      var monthlySavings = (solarMonthlyGen + solarMonthlyExport) * ef;
      var trees = Math.round(monthlySavings / 1.83);
      htmlSavingsKg.textContent = monthlySavings.toFixed(1);
      htmlTrees.textContent = trees;
      htmlResult.classList.remove("hidden");
    } else if (htmlResult) {
      htmlResult.classList.add("hidden");
    }
  }
  if (htmlSize) htmlSize.addEventListener("input", updateStaticSolar);
  if (htmlGen) htmlGen.addEventListener("input", updateStaticSolar);
  if (htmlExport) htmlExport.addEventListener("input", updateStaticSolar);
})();

// Calculate solar offset in tonnes/year (returns negative value = offset)
function calcSolarOffset() {
  if (!solarEnabled) return 0;
  var ef = getStateEF();
  // Solar generated offsets grid consumption
  // Exported units are additional negative emissions
  var monthlyOffsetKg = (solarMonthlyGen + solarMonthlyExport) * ef;
  return -(monthlyOffsetKg * 12) / 1000; // negative tonnes/year
}
// ============================================================
// Part 3: Flights, Results, Donut Chart, Badges, WhatsApp
// ============================================================
var AIRPORTS = [
  // Tier 1
  ["DEL", "Delhi (DEL)"], ["BOM", "Mumbai (BOM)"], ["BLR", "Bengaluru (BLR)"],
  ["MAA", "Chennai (MAA)"], ["CCU", "Kolkata (CCU)"], ["HYD", "Hyderabad (HYD)"],
  ["PNQ", "Pune (PNQ)"], ["AMD", "Ahmedabad (AMD)"], ["COK", "Kochi (COK)"],
  // Tier 2
  ["JAI", "Jaipur (JAI)"], ["LKO", "Lucknow (LKO)"], ["IXC", "Chandigarh (IXC)"],
  ["BHO", "Bhopal (BHO)"], ["NAG", "Nagpur (NAG)"], ["IDR", "Indore (IDR)"],
  ["STV", "Surat (STV)"], ["BDQ", "Vadodara (BDQ)"], ["CJB", "Coimbatore (CJB)"],
  ["TRV", "Thiruvananthapuram (TRV)"], ["VTZ", "Visakhapatnam (VTZ)"],
  ["BBI", "Bhubaneswar (BBI)"], ["PAT", "Patna (PAT)"], ["IXR", "Ranchi (IXR)"],
  ["GAU", "Guwahati (GAU)"], ["IXA", "Agartala (IXA)"],
  // Tier 3 (tourist/religious)
  ["GOI", "Goa (GOI)"], ["VNS", "Varanasi (VNS)"], ["ATQ", "Amritsar (ATQ)"],
  ["IXJ", "Jammu (IXJ)"], ["SXR", "Srinagar (SXR)"], ["IXL", "Leh (IXL)"],
  ["DED", "Dehradun (DED)"], ["IXB", "Bagdogra (IXB)"], ["IMF", "Imphal (IMF)"],
  ["DIB", "Dibrugarh (DIB)"], ["IXZ", "Port Blair (IXZ)"], ["AGR", "Agra (AGR)"],
  ["UDR", "Udaipur (UDR)"], ["JDH", "Jodhpur (JDH)"], ["IXU", "Aurangabad (IXU)"],
  // International
  ["DXB", "Dubai (DXB)"], ["LHR", "London (LHR)"], ["SIN", "Singapore (SIN)"],
  ["BKK", "Bangkok (BKK)"], ["JFK", "New York (JFK)"], ["CDG", "Paris (CDG)"],
  ["SYD", "Sydney (SYD)"], ["NRT", "Tokyo (NRT)"]
];
// Comprehensive route distances (km) — all keys sorted alphabetically
var ROUTE_KM = {
  // DEL hub
  "AMD-DEL": 776, "AGR-DEL": 200, "ATQ-DEL": 450, "BBI-DEL": 1600,
  "BHO-DEL": 680, "BLR-DEL": 1740, "BOM-DEL": 1148, "CCU-DEL": 1305,
  "CJB-DEL": 1960, "COK-DEL": 2048, "DED-DEL": 235, "DEL-DIB": 1900,
  "DEL-DXB": 2190, "DEL-GAU": 1800, "DEL-GOI": 1899, "DEL-HYD": 1253,
  "DEL-IDR": 780, "DEL-IMF": 2350, "DEL-IXA": 2100, "DEL-IXB": 1520,
  "DEL-IXC": 260, "DEL-IXJ": 590, "DEL-IXL": 600, "DEL-IXR": 1300,
  "DEL-IXU": 1200, "DEL-IXZ": 3100, "DEL-JAI": 268, "DEL-JDH": 570,
  "DEL-JFK": 11756, "DEL-LHR": 6715, "DEL-LKO": 510, "DEL-MAA": 1758,
  "DEL-NAG": 860, "DEL-NRT": 5839, "DEL-PAT": 930, "DEL-PNQ": 1177,
  "DEL-SIN": 5985, "DEL-STV": 950, "DEL-SXR": 670, "DEL-SYD": 10147,
  "DEL-TRV": 2230, "DEL-UDR": 640, "DEL-VNS": 760, "DEL-VTZ": 1620,
  "BDQ-DEL": 890,
  // BOM hub
  "AMD-BOM": 524, "BBI-BOM": 1400, "BHO-BOM": 590, "BLR-BOM": 984,
  "BOM-CCU": 1657, "BOM-CJB": 960, "BOM-COK": 1068, "BOM-DXB": 1926,
  "BOM-GAU": 2200, "BOM-GOI": 554, "BOM-HYD": 709, "BOM-IDR": 510,
  "BOM-IXU": 260, "BOM-JAI": 1020, "BOM-JDH": 850, "BOM-LHR": 7198,
  "BOM-LKO": 1150, "BOM-MAA": 1032, "BOM-NAG": 700, "BOM-PAT": 1520,
  "BOM-PNQ": 150, "BOM-SIN": 5036, "BOM-STV": 280, "BOM-TRV": 1220,
  "BOM-UDR": 680, "BOM-VNS": 1180, "BOM-VTZ": 1080, "BDQ-BOM": 400,
  // BLR hub
  "BBI-BLR": 1560, "BLR-CCU": 1871, "BLR-CJB": 360, "BLR-COK": 540,
  "BLR-GOI": 560, "BLR-HYD": 570, "BLR-MAA": 334, "BLR-NAG": 900,
  "BLR-PNQ": 840, "BLR-SIN": 3918, "BLR-TRV": 600, "BLR-VTZ": 800,
  "BLR-IXZ": 2200,
  // MAA hub
  "CCU-MAA": 1359, "CJB-MAA": 500, "COK-MAA": 600, "HYD-MAA": 625,
  "MAA-PNQ": 1060, "MAA-TRV": 700, "MAA-VTZ": 620, "MAA-BBI": 1100,
  "MAA-IXZ": 1370, "MAA-SIN": 3150,
  // CCU hub
  "BBI-CCU": 440, "CCU-GAU": 880, "CCU-HYD": 1480, "CCU-IXA": 1200,
  "CCU-IXB": 550, "CCU-IXR": 350, "CCU-PAT": 490, "CCU-VNS": 680,
  "CCU-IMF": 1580, "CCU-DIB": 1100, "CCU-IXZ": 1500,
  // HYD hub
  "HYD-NAG": 500, "HYD-PNQ": 560, "HYD-VTZ": 620, "HYD-GOI": 560,
  "HYD-BBI": 930, "HYD-CJB": 740, "HYD-COK": 900,
  // NE India
  "DIB-GAU": 420, "GAU-IMF": 530, "GAU-IXA": 480, "GAU-IXB": 580,
  // Rajasthan
  "JAI-JDH": 340, "JAI-UDR": 390, "JDH-UDR": 260,
  // Tier 2 interconnects
  "BHO-IDR": 190, "BHO-NAG": 290, "IDR-BOM": 510, "STV-BDQ": 150,
  "PAT-VNS": 270, "PAT-IXR": 300, "LKO-VNS": 290, "LKO-PAT": 540,
  "ATQ-IXC": 230, "ATQ-IXJ": 200, "IXC-DED": 170, "IXJ-SXR": 260,
  "SXR-IXL": 420, "DED-IXB": 1300,
  // Goa interconnects
  "COK-GOI": 600, "GOI-PNQ": 450,
  // International from BLR/MAA/CCU
  "BKK-BOM": 3694, "BKK-DEL": 4551, "BKK-BLR": 3150, "BKK-CCU": 2400,
  "BKK-MAA": 2700, "CDG-DEL": 6589, "CDG-BOM": 7000
};
// Pre-computed ROUTE_CO2 for popular routes (kg CO2, economy)
var ROUTE_CO2 = {
  "BOM-DEL": 293, "BLR-DEL": 443, "DEL-MAA": 448, "CCU-DEL": 333,
  "DEL-HYD": 319, "DEL-GOI": 484, "DEL-DXB": 557, "DEL-LHR": 1712,
  "DEL-SIN": 1526, "DEL-JFK": 2998, "BOM-LHR": 1835, "BOM-BLR": 251,
  "BLR-MAA": 85, "BOM-GOI": 141, "BOM-HYD": 181, "BLR-HYD": 145,
  "DEL-JAI": 68, "CCU-BBI": 112, "DEL-LKO": 130, "BOM-PNQ": 38,
  "BOM-COK": 272, "DEL-IXC": 66, "DEL-ATQ": 115, "DEL-SXR": 171,
  "DEL-VNS": 194, "CCU-GAU": 224
};
var KG_CO2_PER_KM = 0.255;
function getRouteKey(a, b) { return a < b ? a + "-" + b : b + "-" + a; }
function getRouteDistance(from, to) {
  if (from === to) return 0;
  return ROUTE_KM[getRouteKey(from, to)] || null;
}
function calcFlightCO2(from, to, cls, isReturn) {
  var key = getRouteKey(from, to);
  var baseCO2 = ROUTE_CO2[key];
  if (!baseCO2) {
    var dist = getRouteDistance(from, to) || 2500;
    baseCO2 = Math.round(dist * KG_CO2_PER_KM);
  }
  var multiplier = cls === "business" ? 2.5 : cls === "first" ? 4 : 1;
  var oneWay = Math.round(baseCO2 * multiplier);
  return isReturn ? oneWay * 2 : oneWay;
}
var AIRLINES = [
  "IndiGo", "Air India", "SpiceJet", "Vistara", "GoFirst",
  "AirAsia India", "Emirates", "Qatar Airways", "Singapore Airlines",
  "British Airways", "Lufthansa", "Other"
];
var flightFrom = document.getElementById("flight-from");
var flightTo = document.getElementById("flight-to");
var flightAirline = document.getElementById("flight-airline");
var flightClass = document.getElementById("flight-class");
var returnYes = document.getElementById("return-yes");
var returnNo = document.getElementById("return-no");
var addTripBtn = document.getElementById("add-trip-btn");
var tripListEl = document.getElementById("trip-list");
var flightTotalEl = document.getElementById("flight-total");
var flightTotalVal = document.getElementById("flight-total-val");
AIRPORTS.forEach(function (a) {
  var o1 = document.createElement("option");
  o1.value = a[0]; o1.textContent = a[1];
  flightFrom.appendChild(o1);
  var o2 = document.createElement("option");
  o2.value = a[0]; o2.textContent = a[1];
  flightTo.appendChild(o2);
});
AIRLINES.forEach(function (a) {
  var opt = document.createElement("option");
  opt.value = a; opt.textContent = a;
  flightAirline.appendChild(opt);
});
var isReturnTrip = true;
returnYes.addEventListener("click", function () {
  isReturnTrip = true;
  returnYes.classList.add("active");
  returnNo.classList.remove("active");
});
returnNo.addEventListener("click", function () {
  isReturnTrip = false;
  returnNo.classList.add("active");
  returnYes.classList.remove("active");
});
var trips = [];
function renderTrips() {
  tripListEl.innerHTML = "";
  var totalKg = 0;
  trips.forEach(function (t, i) {
    totalKg += t.co2;
    var card = document.createElement("div");
    card.className = "trip-card";
    var oneWayCO2 = t.isReturn ? Math.round(t.co2 / 2) : t.co2;
    var retLabel = t.isReturn ? " | Return" : " | One-way";
    var co2Label = t.isReturn
      ? oneWayCO2 + " kg each way | " + t.co2 + " kg total"
      : t.co2 + " kg CO2";
    card.innerHTML =
      '<div class="trip-info">' +
        '<div class="trip-route">' + t.from + " \u2192 " + t.to + "</div>" +
        '<div class="trip-details">' + t.airline + " | " + t.cls + retLabel + "</div>" +
      "</div>" +
      '<div class="trip-co2">' + co2Label + "</div>" +
      '<button type="button" class="trip-remove" data-idx="' + i + '">\u00D7</button>';
    tripListEl.appendChild(card);
  });
  if (trips.length > 0) {
    flightTotalVal.textContent = totalKg.toLocaleString();
    flightTotalEl.classList.remove("hidden");
  } else {
    flightTotalEl.classList.add("hidden");
  }
}
tripListEl.addEventListener("click", function (e) {
  var btn = e.target.closest(".trip-remove");
  if (!btn) return;
  trips.splice(parseInt(btn.getAttribute("data-idx"), 10), 1);
  renderTrips();
});
addTripBtn.addEventListener("click", function () {
  var from = flightFrom.value;
  var to = flightTo.value;
  var airline = flightAirline.value || "Other";
  var cls = flightClass.value;
  if (!from || !to || from === to) return;
  var co2 = calcFlightCO2(from, to, cls, isReturnTrip);
  trips.push({
    from: from, to: to, airline: airline,
    cls: cls.charAt(0).toUpperCase() + cls.slice(1),
    isReturn: isReturnTrip, co2: co2
  });
  renderTrips();
});
function calcFlightEmission() {
  var totalKg = 0;
  trips.forEach(function (t) { totalKg += t.co2; });
  return totalKg / 1000;
}
// ---------- BADGES ----------
var BADGES = [
  { max: 0.5, emoji: "\uD83C\uDF0D", title: "Earth Guardian" },
  { max: 1.9, emoji: "\uD83C\uDF33", title: "Green Champion" },
  { max: 4.0, emoji: "\uD83C\uDF31", title: "Climate Aware" },
  { max: 8.0, emoji: "\u26A1", title: "Needs Action" },
  { max: Infinity, emoji: "\uD83D\uDD25", title: "High Emitter" }
];
function getBadge(total) {
  for (var i = 0; i < BADGES.length; i++) {
    if (total <= BADGES[i].max) return BADGES[i];
  }
  return BADGES[BADGES.length - 1];
}
// ---------- CITY TRANSPORT ALTERNATIVES ----------
var CITY_ALTS = [
  { name: "Delhi Metro", co2PerKm: 0.03, costLabel: "\u20B940/day" },
  { name: "DTC Electric Bus", co2PerKm: 0.02, costLabel: "\u20B925/day" },
  { name: "Ola Electric Scooter", co2PerKm: 0.005, costLabel: null }
];
function getCityAlternatives() {
  if (!selectedVariant) return [];
  var fuel = selectedVariant[2];
  if (fuel === "walk" || fuel === "public" || fuel === "auto" || fuel === "erickshaw") return [];
  var dailyKm = parseInt(kmSlider.value, 10) || 0;
  var userTonnes = calcCommuteEmission();
  return CITY_ALTS.map(function (alt) {
    var altTonnes = (dailyKm * alt.co2PerKm * 365) / 1000;
    return { name: alt.name, saving: userTonnes - altTonnes, costLabel: alt.costLabel };
  }).filter(function (a) { return a.saving > 0.01; });
}
// ---------- CONDITIONAL SUGGESTIONS ----------
function getConditionalTips(transport, food, electricity, flights) {
  var tips = [];
  var dailyKm = parseInt(kmSlider.value, 10) || 0;
  var monthlyUnits = parseFloat(monthlyUnitsInput.value) || 0;
  var fuel = selectedVariant ? selectedVariant[2] : null;

  // Transport: petrol vehicle with >15 km daily
  if (fuel === "petrol" && dailyKm > 15) {
    var monthlyCommuteCO2 = Math.round((transport * 1000) / 12);
    tips.push("Switch to Metro or EV \u2014 your daily commute adds " + monthlyCommuteCO2 + " kg CO2/month.");
  } else if (transport > 0) {
    tips.push("Consider carpooling or public transport to cut your commute emissions by up to 75%.");
  }

  // Electricity: >500 kWh/month
  if (monthlyUnits > 500) {
    var acSavings = Math.round(monthlyUnits * 0.45 * getStateEF() * 0.15 * 12);
    tips.push("Your AC likely accounts for 40\u201350% of this. Set it to 24\u00B0C to cut ~" + acSavings + " kg CO2/year.");
  } else if (electricity > 0) {
    tips.push("Switch to LED lighting and 5-star rated appliances to cut electricity use by 20\u201330%.");
  }

  // Flights: >2 return trips
  var returnTrips = trips.filter(function (t) { return t.isReturn; }).length;
  var totalFlightKg = Math.round(flights * 1000);
  if (returnTrips > 2 || totalFlightKg > 1000) {
    tips.push("Consider carbon offsetting \u2014 your flights emit " + totalFlightKg + " kg CO2.");
  } else if (flights > 0) {
    tips.push("Fly economy class \u2014 business class has 2.5x the carbon footprint per seat.");
  }

  // Food: check if meat items are present daily
  var hasMeatDaily = false;
  var meatItems = ["Chicken Curry", "Butter Chicken", "Chicken Biryani", "Grilled Chicken",
    "Mutton Curry", "Mutton Biryani", "Fish Curry", "Prawns"];
  var slotIds = ["meal-breakfast", "meal-lunch", "meal-snack", "meal-dinner"];
  var meatCount = 0;
  slotIds.forEach(function (sid) {
    mealSlotItems[sid].forEach(function (item) {
      if (meatItems.indexOf(item.name) !== -1) meatCount++;
    });
  });
  if (meatCount >= 2) {
    hasMeatDaily = true;
    tips.push("Replacing one meat meal/day with dal saves ~0.3\u20130.6 kg CO2 daily (" + Math.round(meatCount * 0.4 * 365) + " kg/year).");
  } else if (food > 0 && tips.length < 4) {
    tips.push("Buy local and seasonal produce to cut emissions from food transport.");
  }

  return tips.slice(0, 4);
}
// ---------- DONUT CHART ----------
var DONUT_COLORS = ["#16a34a", "#f59e0b", "#3b82f6", "#8b5cf6", "#22c55e"];
function drawDonut(canvas, segments) {
  var ctx = canvas.getContext("2d");
  var cx = canvas.width / 2, cy = canvas.height / 2;
  var outerR = Math.min(cx, cy) - 4;
  var innerR = outerR * 0.55;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var total = 0;
  segments.forEach(function (s) { total += s.val; });
  if (total === 0) return;
  var startAngle = -Math.PI / 2;
  segments.forEach(function (s, i) {
    var sliceAngle = (s.val / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, startAngle, startAngle + sliceAngle);
    ctx.arc(cx, cy, innerR, startAngle + sliceAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = DONUT_COLORS[i % DONUT_COLORS.length];
    ctx.fill();
    startAngle += sliceAngle;
  });
  ctx.fillStyle = "#1f2937";
  ctx.font = "bold 1.1rem -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(total.toFixed(1) + "t", cx, cy);
}
// ---------- SCORECARD / SHARE CARD ----------
function updateShareCard(total, transport, food, electricity, flights, badgeTitle, solarOffset) {
  var shareTotal = document.getElementById("share-total");
  var shareBadge = document.getElementById("share-badge");
  var shareYou = document.getElementById("share-you");
  var shareBars = document.getElementById("share-bars");
  var shareBiggest = document.getElementById("share-biggest-source");
  var shareActionTip = document.getElementById("share-action-tip");
  if (!shareTotal) return;

  shareTotal.textContent = total.toFixed(1);
  if (shareBadge) shareBadge.textContent = badgeTitle;
  if (shareYou) shareYou.textContent = total.toFixed(1) + "t";

  // Build share bars
  var cats = [
    { label: "\uD83D\uDE97 Transport", val: transport, color: "#16a34a" },
    { label: "\uD83C\uDF7D\uFE0F Food", val: food, color: "#f59e0b" },
    { label: "\u26A1 Electricity", val: electricity, color: "#3b82f6" },
    { label: "\u2708\uFE0F Flights", val: flights, color: "#8b5cf6" }
  ];
  if (solarOffset < 0) {
    cats.push({ label: "\u2600\uFE0F Solar", val: solarOffset, color: "#22c55e" });
  }
  var grossTotal = transport + food + electricity + flights;
  if (shareBars) {
    shareBars.innerHTML = "";
    cats.forEach(function (c) {
      var pct = grossTotal > 0 ? Math.abs(c.val / grossTotal) * 100 : 0;
      var row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:12px;";
      row.innerHTML =
        '<span style="min-width:90px;opacity:0.7">' + c.label + '</span>' +
        '<div style="flex:1;background:rgba(255,255,255,0.1);border-radius:4px;height:8px">' +
          '<div style="height:100%;width:' + Math.min(pct, 100) + '%;background:' + c.color + ';border-radius:4px"></div>' +
        '</div>' +
        '<span style="min-width:40px;text-align:right;font-weight:600">' + (c.val < 0 ? c.val.toFixed(1) : c.val.toFixed(1)) + 't</span>';
      shareBars.appendChild(row);
    });
  }

  // Identify top emission source
  var sorted = cats.filter(function (c) { return c.val > 0; }).sort(function (a, b) { return b.val - a.val; });
  if (shareBiggest && sorted.length > 0) {
    var top = sorted[0];
    var topPct = grossTotal > 0 ? Math.round((top.val / grossTotal) * 100) : 0;
    shareBiggest.textContent = "Biggest source: " + top.label + " (" + topPct + "% of total)";
  }

  // Map top source to action tip
  if (shareActionTip && sorted.length > 0) {
    var tipMap = {
      "\uD83D\uDE97 Transport": "Try public transport or carpooling 2 days/week to cut commute emissions.",
      "\uD83C\uDF7D\uFE0F Food": "Swap one meat meal/day with dal or paneer to reduce food emissions.",
      "\u26A1 Electricity": "Set AC to 24\u00B0C and switch to LED bulbs to cut electricity CO2.",
      "\u2708\uFE0F Flights": "Take the train for trips under 500km to slash flight emissions."
    };
    shareActionTip.textContent = tipMap[sorted[0].label] || "Every small change counts!";
  }
}
// ---------- RESULTS DOM ----------
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
var donutCanvas = document.getElementById("donut-chart");
var breakdownLegend = document.getElementById("breakdown-legend");
var GLOBAL_AVG = 4.0;
var INDIA_AVG = 1.9;
var MAX_BAR = 10;

// ============================================================
// FORM SUBMIT — calculate and show results
// ============================================================
form.addEventListener("submit", function (e) {
  e.preventDefault();

  var vehicleEmission = calcCommuteEmission();
  var ptEmission = calcPublicTransportEmission();
  var transport = vehicleEmission + ptEmission;
  var food = calcMealEmission();
  var electricity = calcElecEmission();
  var flights = calcFlightEmission();
  var solarOffset = calcSolarOffset(); // negative value
  var total = Math.max(0, transport + food + electricity + flights + solarOffset);

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
  barYou.style.background = total <= INDIA_AVG ? "var(--green-400)"
    : total <= GLOBAL_AVG ? "var(--green-500)" : "#f59e0b";

  // Donut chart — positive segments only (solar shown separately)
  var segments = [
    { label: "\uD83D\uDE97 Transport", val: transport },
    { label: "\uD83C\uDF7D\uFE0F Food", val: food },
    { label: "\u26A1 Electricity", val: electricity },
    { label: "\u2708\uFE0F Flights", val: flights }
  ];
  drawDonut(donutCanvas, segments);

  // Legend — includes solar as a negative/green entry
  breakdownLegend.innerHTML = "";
  var grossTotal = transport + food + electricity + flights;
  segments.forEach(function (s, i) {
    var pct = grossTotal > 0 ? Math.round((s.val / grossTotal) * 100) : 0;
    var li = document.createElement("li");
    li.innerHTML =
      '<span class="legend-dot" style="background:' + DONUT_COLORS[i] + '"></span>' +
      '<span>' + s.label + '</span>' +
      '<span class="legend-val">' + s.val.toFixed(2) + 't</span>' +
      '<span class="legend-pct">' + pct + '%</span>';
    breakdownLegend.appendChild(li);
  });
  // Solar offset row (only if solar is active)
  if (solarOffset < 0) {
    var solarLi = document.createElement("li");
    solarLi.innerHTML =
      '<span class="legend-dot" style="background:' + DONUT_COLORS[4] + '"></span>' +
      '<span>\u2600\uFE0F Solar Saved</span>' +
      '<span class="legend-val" style="color:#16a34a">' + solarOffset.toFixed(2) + 't</span>' +
      '<span class="legend-pct" style="color:#16a34a">offset</span>';
    breakdownLegend.appendChild(solarLi);
  }

  // City alternatives
  var alternatives = getCityAlternatives();
  if (alternatives.length > 0) {
    altList.innerHTML = "";
    alternatives.forEach(function (alt) {
      var li = document.createElement("li");
      var costStr = alt.costLabel ? ' <span class="alt-cost">(' + alt.costLabel + ")</span>" : "";
      li.innerHTML =
        '<span class="alt-name">' + alt.name + "</span>: saves " +
        '<span class="alt-saving">' + alt.saving.toFixed(2) + " tonnes/year</span>" + costStr;
      altList.appendChild(li);
    });
    cityAltSection.classList.remove("hidden");
  } else {
    cityAltSection.classList.add("hidden");
  }

  // Conditional suggestions (using actual user data)
  var tips = getConditionalTips(transport, food, electricity, flights);
  suggestionsList.innerHTML = "";
  tips.forEach(function (tip, i) {
    var li = document.createElement("li");
    li.innerHTML = '<span class="suggestion-icon">' + (i + 1) + "</span><span>" + tip + "</span>";
    suggestionsList.appendChild(li);
  });

  // Percentile ranking
  var indiaBar = document.getElementById("percentile-india-bar");
  var indiaText = document.getElementById("percentile-india-text");
  var indiaMarker = document.getElementById("percentile-india-marker");
  var globalBar = document.getElementById("percentile-global-bar");
  var globalText = document.getElementById("percentile-global-text");
  var globalMarker = document.getElementById("percentile-global-marker");
  var percMax = 10;
  if (indiaBar && indiaText) {
    var youPctIndia = Math.min((total / percMax) * 100, 100);
    indiaBar.style.width = youPctIndia + "%";
    if (indiaMarker) indiaMarker.style.left = (INDIA_AVG / percMax * 100) + "%";
    var indiaDiff = ((total - INDIA_AVG) / INDIA_AVG * 100).toFixed(0);
    if (total <= INDIA_AVG) {
      indiaText.textContent = Math.abs(indiaDiff) + "% below avg";
      indiaText.style.color = "#16a34a";
    } else {
      indiaText.textContent = indiaDiff + "% above avg";
      indiaText.style.color = "#f59e0b";
    }
  }
  var GLOBAL_AVG_REAL = 4.7; // actual global avg for percentile (comparison bar uses 4.0)
  if (globalBar && globalText) {
    var youPctGlobal = Math.min((total / percMax) * 100, 100);
    globalBar.style.width = youPctGlobal + "%";
    if (globalMarker) globalMarker.style.left = (GLOBAL_AVG_REAL / percMax * 100) + "%";
    var globalDiff = ((total - GLOBAL_AVG_REAL) / GLOBAL_AVG_REAL * 100).toFixed(0);
    if (total <= GLOBAL_AVG) {
      globalText.textContent = Math.abs(globalDiff) + "% below avg";
      globalText.style.color = "#16a34a";
    } else {
      globalText.textContent = globalDiff + "% above avg";
      globalText.style.color = "#f59e0b";
    }
  }

  // WhatsApp
  var shareText =
    "I just calculated my carbon footprint on CarbonX and it's " +
    total.toFixed(1) + " tonnes/year! " + badge.emoji +
    " Calculate yours: sarthk.github.io/carbonX";
  whatsappBtn.href = "https://wa.me/?text=" + encodeURIComponent(shareText);

  // Update share card
  if (typeof updateShareCard === 'function') {
    updateShareCard(total, transport, food, electricity, flights, badge.title, solarOffset);
  }

  // Show results
  calculatorSection.style.display = "none";
  resultsSection.classList.remove("hidden");
  resultsSection.scrollIntoView({ behavior: "smooth" });
});

// ============================================================
// RECALCULATE — outside submit handler
// ============================================================
recalculateBtn.addEventListener("click", function () {
  resultsSection.classList.add("hidden");
  cityAltSection.classList.add("hidden");
  calculatorSection.style.display = "block";
  calculatorSection.scrollIntoView({ behavior: "smooth" });
});
