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
    "Nexon EV": [
      ["Creative+ LR", "electric", "electric", 3.93, "km/kWh"],
      ["Fearless+ LR", "electric", "electric", 3.93, "km/kWh"],
      ["Empowered+ LR", "electric", "electric", 3.93, "km/kWh"]
    ],
    "Punch EV": [
      ["Adventure", "electric", "electric", 4.0, "km/kWh"],
      ["Accomplished", "electric", "electric", 4.0, "km/kWh"],
      ["Creative", "electric", "electric", 4.0, "km/kWh"]
    ],
    "Tiago EV": [
      ["XE MR", "electric", "electric", 4.5, "km/kWh"],
      ["XT LR", "electric", "electric", 4.5, "km/kWh"],
      ["XZ+ LR", "electric", "electric", 4.5, "km/kWh"]
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
    "XUV400 EV": [
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
    "EV6": [
      ["GT-Line", "electric", "electric", 4.8, "km/kWh"],
      ["GT-Line AWD", "electric", "electric", 4.3, "km/kWh"],
      ["GT AWD", "electric", "electric", 3.9, "km/kWh"]
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
    "ZS EV": [
      ["Excite", "electric", "electric", 5.0, "km/kWh"],
      ["Exclusive", "electric", "electric", 5.0, "km/kWh"],
      ["Exclusive Pro", "electric", "electric", 5.0, "km/kWh"]
    ],
    "Comet EV": [
      ["Lite", "electric", "electric", 6.5, "km/kWh"],
      ["Play", "electric", "electric", 6.5, "km/kWh"]
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
    "Splendor+": [
      ["Kick", "97.2cc", "petrol", 70.0, "kmpl"],
      ["Self", "97.2cc", "petrol", 70.0, "kmpl"],
      ["Black & Accent", "97.2cc", "petrol", 70.0, "kmpl"]
    ],
    "HF Deluxe": [
      ["Kick", "97.2cc", "petrol", 70.0, "kmpl"],
      ["Self", "97.2cc", "petrol", 70.0, "kmpl"],
      ["i3S", "97.2cc", "petrol", 70.0, "kmpl"]
    ],
    "Passion Pro": [
      ["Drum", "113.2cc", "petrol", 60.0, "kmpl"],
      ["Disc", "113.2cc", "petrol", 60.0, "kmpl"]
    ]
  },
  "Bajaj (2W)": {
    "Pulsar NS200": [
      ["Standard", "199.5cc", "petrol", 40.0, "kmpl"],
      ["ABS", "199.5cc", "petrol", 40.0, "kmpl"]
    ],
    "Pulsar 150": [
      ["Standard", "149.5cc", "petrol", 50.0, "kmpl"],
      ["Twin Disc", "149.5cc", "petrol", 50.0, "kmpl"]
    ],
    "CT100": [
      ["KS Alloy", "102cc", "petrol", 75.0, "kmpl"],
      ["ES Alloy", "102cc", "petrol", 75.0, "kmpl"]
    ]
  },
  "TVS (2W)": {
    "Apache RTR 160": [
      ["Drum", "159.7cc", "petrol", 48.0, "kmpl"],
      ["Disc", "159.7cc", "petrol", 48.0, "kmpl"],
      ["4V", "159.7cc", "petrol", 45.0, "kmpl"]
    ],
    "Jupiter": [
      ["Standard", "109.7cc", "petrol", 55.0, "kmpl"],
      ["ZX", "109.7cc", "petrol", 55.0, "kmpl"],
      ["Classic", "109.7cc", "petrol", 55.0, "kmpl"]
    ],
    "Ntorq": [
      ["Race XP", "124.8cc", "petrol", 45.0, "kmpl"],
      ["Super Squad", "124.8cc", "petrol", 45.0, "kmpl"]
    ]
  },
  "Ola Electric": {
    "S1 Pro": [
      ["S1 Pro", "electric", "electric", 9.0, "km/kWh"],
      ["S1 Pro+", "electric", "electric", 9.0, "km/kWh"]
    ],
    "S1 Air": [
      ["S1 Air", "electric", "electric", 10.0, "km/kWh"]
    ],
    "S1 X": [
      ["2 kWh", "electric", "electric", 10.5, "km/kWh"],
      ["3 kWh", "electric", "electric", 10.5, "km/kWh"]
    ]
  },
  "Ather Energy": {
    "450X": [
      ["450X", "electric", "electric", 9.5, "km/kWh"],
      ["450X Gen 3", "electric", "electric", 9.5, "km/kWh"]
    ],
    "450S": [
      ["450S", "electric", "electric", 10.0, "km/kWh"]
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
function calcCommuteEmission() {
  if (!selectedVariant) return 0;
  var fuel = selectedVariant[2];
  var dailyKm = parseInt(kmSlider.value, 10) || 0;
  if (fuel === "walk") return 0;
  if (fuel === "public") return (dailyKm * EF.public * 365) / 1000;
  if (fuel === "auto") return (dailyKm * EF.auto * 365) / 1000;
  if (fuel === "erickshaw") return (dailyKm * EF.erickshaw * 365) / 1000;
  if (fuel === "electric") {
    var kmPerKwh = getEffectiveMileage();
    if (!kmPerKwh || kmPerKwh === 0) return 0;
    return (dailyKm / kmPerKwh) * EF.electric * 365 / 1000;
  }
  var mileage = getEffectiveMileage();
  if (!mileage || mileage === 0) return 0;
  var factor = fuel === "cng" ? EF.cng : fuel === "diesel" ? EF.diesel : EF.petrol;
  return ((dailyKm / mileage) * factor * 365) / 1000;
}
// ============================================================
// Part 2: Meals & Electricity
// ============================================================
var MEAL_OPTIONS = [
  ["", "Select meal", 0],
  ["skip", "Skip this meal \u2014 0 kg CO2", 0],
  ["poha", "Poha / Upma / Idli (veg breakfast) \u2014 0.3 kg CO2", 0.3],
  ["paratha", "Paratha with butter \u2014 0.5 kg CO2", 0.5],
  ["eggs", "Eggs (2) \u2014 0.6 kg CO2", 0.6],
  ["bread-omelette", "Bread omelette \u2014 0.7 kg CO2", 0.7],
  ["dal-rice", "Dal tadka + rice \u2014 0.4 kg CO2", 0.4],
  ["rajma", "Rajma chawal \u2014 0.6 kg CO2", 0.6],
  ["paneer", "Paneer butter masala + roti \u2014 1.1 kg CO2", 1.1],
  ["chole", "Chole bhature \u2014 0.8 kg CO2", 0.8],
  ["chicken-curry", "Chicken curry + rice \u2014 2.8 kg CO2", 2.8],
  ["chicken-biryani", "Chicken biryani \u2014 3.5 kg CO2", 3.5],
  ["mutton", "Mutton curry + rice \u2014 5.0 kg CO2", 5.0],
  ["fish", "Fish curry + rice \u2014 1.8 kg CO2", 1.8],
  ["veg-thali", "Veg thali (full) \u2014 0.5 kg CO2", 0.5],
  ["nonveg-thali", "Non-veg thali (full) \u2014 2.5 kg CO2", 2.5],
  ["fastfood", "Fast food (burger/pizza) \u2014 2.0 kg CO2", 2.0]
];
var MEAL_CO2 = {};
MEAL_OPTIONS.forEach(function (m) { MEAL_CO2[m[0]] = m[2]; });
var mealSelects = document.querySelectorAll(".meal-select");
mealSelects.forEach(function (sel) {
  MEAL_OPTIONS.forEach(function (m) {
    var opt = document.createElement("option");
    opt.value = m[0];
    opt.textContent = m[1];
    if (m[0] === "") { opt.disabled = true; opt.selected = true; }
    sel.appendChild(opt);
  });
});
var mealDailyTotal = document.getElementById("meal-daily-total");
function updateMealTotal() {
  var total = 0;
  mealSelects.forEach(function (sel) {
    total += (MEAL_CO2[sel.value] || 0);
  });
  mealDailyTotal.textContent = total.toFixed(1);
  return total;
}
mealSelects.forEach(function (sel) {
  sel.addEventListener("change", updateMealTotal);
});
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
// Part 3: Flights, Results, Donut Chart, Badges, WhatsApp
// ============================================================
var AIRPORTS = [
  ["DEL", "Delhi (DEL)"], ["BOM", "Mumbai (BOM)"], ["BLR", "Bengaluru (BLR)"],
  ["MAA", "Chennai (MAA)"], ["CCU", "Kolkata (CCU)"], ["HYD", "Hyderabad (HYD)"],
  ["COK", "Kochi (COK)"], ["AMD", "Ahmedabad (AMD)"], ["GOI", "Goa (GOI)"],
  ["JAI", "Jaipur (JAI)"], ["LKO", "Lucknow (LKO)"], ["PNQ", "Pune (PNQ)"],
  ["DXB", "Dubai (DXB)"], ["LHR", "London (LHR)"], ["SIN", "Singapore (SIN)"],
  ["BKK", "Bangkok (BKK)"], ["JFK", "New York (JFK)"], ["CDG", "Paris (CDG)"],
  ["SYD", "Sydney (SYD)"], ["NRT", "Tokyo (NRT)"]
];
var ROUTE_KM = {
  "AMD-BOM": 524, "AMD-DEL": 776,
  "BLR-BOM": 984, "BLR-CCU": 1871, "BLR-DEL": 1740, "BLR-HYD": 570,
  "BLR-MAA": 334, "BLR-SIN": 3918,
  "BKK-BOM": 3694, "BKK-DEL": 4551,
  "BOM-CCU": 1657, "BOM-DEL": 1148, "BOM-DXB": 1926, "BOM-GOI": 554,
  "BOM-HYD": 709, "BOM-LHR": 7198, "BOM-MAA": 1032, "BOM-SIN": 5036,
  "CCU-DEL": 1305, "CCU-MAA": 1359,
  "CDG-DEL": 6589, "COK-BOM": 1068, "COK-DEL": 2048,
  "DEL-DXB": 2190, "DEL-GOI": 1899, "DEL-HYD": 1253, "DEL-JAI": 268,
  "DEL-JFK": 11756, "DEL-LHR": 6715, "DEL-LKO": 510, "DEL-MAA": 1758,
  "DEL-NRT": 5839, "DEL-PNQ": 1177, "DEL-SIN": 5985, "DEL-SYD": 10147,
  "HYD-MAA": 625
};
var ROUTE_CO2 = {
  "BOM-DEL": 293, "BLR-DEL": 443, "DEL-MAA": 448, "CCU-DEL": 333,
  "DEL-HYD": 319, "DEL-GOI": 484, "DEL-DXB": 557, "DEL-LHR": 1712,
  "DEL-SIN": 1526, "DEL-JFK": 2998, "BOM-LHR": 1835
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
// ---------- SUGGESTIONS ----------
var SUGGESTIONS = {
  transport: [
    "Switch to public transport or carpooling \u2014 it can cut your commute emissions by up to 75%.",
    "Consider an electric vehicle for your daily commute \u2014 EVs produce zero direct emissions.",
    "Work from home 1\u20132 days a week to reduce your commute footprint significantly."
  ],
  food: [
    "Try going meat-free 2\u20133 days a week \u2014 even small dietary shifts can save over 0.5 tonnes CO2 a year.",
    "Switching to more plant-based meals and reducing dairy can lower your food footprint significantly.",
    "Buy local and seasonal produce to cut emissions from food transport."
  ],
  electricity: [
    "Explore switching to a renewable energy provider \u2014 it's one of the highest-impact changes you can make at home.",
    "Switch to LED lighting and 5-star rated appliances to cut your electricity consumption by 20\u201330%.",
    "Consider rooftop solar \u2014 it can eliminate most of your home electricity emissions."
  ],
  flights: [
    "Reducing one long-haul flight a year saves roughly 1\u20132 tonnes CO2. Consider trains for shorter trips.",
    "Fly economy class \u2014 business class has 2.5x the carbon footprint per seat.",
    "Offset your flights through verified carbon offset programmes like Gold Standard."
  ]
};
function getTopSuggestions(categories) {
  var tips = [];
  for (var i = 0; i < categories.length && tips.length < 3; i++) {
    var pool = SUGGESTIONS[categories[i].name];
    if (pool && categories[i].val > 0) tips.push(pool[0]);
  }
  for (var j = 0; j < categories.length && tips.length < 3; j++) {
    var pool2 = SUGGESTIONS[categories[j].name];
    if (pool2 && pool2[1] && tips.indexOf(pool2[1]) === -1) tips.push(pool2[1]);
  }
  return tips.slice(0, 3);
}
// ---------- DONUT CHART ----------
var DONUT_COLORS = ["#16a34a", "#f59e0b", "#3b82f6", "#8b5cf6"];
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

  var transport = calcCommuteEmission();
  var food = calcMealEmission();
  var electricity = calcElecEmission();
  var flights = calcFlightEmission();
  var total = transport + food + electricity + flights;

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

  // Donut chart
  var segments = [
    { label: "\uD83D\uDE97 Transport", val: transport },
    { label: "\uD83C\uDF7D\uFE0F Food", val: food },
    { label: "\u26A1 Electricity", val: electricity },
    { label: "\u2708\uFE0F Flights", val: flights }
  ];
  drawDonut(donutCanvas, segments);

  // Legend
  breakdownLegend.innerHTML = "";
  segments.forEach(function (s, i) {
    var pct = total > 0 ? Math.round((s.val / total) * 100) : 0;
    var li = document.createElement("li");
    li.innerHTML =
      '<span class="legend-dot" style="background:' + DONUT_COLORS[i] + '"></span>' +
      '<span>' + s.label + '</span>' +
      '<span class="legend-val">' + s.val.toFixed(2) + 't</span>' +
      '<span class="legend-pct">' + pct + '%</span>';
    breakdownLegend.appendChild(li);
  });

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

  // Suggestions
  var sorted = [
    { name: "transport", val: transport },
    { name: "food", val: food },
    { name: "electricity", val: electricity },
    { name: "flights", val: flights }
  ].sort(function (a, b) { return b.val - a.val; });
  var tips = getTopSuggestions(sorted);
  suggestionsList.innerHTML = "";
  tips.forEach(function (tip, i) {
    var li = document.createElement("li");
    li.innerHTML = '<span class="suggestion-icon">' + (i + 1) + "</span><span>" + tip + "</span>";
    suggestionsList.appendChild(li);
  });

  // WhatsApp
  var shareText =
    "I just calculated my carbon footprint on CarbonX and it's " +
    total.toFixed(1) + " tonnes/year! " + badge.emoji +
    " Calculate yours: sarthk.github.io/carbonX";
  whatsappBtn.href = "https://wa.me/?text=" + encodeURIComponent(shareText);

  // Update share card
  if (typeof updateShareCard === 'function') {
    updateShareCard(total, transport, food, electricity, flights, badge.title);
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
