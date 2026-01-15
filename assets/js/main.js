/* eslint-env es6 */
const BASE_FIREFLY_COUNT = 0;

// Building base values
const BASE_JAR_COUNT = 0;
const BASE_JAR_PRICE = 20;
const BASE_JAR_REWARD = 1;

const BASE_NET_COUNT = 0;
const BASE_NET_PRICE = 1000;
const BASE_NET_REWARD = 10;

const BASE_HATCHERY_COUNT = 0;
const BASE_HATCHERY_PRICE = 25000;
const BASE_HATCHERY_REWARD = 100;

const BASE_MEADOW_COUNT = 0;
const BASE_MEADOW_PRICE = 500000;
const BASE_MEADOW_REWARD = 1000;

const BASE_LIGHTHOUSE_COUNT = 0;
const BASE_LIGHTHOUSE_PRICE = 10000000;
const BASE_LIGHTHOUSE_REWARD = 10000;

const BASE_GARDEN_COUNT = 0;
const BASE_GARDEN_PRICE = 250000000;
const BASE_GARDEN_REWARD = 100000;

const BASE_SANCTUARY_COUNT = 0;
const BASE_SANCTUARY_PRICE = 5000000000;
const BASE_SANCTUARY_REWARD = 1000000;

const BASE_LAB_COUNT = 0;
const BASE_LAB_PRICE = 100000000000;
const BASE_LAB_REWARD = 10000000;

const BASE_FOREST_COUNT = 0;
const BASE_FOREST_PRICE = 2000000000000;
const BASE_FOREST_REWARD = 100000000;

const BASE_POOL_COUNT = 0;
const BASE_POOL_PRICE = 50000000000000;
const BASE_POOL_REWARD = 1000000000;

const BASE_FESTIVAL_COUNT = 0;
const BASE_FESTIVAL_PRICE = 1000000000000000;
const BASE_FESTIVAL_REWARD = 10000000000;

// Visual upgrades (existing)
const BASE_GLOWWORMS_PRICE = 200000;
const BASE_ANGLERFISH_PRICE = 10000000;

// Building constants
const JAR = 1;
const NET = 2;
const HATCHERY = 3;
const MEADOW = 4;
const LIGHTHOUSE = 5;
const GARDEN = 6;
const SANCTUARY = 7;
const LAB = 8;
const FOREST = 9;
const POOL = 10;
const FESTIVAL = 11;
const GLOWWORMS = 100;
const ANGLERFISH = 101;

// Game state variables
var firefly_count = BASE_FIREFLY_COUNT;
var max_flies = 100000;
var click_power = 1;

// Building counts and prices
var jar_count = BASE_JAR_COUNT;
var jar_price = BASE_JAR_PRICE;
var net_count = BASE_NET_COUNT;
var net_price = BASE_NET_PRICE;
var hatchery_count = BASE_HATCHERY_COUNT;
var hatchery_price = BASE_HATCHERY_PRICE;
var meadow_count = BASE_MEADOW_COUNT;
var meadow_price = BASE_MEADOW_PRICE;
var lighthouse_count = BASE_LIGHTHOUSE_COUNT;
var lighthouse_price = BASE_LIGHTHOUSE_PRICE;
var garden_count = BASE_GARDEN_COUNT;
var garden_price = BASE_GARDEN_PRICE;
var sanctuary_count = BASE_SANCTUARY_COUNT;
var sanctuary_price = BASE_SANCTUARY_PRICE;
var lab_count = BASE_LAB_COUNT;
var lab_price = BASE_LAB_PRICE;
var forest_count = BASE_FOREST_COUNT;
var forest_price = BASE_FOREST_PRICE;
var pool_count = BASE_POOL_COUNT;
var pool_price = BASE_POOL_PRICE;
var festival_count = BASE_FESTIVAL_COUNT;
var festival_price = BASE_FESTIVAL_PRICE;

var hasGlowworms = 0;
var hasAnglerfish = 0;

// Upgrade tracking
var upgrades = {
    clickPower1: false,      // 2x click - costs 250
    clickPower2: false,      // 5x click
    clickPower3: false,      // 10x click
    jarBoost: false,         // Luciferin Infusion - 2x jar production
    netBoost: false,         // Gossamer Weave - 2x net production
    hatcheryBoost: false,    // Noctiluca Catalyst - 2x hatchery production
    meadowBoost: false,      // Crepuscular Timing - 2x meadow production
    lighthouseBoost: false,  // Pharos Lens - 2x lighthouse production
    gardenBoost: false,      // Foxfire Cultivation - 2x garden production
    sanctuaryBoost: false,   // Luciferase Formula - 2x sanctuary production
    labBoost: false,         // Photophore Enhancement - 2x lab production
    forestBoost: false,      // Sylvan Umbra - 2x forest production
    poolBoost: false,        // Biolume Resonance - 2x pool production
    festivalBoost: false,    // Celestial Convergence - 2x festival production
    autoClicker: false       // Auto-click once per second
};

var autoClickerInterval = null;

// Track which buildings/upgrades have been revealed to the user
var revealed = {
    jar: true,  // Always visible from start
    net: false,
    hatchery: false,
    meadow: false,
    lighthouse: false,
    garden: false,
    sanctuary: false,
    lab: false,
    forest: false,
    pool: false,
    festival: false,
    // Upgrades
    glowworms: false,
    anglerfish: false,
    clickPower1: false,
    clickPower2: false,
    clickPower3: false,
    jarBoost: false,
    netBoost: false,
    hatcheryBoost: false,
    meadowBoost: false,
    lighthouseBoost: false,
    gardenBoost: false,
    sanctuaryBoost: false,
    labBoost: false,
    forestBoost: false,
    poolBoost: false,
    festivalBoost: false,
    autoClicker: false
};

function calculate_reward(seconds) {
    let base_production = BASE_JAR_REWARD * jar_count * (upgrades.jarBoost ? 2 : 1)
                        + BASE_NET_REWARD * net_count * (upgrades.netBoost ? 2 : 1)
                        + BASE_HATCHERY_REWARD * hatchery_count * (upgrades.hatcheryBoost ? 2 : 1)
                        + BASE_MEADOW_REWARD * meadow_count * (upgrades.meadowBoost ? 2 : 1)
                        + BASE_LIGHTHOUSE_REWARD * lighthouse_count * (upgrades.lighthouseBoost ? 2 : 1)
                        + BASE_GARDEN_REWARD * garden_count * (upgrades.gardenBoost ? 2 : 1)
                        + BASE_SANCTUARY_REWARD * sanctuary_count * (upgrades.sanctuaryBoost ? 2 : 1)
                        + BASE_LAB_REWARD * lab_count * (upgrades.labBoost ? 2 : 1)
                        + BASE_FOREST_REWARD * forest_count * (upgrades.forestBoost ? 2 : 1)
                        + BASE_POOL_REWARD * pool_count * (upgrades.poolBoost ? 2 : 1)
                        + BASE_FESTIVAL_REWARD * festival_count * (upgrades.festivalBoost ? 2 : 1);
    
    let reward;
    
    // Apply visual upgrade multipliers
    if(hasAnglerfish == 1 && hasGlowworms == 1)
        reward = Math.pow(Math.pow(base_production, 1.2), 1.2) * seconds;
    else if(hasGlowworms == 1 || hasAnglerfish == 1) 
        reward = Math.pow(base_production, 1.2) * seconds;
    else
        reward = base_production * seconds;
    
    return reward;
}

function format_value(num) {
    num = Math.floor(num);

    if (num >= 1000 && num < 10000) {
        let numString = String(num);
        return numString.substring(0, 1) + "," + numString.substring(1);
    } else if (num >= 10000 && num < 100000) {
        let numString = String(num);
        return numString.substring(0, 2) + "," + numString.substring(2);
    } else if (num >= 100000 && num < 1000000) {
        return String(Math.floor(num / 1000)) + "K";
    } else if (num >= 1000000 && num < 1000000000) {
        return String(Math.floor(num / 100000) / 10) + "M";
    } else if (num >= 1000000000 && num < 1000000000000) {
        return String(Math.floor(num / 100000000) / 10) + "B";
    } else if (num >= 1000000000000) {
        return String(Math.floor(num / 100000000000) / 10) + "T";
    }
    else {
        return String(num);
    }
}

function save() {
    if (isNaN(firefly_count) || firefly_count == null) return;
    
    // Save basic game state
    localStorage.setItem("firefly_count", firefly_count);
    localStorage.setItem("click_power", click_power);
    
    // Save buildings
    localStorage.setItem("jar_count", jar_count);
    localStorage.setItem("jar_price", jar_price);
    localStorage.setItem("net_count", net_count);
    localStorage.setItem("net_price", net_price);
    localStorage.setItem("hatchery_count", hatchery_count);
    localStorage.setItem("hatchery_price", hatchery_price);
    localStorage.setItem("meadow_count", meadow_count);
    localStorage.setItem("meadow_price", meadow_price);
    localStorage.setItem("lighthouse_count", lighthouse_count);
    localStorage.setItem("lighthouse_price", lighthouse_price);
    localStorage.setItem("garden_count", garden_count);
    localStorage.setItem("garden_price", garden_price);
    localStorage.setItem("sanctuary_count", sanctuary_count);
    localStorage.setItem("sanctuary_price", sanctuary_price);
    localStorage.setItem("lab_count", lab_count);
    localStorage.setItem("lab_price", lab_price);
    localStorage.setItem("forest_count", forest_count);
    localStorage.setItem("forest_price", forest_price);
    localStorage.setItem("pool_count", pool_count);
    localStorage.setItem("pool_price", pool_price);
    localStorage.setItem("festival_count", festival_count);
    localStorage.setItem("festival_price", festival_price);
    
    // Save upgrade states
    localStorage.setItem("hasGlowworms", hasGlowworms);
    localStorage.setItem("hasAnglerfish", hasAnglerfish);
    localStorage.setItem("upgrades", JSON.stringify(upgrades));
    localStorage.setItem("revealed", JSON.stringify(revealed));
}

function load() {
    var temp;
    
    // Load basic state
    temp = parseInt(localStorage.getItem("firefly_count"));
    if (!isNaN(temp)) firefly_count = temp;
    
    temp = parseInt(localStorage.getItem("click_power"));
    if (!isNaN(temp)) click_power = temp;
    
    // Load buildings
    temp = parseInt(localStorage.getItem("jar_count"));
    if (!isNaN(temp)) jar_count = temp;
    temp = parseInt(localStorage.getItem("jar_price"));
    if (!isNaN(temp)) jar_price = temp;
    
    temp = parseInt(localStorage.getItem("net_count"));
    if (!isNaN(temp)) net_count = temp;
    temp = parseInt(localStorage.getItem("net_price"));
    if (!isNaN(temp)) net_price = temp;
    
    temp = parseInt(localStorage.getItem("hatchery_count"));
    if (!isNaN(temp)) hatchery_count = temp;
    temp = parseInt(localStorage.getItem("hatchery_price"));
    if (!isNaN(temp)) hatchery_price = temp;
    
    temp = parseInt(localStorage.getItem("meadow_count"));
    if (!isNaN(temp)) meadow_count = temp;
    temp = parseInt(localStorage.getItem("meadow_price"));
    if (!isNaN(temp)) meadow_price = temp;
    
    temp = parseInt(localStorage.getItem("lighthouse_count"));
    if (!isNaN(temp)) lighthouse_count = temp;
    temp = parseInt(localStorage.getItem("lighthouse_price"));
    if (!isNaN(temp)) lighthouse_price = temp;
    
    temp = parseInt(localStorage.getItem("garden_count"));
    if (!isNaN(temp)) garden_count = temp;
    temp = parseInt(localStorage.getItem("garden_price"));
    if (!isNaN(temp)) garden_price = temp;
    
    temp = parseInt(localStorage.getItem("sanctuary_count"));
    if (!isNaN(temp)) sanctuary_count = temp;
    temp = parseInt(localStorage.getItem("sanctuary_price"));
    if (!isNaN(temp)) sanctuary_price = temp;
    
    temp = parseInt(localStorage.getItem("lab_count"));
    if (!isNaN(temp)) lab_count = temp;
    temp = parseInt(localStorage.getItem("lab_price"));
    if (!isNaN(temp)) lab_price = temp;
    
    temp = parseInt(localStorage.getItem("forest_count"));
    if (!isNaN(temp)) forest_count = temp;
    temp = parseInt(localStorage.getItem("forest_price"));
    if (!isNaN(temp)) forest_price = temp;
    
    temp = parseInt(localStorage.getItem("pool_count"));
    if (!isNaN(temp)) pool_count = temp;
    temp = parseInt(localStorage.getItem("pool_price"));
    if (!isNaN(temp)) pool_price = temp;
    
    temp = parseInt(localStorage.getItem("festival_count"));
    if (!isNaN(temp)) festival_count = temp;
    temp = parseInt(localStorage.getItem("festival_price"));
    if (!isNaN(temp)) festival_price = temp;
    
    // Load visual upgrades
    temp = parseInt(localStorage.getItem("hasGlowworms"));
    if (!isNaN(temp) && temp == 1) hasGlowworms = 1;
    
    temp = parseInt(localStorage.getItem("hasAnglerfish"));
    if (!isNaN(temp) && temp == 1) hasAnglerfish = 1;
    
    // Load upgrades object
    var upgradesStr = localStorage.getItem("upgrades");
    if (upgradesStr) {
        try {
            var loadedUpgrades = JSON.parse(upgradesStr);
            Object.assign(upgrades, loadedUpgrades);
            
            // Restart auto-clicker if it was previously purchased
            if (upgrades.autoClicker && !autoClickerInterval) {
                autoClickerInterval = setInterval(() => add(), 1000);
            }
        } catch(e) {}
    }
    
    // Load revealed object
    var revealedStr = localStorage.getItem("revealed");
    if (revealedStr) {
        try {
            var loadedRevealed = JSON.parse(revealedStr);
            Object.assign(revealed, loadedRevealed);
        } catch(e) {}
    }
    
    update();
}

function check_revelations() {
    // Check buildings - reveal when player has >= 1/10th the price
    if (!revealed.net && firefly_count >= BASE_NET_PRICE / 10) revealed.net = true;
    if (!revealed.hatchery && firefly_count >= BASE_HATCHERY_PRICE / 10) revealed.hatchery = true;
    if (!revealed.meadow && firefly_count >= BASE_MEADOW_PRICE / 10) revealed.meadow = true;
    if (!revealed.lighthouse && firefly_count >= BASE_LIGHTHOUSE_PRICE / 10) revealed.lighthouse = true;
    if (!revealed.garden && firefly_count >= BASE_GARDEN_PRICE / 10) revealed.garden = true;
    if (!revealed.sanctuary && firefly_count >= BASE_SANCTUARY_PRICE / 10) revealed.sanctuary = true;
    if (!revealed.lab && firefly_count >= BASE_LAB_PRICE / 10) revealed.lab = true;
    if (!revealed.forest && firefly_count >= BASE_FOREST_PRICE / 10) revealed.forest = true;
    if (!revealed.pool && firefly_count >= BASE_POOL_PRICE / 10) revealed.pool = true;
    if (!revealed.festival && firefly_count >= BASE_FESTIVAL_PRICE / 10) revealed.festival = true;
    
    // Check upgrades
    if (!revealed.glowworms && firefly_count >= BASE_GLOWWORMS_PRICE / 10) revealed.glowworms = true;
    if (!revealed.anglerfish && firefly_count >= BASE_ANGLERFISH_PRICE / 10 && hasGlowworms == 1) revealed.anglerfish = true;
    
    if (!revealed.clickPower1 && firefly_count >= 25) revealed.clickPower1 = true;
    if (!revealed.clickPower2 && firefly_count >= 5000 && upgrades.clickPower1) revealed.clickPower2 = true;
    if (!revealed.clickPower3 && firefly_count >= 100000 && upgrades.clickPower2) revealed.clickPower3 = true;
    
    if (!revealed.jarBoost && firefly_count >= 1000 && jar_count >= 10) revealed.jarBoost = true;
    if (!revealed.netBoost && firefly_count >= 50000 && net_count >= 10) revealed.netBoost = true;
    if (!revealed.hatcheryBoost && firefly_count >= 1000000 && hatchery_count >= 10) revealed.hatcheryBoost = true;
    if (!revealed.meadowBoost && firefly_count >= 10000000 && meadow_count >= 10) revealed.meadowBoost = true;
    if (!revealed.lighthouseBoost && firefly_count >= 200000000 && lighthouse_count >= 10) revealed.lighthouseBoost = true;
    if (!revealed.gardenBoost && firefly_count >= 5000000000 && garden_count >= 10) revealed.gardenBoost = true;
    if (!revealed.sanctuaryBoost && firefly_count >= 100000000000 && sanctuary_count >= 10) revealed.sanctuaryBoost = true;
    if (!revealed.labBoost && firefly_count >= 2000000000000 && lab_count >= 10) revealed.labBoost = true;
    if (!revealed.forestBoost && firefly_count >= 50000000000000 && forest_count >= 10) revealed.forestBoost = true;
    if (!revealed.poolBoost && firefly_count >= 1000000000000000 && pool_count >= 10) revealed.poolBoost = true;
    if (!revealed.festivalBoost && firefly_count >= 20000000000000000 && festival_count >= 10) revealed.festivalBoost = true;
    
    if (!revealed.autoClicker && firefly_count >= 10000) revealed.autoClicker = true;
}

function update() {
    check_revelations();
    
    update_counter("firefly_counter", firefly_count);
    document.title = "Emberfly, Inc. : " + Math.floor(firefly_count) + " fireflies";
    
    update_building("jar", jar_count, jar_price);
    update_building("net", net_count, net_price);
    update_building("hatchery", hatchery_count, hatchery_price);
    update_building("meadow", meadow_count, meadow_price);
    update_building("lighthouse", lighthouse_count, lighthouse_price);
    update_building("garden", garden_count, garden_price);
    update_building("sanctuary", sanctuary_count, sanctuary_price);
    update_building("lab", lab_count, lab_price);
    update_building("forest", forest_count, forest_price);
    update_building("pool", pool_count, pool_price);
    update_building("festival", festival_count, festival_price);
    
    update_brightness();
    update_buildings();
    update_upgrades();
    save();
}

function update_counter(id, value) {
    var counter = document.getElementById(id);
    if (counter) {
        counter.value = format_value(value);
        update_width(counter);
    }
}

function update_building(name, count, price) {
    update_counter(name + "_counter", count);
    update_counter(name + "_price", price);
}

function update_upgrades() {
    // Visual upgrades (Glow Worms, Angler Fish)
    if (hasGlowworms == 0 && revealed.glowworms) {
        let temp = document.getElementsByName("glowworms")[0];
        let container = temp.parentElement;
        if (firefly_count >= BASE_GLOWWORMS_PRICE) {
            temp.disabled = false;
            temp.style.display = "inline-block";
            container.style.display = "block";
            temp.style.opacity = 1;
        } else {
            temp.style.opacity = 0.5;
            temp.disabled = true;
            temp.style.display = "inline-block";
            container.style.display = "block";
        }
        temp.style.pointerEvents = "auto";
        
        let temp2 = document.getElementsByName("anglerfish")[0];
        temp2.style.opacity = 0.5;
        temp2.disabled = true;
    } else if (hasGlowworms == 0) {
        let temp = document.getElementsByName("glowworms")[0];
        temp.style.display = "none";
        temp.parentElement.style.display = "none";
    } else {
        let temp = document.getElementsByName("glowworms")[0];
        temp.disabled = true;
        temp.style.display = "none";
        temp.parentElement.style.display = "none";
        temp.style.opacity = 0;
    }
    
    if (hasAnglerfish == 0 && revealed.anglerfish) {
        let temp = document.getElementsByName("anglerfish")[0];
        let container = temp.parentElement;
        if (firefly_count >= BASE_ANGLERFISH_PRICE && hasGlowworms == 1) {
            temp.disabled = false;
            temp.style.display = "inline-block";
            container.style.display = "block";
            temp.style.opacity = 1;
        } else {
            temp.style.opacity = 0.5;
            temp.disabled = true;
            temp.style.display = "inline-block";
            container.style.display = "block";
        }
        temp.style.pointerEvents = "auto";
    } else if (hasAnglerfish == 0) {
        let temp = document.getElementsByName("anglerfish")[0];
        temp.style.display = "none";
        temp.parentElement.style.display = "none";
    } else {
        let temp = document.getElementsByName("anglerfish")[0];
        temp.disabled = true;
        temp.style.display = "none";
        temp.parentElement.style.display = "none";
        temp.style.opacity = 0;
    }
    
    // Click power upgrades
    update_upgrade_button("clickPower1", 250, !upgrades.clickPower1);
    update_upgrade_button("clickPower2", 50000, !upgrades.clickPower2 && upgrades.clickPower1);
    update_upgrade_button("clickPower3", 1000000, !upgrades.clickPower3 && upgrades.clickPower2);
    
    // Building upgrades - unlock after 10 of each building
    update_upgrade_button("jarBoost", 10000, !upgrades.jarBoost && jar_count >= 10);
    update_upgrade_button("netBoost", 500000, !upgrades.netBoost && net_count >= 10);
    update_upgrade_button("hatcheryBoost", 10000000, !upgrades.hatcheryBoost && hatchery_count >= 10);
    update_upgrade_button("meadowBoost", 100000000, !upgrades.meadowBoost && meadow_count >= 10);
    update_upgrade_button("lighthouseBoost", 2000000000, !upgrades.lighthouseBoost && lighthouse_count >= 10);
    update_upgrade_button("gardenBoost", 50000000000, !upgrades.gardenBoost && garden_count >= 10);
    update_upgrade_button("sanctuaryBoost", 1000000000000, !upgrades.sanctuaryBoost && sanctuary_count >= 10);
    update_upgrade_button("labBoost", 20000000000000, !upgrades.labBoost && lab_count >= 10);
    update_upgrade_button("forestBoost", 500000000000000, !upgrades.forestBoost && forest_count >= 10);
    update_upgrade_button("poolBoost", 10000000000000000, !upgrades.poolBoost && pool_count >= 10);
    update_upgrade_button("festivalBoost", 200000000000000000, !upgrades.festivalBoost && festival_count >= 10);
    
    // Auto-clicker
    update_upgrade_button("autoClicker", 100000, !upgrades.autoClicker);
    
    // Show/hide the entire upgrades section
    check_upgrades_section_visibility();
}

function check_upgrades_section_visibility() {
    let section = document.getElementById("upgrades_section");
    if (!section) return;
    
    // Check if ANY upgrade should be visible (revealed AND unlockable)
    let hasVisibleUpgrade = false;
    
    // Check if ANY revealed upgrade is available
    if (revealed.glowworms && hasGlowworms == 0) hasVisibleUpgrade = true;
    if (revealed.anglerfish && hasAnglerfish == 0 && hasGlowworms == 1) hasVisibleUpgrade = true;
    if (revealed.clickPower1 && !upgrades.clickPower1) hasVisibleUpgrade = true;
    if (revealed.clickPower2 && !upgrades.clickPower2 && upgrades.clickPower1) hasVisibleUpgrade = true;
    if (revealed.clickPower3 && !upgrades.clickPower3 && upgrades.clickPower2) hasVisibleUpgrade = true;
    if (revealed.jarBoost && !upgrades.jarBoost && jar_count >= 10) hasVisibleUpgrade = true;
    if (revealed.netBoost && !upgrades.netBoost && net_count >= 10) hasVisibleUpgrade = true;
    if (revealed.hatcheryBoost && !upgrades.hatcheryBoost && hatchery_count >= 10) hasVisibleUpgrade = true;
    if (revealed.meadowBoost && !upgrades.meadowBoost && meadow_count >= 10) hasVisibleUpgrade = true;
    if (revealed.lighthouseBoost && !upgrades.lighthouseBoost && lighthouse_count >= 10) hasVisibleUpgrade = true;
    if (revealed.gardenBoost && !upgrades.gardenBoost && garden_count >= 10) hasVisibleUpgrade = true;
    if (revealed.sanctuaryBoost && !upgrades.sanctuaryBoost && sanctuary_count >= 10) hasVisibleUpgrade = true;
    if (revealed.labBoost && !upgrades.labBoost && lab_count >= 10) hasVisibleUpgrade = true;
    if (revealed.forestBoost && !upgrades.forestBoost && forest_count >= 10) hasVisibleUpgrade = true;
    if (revealed.poolBoost && !upgrades.poolBoost && pool_count >= 10) hasVisibleUpgrade = true;
    if (revealed.festivalBoost && !upgrades.festivalBoost && festival_count >= 10) hasVisibleUpgrade = true;
    if (revealed.autoClicker && !upgrades.autoClicker) hasVisibleUpgrade = true;
    
    section.style.display = hasVisibleUpgrade ? "block" : "none";
}

function update_upgrade_button(name, price, shouldShow) {
    let btn = document.getElementsByName(name)[0];
    if (!btn) return;
    
    // Check if this upgrade has been revealed
    let isRevealed = revealed[name];
    
    if (shouldShow && isRevealed) {
        btn.style.display = "inline-block";
        let container = btn.parentElement;
        if (container) container.style.display = "block";
        btn.disabled = firefly_count < price;
        btn.style.opacity = firefly_count < price ? 0.5 : 1;
        // Enable pointer events even when disabled so tooltips work
        btn.style.pointerEvents = "auto";
    } else {
        btn.style.display = "none";
        let container = btn.parentElement;
        if (container) container.style.display = "none";
    }
}

function update_buildings() {
    if (revealed.jar) update_building_button("Jar", jar_price);
    if (revealed.net) update_building_button("Net", net_price);
    if (revealed.hatchery) update_building_button("Hatchery", hatchery_price);
    if (revealed.meadow) update_building_button("Meadow", meadow_price);
    if (revealed.lighthouse) update_building_button("Lighthouse", lighthouse_price);
    if (revealed.garden) update_building_button("Garden", garden_price);
    if (revealed.sanctuary) update_building_button("Sanctuary", sanctuary_price);
    if (revealed.lab) update_building_button("Lab", lab_price);
    if (revealed.forest) update_building_button("Forest", forest_price);
    if (revealed.pool) update_building_button("Pool", pool_price);
    if (revealed.festival) update_building_button("Festival", festival_price);
}

function update_building_button(name, price) {
    let temp = document.getElementsByName(name)[0];
    if (temp) {
        let row = temp.closest('tr');
        if (row) {
            row.style.display = 'table-row';
        }
        temp.disabled = firefly_count < price;
    }
}

function add() {
    firefly_count += click_power;
    update();
}

function buy(category) {
    var buildings = [
        {id: JAR, count: () => jar_count, price: () => jar_price, 
         setCount: (v) => jar_count = v, setPrice: (v) => jar_price = v},
        {id: NET, count: () => net_count, price: () => net_price,
         setCount: (v) => net_count = v, setPrice: (v) => net_price = v},
        {id: HATCHERY, count: () => hatchery_count, price: () => hatchery_price,
         setCount: (v) => hatchery_count = v, setPrice: (v) => hatchery_price = v},
        {id: MEADOW, count: () => meadow_count, price: () => meadow_price,
         setCount: (v) => meadow_count = v, setPrice: (v) => meadow_price = v},
        {id: LIGHTHOUSE, count: () => lighthouse_count, price: () => lighthouse_price,
         setCount: (v) => lighthouse_count = v, setPrice: (v) => lighthouse_price = v},
        {id: GARDEN, count: () => garden_count, price: () => garden_price,
         setCount: (v) => garden_count = v, setPrice: (v) => garden_price = v},
        {id: SANCTUARY, count: () => sanctuary_count, price: () => sanctuary_price,
         setCount: (v) => sanctuary_count = v, setPrice: (v) => sanctuary_price = v},
        {id: LAB, count: () => lab_count, price: () => lab_price,
         setCount: (v) => lab_count = v, setPrice: (v) => lab_price = v},
        {id: FOREST, count: () => forest_count, price: () => forest_price,
         setCount: (v) => forest_count = v, setPrice: (v) => forest_price = v},
        {id: POOL, count: () => pool_count, price: () => pool_price,
         setCount: (v) => pool_count = v, setPrice: (v) => pool_price = v},
        {id: FESTIVAL, count: () => festival_count, price: () => festival_price,
         setCount: (v) => festival_count = v, setPrice: (v) => festival_price = v}
    ];
    
    for (let building of buildings) {
        if (category == building.id) {
            let price = building.price();
            if (firefly_count >= price) {
                firefly_count -= price;
                building.setCount(building.count() + 1);
                building.setPrice(Math.round(Math.pow(price, 1.01)));
                update();
            }
            return;
        }
    }
    
    // Visual upgrades
    if (category == GLOWWORMS && firefly_count >= BASE_GLOWWORMS_PRICE) {
        firefly_count -= BASE_GLOWWORMS_PRICE;
        hasGlowworms = 1;
        max_flies = 10000000;
        document.getElementById("fireflies_text").innerHTML = "Glow Worms";
        document.getElementById("tooltip").innerHTML = "Glowing worms writhe in the earth";
        set_click_image("glowworm");
        update();
    }
    
    if (category == ANGLERFISH && firefly_count >= BASE_ANGLERFISH_PRICE) {
        firefly_count -= BASE_ANGLERFISH_PRICE;
        hasAnglerfish = 1;
        max_flies = 100000000;
        document.getElementById("fireflies_text").innerHTML = "Angler Fish";
        document.getElementById("tooltip").innerHTML = "The seas teem with glowing fish";
        set_click_image("anglerfish");
        update();
    }
}

function buy_upgrade(upgrade_name, price) {
    if (firefly_count >= price) {
        firefly_count -= price;
        upgrades[upgrade_name] = true;
        
        // Apply upgrade effects
        if (upgrade_name == "clickPower1") click_power = 2;
        if (upgrade_name == "clickPower2") click_power = 5;
        if (upgrade_name == "clickPower3") click_power = 10;
        if (upgrade_name == "autoClicker" && !autoClickerInterval) {
            autoClickerInterval = setInterval(() => add(), 1000);
        }
        
        update();
    }
}

function update_width(thing) {
    thing.style.width = thing.value.length + 1 + "ch";
}

function calculate_brightness() {
    let percent = firefly_count / max_flies;
    
    if (percent < 0.3) {
        percent = percent * 2;
        if(percent > 0.3) percent = 0.3;
    } else if (percent < 0.5) {
        percent = percent * 1.5;
        if(percent > 0.5) percent = 0.5;
    } else if (percent > 1) {
        percent = 1;
    }
    
    return percent;
}

function update_brightness() {
    var percent = calculate_brightness();
    var temp = document.getElementById("background_gradient");
    var main = document.getElementById("main");
    
    if (hasAnglerfish == 1) {
        temp.style.backgroundImage = "radial-gradient(rgba(255, 100, 255, 1), rgba(255, 0, 0, 0.5))";
        temp.style.opacity = percent/2;
        main.style.background = "rgba(0,0,255," + percent/5 + ")";
        main.style.boxShadow = "0px -10px 50px 50px inset rgba(0, 200, 255," + percent / 3 + ")";
    } else if (hasGlowworms == 1) {
        temp.style.backgroundImage = "radial-gradient(rgba(100, 200, 0, " + percent/1.3 + "), rgba(0, 0, 255, 0.05))";
        temp.style.opacity = percent;
        main.style.background = "rgba(0,150,0," + percent / 5 + ")";
        main.style.boxShadow = "0px -10px 50px 50px inset rgba(220, 255, 0," + percent / 3 + ")";
    } else {
        temp.style.backgroundImage = "radial-gradient(rgba(200, 100, 0, " + percent.toString() + "), rgba(0, 0, 0, 0.1))";
        temp.style.opacity = percent;
        main.style.background = "rgba(150,102,10," + percent / 5 + ")";
        main.style.boxShadow = "0px -10px 50px 50px inset rgba(250, 200, 50," + percent / 3 + ")";
    }
    
    update_font_colors(percent);
}

function update_font_colors(percent) {
    function max255(num) {
        return num > 255 ? 255 : Math.floor(num);
    }
    
    function change_firefly_font(rgb1, rgb2) {
        let font = document.getElementsByClassName("fireflies");
        for (let i = 0; i < font.length; i++) {
            let gradient = "linear-gradient(top, rgb(" + max255(rgb1[0]) + "," + max255(rgb1[1]) + "," + max255(rgb1[2]) + "), rgb(" + max255(rgb2[0]) + "," + max255(rgb2[1]) + "," + max255(rgb2[2]) + "))";
            font[i].style.background = gradient;
            font[i].style.webkitBackgroundClip = "text";
            font[i].style.backgroundClip = "text";
        }
    }
    
    if (hasAnglerfish == 1) {
        let rgb1 = [255 * percent + 50, 255 * percent + 50, 255 * percent + 255];
        let rgb2 = [255 * percent + 100, 255 * percent + 0, 255 * percent + 100];
        change_firefly_font(rgb1, rgb2);
    } else if (hasGlowworms == 1) {
        let rgb1 = [255 * percent + 200, 255 * percent + 255, 255 * percent + 20];
        let rgb2 = [255 * percent + 70, 255 * percent + 105, 255 * percent + 0];
        change_firefly_font(rgb1, rgb2);
    } else {
        let rgb1 = [255 * percent + 235, 255 * percent + 173, 255 * percent + 0];
        let rgb2 = [255 * percent + 183, 255 * percent + 24, 255 * percent + 0];
        change_firefly_font(rgb1, rgb2);
    }
    
    let buildingColor, counterColor, titleColor;
    
    if (hasAnglerfish == 1) {
        buildingColor = "rgb(" + max255(255 * percent + 255) + "," + max255(255 * percent + 160) + ",0)";
        counterColor = "rgb(" + max255(255 * percent + 255) + "," + max255(255 * percent + 232) + "," + max255(255 * percent + 56) + ")";
        titleColor = "rgb(" + max255(255 * percent + 224) + "," + max255(255 * percent + 238) + "," + max255(255 * percent + 199) + ")";
    } else if (hasGlowworms == 1) {
        buildingColor = "rgb(" + max255(255 * percent + 80) + "," + max255(255 * percent + 185) + "," + max255(255 * percent + 30) + ")";
        counterColor = "rgb(" + max255(255 * percent + 175) + "," + max255(255 * percent + 255) + ",0)";
        titleColor = "rgb(" + max255(255 * percent + 225) + "," + max255(255 * percent + 255) + "," + max255(255 * percent + 200) + ")";
    } else {
        buildingColor = "rgb(" + max255(255 * percent + 255) + "," + max255(255 * percent + 160) + ",0)";
        counterColor = "rgb(" + max255(255 * percent + 255) + "," + max255(255 * percent + 232) + "," + max255(255 * percent + 56) + ")";
        titleColor = "rgb(" + max255(255 * percent + 224) + "," + max255(255 * percent + 238) + "," + max255(255 * percent + 199) + ")";
    }
    
    let fonts = [
        {className: "building", color: buildingColor},
        {className: "counter", color: counterColor},
        {className: "price", color: counterColor},
        {className: "title", color: titleColor}
    ];
    
    fonts.forEach(({className, color}) => {
        let elements = document.getElementsByClassName(className);
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.color = color;
        }
    });
}

function reset() {
    var answer = confirm("Are you sure you want to reset? Your progress will be deleted.");
    if (answer == true) {
        // Clear all localStorage
        localStorage.clear();
        
        // Reset all game variables to base values
        firefly_count = BASE_FIREFLY_COUNT;
        click_power = 1;
        max_flies = 100000;
        
        jar_count = BASE_JAR_COUNT;
        jar_price = BASE_JAR_PRICE;
        net_count = BASE_NET_COUNT;
        net_price = BASE_NET_PRICE;
        hatchery_count = BASE_HATCHERY_COUNT;
        hatchery_price = BASE_HATCHERY_PRICE;
        meadow_count = BASE_MEADOW_COUNT;
        meadow_price = BASE_MEADOW_PRICE;
        lighthouse_count = BASE_LIGHTHOUSE_COUNT;
        lighthouse_price = BASE_LIGHTHOUSE_PRICE;
        garden_count = BASE_GARDEN_COUNT;
        garden_price = BASE_GARDEN_PRICE;
        sanctuary_count = BASE_SANCTUARY_COUNT;
        sanctuary_price = BASE_SANCTUARY_PRICE;
        lab_count = BASE_LAB_COUNT;
        lab_price = BASE_LAB_PRICE;
        forest_count = BASE_FOREST_COUNT;
        forest_price = BASE_FOREST_PRICE;
        pool_count = BASE_POOL_COUNT;
        pool_price = BASE_POOL_PRICE;
        festival_count = BASE_FESTIVAL_COUNT;
        festival_price = BASE_FESTIVAL_PRICE;
        
        hasGlowworms = 0;
        hasAnglerfish = 0;
        
        // Reset all upgrades
        for (let key in upgrades) {
            upgrades[key] = false;
        }
        
        // Reset revealed state
        revealed = {
            jar: true,
            net: false,
            hatchery: false,
            meadow: false,
            lighthouse: false,
            garden: false,
            sanctuary: false,
            lab: false,
            forest: false,
            pool: false,
            festival: false,
            glowworms: false,
            anglerfish: false,
            clickPower1: false,
            clickPower2: false,
            clickPower3: false,
            jarBoost: false,
            netBoost: false,
            hatcheryBoost: false,
            meadowBoost: false,
            lighthouseBoost: false,
            gardenBoost: false,
            sanctuaryBoost: false,
            labBoost: false,
            forestBoost: false,
            poolBoost: false,
            festivalBoost: false,
            autoClicker: false
        };
        
        // Clear auto-clicker interval if it exists
        if (autoClickerInterval) {
            clearInterval(autoClickerInterval);
            autoClickerInterval = null;
        }
        
        // Reset image and text
        set_click_image("emberfly");
        document.getElementById("fireflies_text").innerHTML = "Fireflies";
        document.getElementById("tooltip").innerHTML = "The world is dark";
        
        // Reload page to ensure clean state
        location.reload();
    }
}

function reset_upgrades() {
    hasGlowworms = 0;
    hasAnglerfish = 0;
    set_click_image("emberfly");
    document.getElementById("fireflies_text").innerHTML = "Fireflies";
    document.getElementById("tooltip").innerHTML = "Fireflies flutter in our midst";
    update();
}

function timer() {
    firefly_count = firefly_count + calculate_reward(0.25);
    update();
}
setInterval(timer, 250);

function set_tooltip(tip) {
    var temp = document.getElementById("tooltip");
    var tooltips = {
        "JAR": "Jars catch " + format_value(BASE_JAR_REWARD * (upgrades.jarBoost ? 2 : 1)) + " per second",
        "NET": "Nets catch " + format_value(BASE_NET_REWARD * (upgrades.netBoost ? 2 : 1)) + " per second",
        "HATCHERY": "Hatcheries incubate " + format_value(BASE_HATCHERY_REWARD * (upgrades.hatcheryBoost ? 2 : 1)) + " per second",
        "MEADOW": "Meadows attract " + format_value(BASE_MEADOW_REWARD * (upgrades.meadowBoost ? 2 : 1)) + " per second",
        "LIGHTHOUSE": "Lighthouses attract " + format_value(BASE_LIGHTHOUSE_REWARD * (upgrades.lighthouseBoost ? 2 : 1)) + " per second",
        "GARDEN": "Gardens cultivate " + format_value(BASE_GARDEN_REWARD * (upgrades.gardenBoost ? 2 : 1)) + " per second",
        "SANCTUARY": "Sanctuaries protect " + format_value(BASE_SANCTUARY_REWARD * (upgrades.sanctuaryBoost ? 2 : 1)) + " per second",
        "LAB": "Labs research " + format_value(BASE_LAB_REWARD * (upgrades.labBoost ? 2 : 1)) + " per second",
        "FOREST": "Forests multiply " + format_value(BASE_FOREST_REWARD * (upgrades.forestBoost ? 2 : 1)) + " per second",
        "POOL": "Pools glow with " + format_value(BASE_POOL_REWARD * (upgrades.poolBoost ? 2 : 1)) + " per second",
        "FESTIVAL": "Festivals swarm " + format_value(BASE_FESTIVAL_REWARD * (upgrades.festivalBoost ? 2 : 1)) + " per second",
        "GLOWWORMS": "Worms.. that glow - multiplies all production",
        "ANGLERFISH": "Deep sea light - further multiplies all production",
        "CLICK1": "Catch 2 fireflies with each click",
        "CLICK2": "Catch 5 fireflies with each click",
        "CLICK3": "Catch 10 fireflies with each click",
        "LUCIFERIN": "The light-producing molecule in fireflies - doubles jar production",
        "GOSSAMER": "Delicate shimmering threads - doubles net production",
        "NOCTILUCA": "Night lights - bioluminescent organisms - doubles hatchery production",
        "CREPUSCULAR": "Twilight hours when fireflies are most active - doubles meadow production",
        "PHAROS": "Named for the legendary Lighthouse of Alexandria - doubles lighthouse production",
        "FOXFIRE": "The eerie bioluminescent glow of fungi on rotting wood - doubles garden production",
        "LUCIFERASE": "The enzyme that catalyzes the light-producing reaction - doubles sanctuary production",
        "PHOTOPHORE": "Specialized light-producing organs in bioluminescent creatures - doubles lab production",
        "SYLVAN": "The darkest shadows of mystical forests where light creatures gather - doubles forest production",
        "BIOLUME": "Ancient water reservoirs teeming with glowing organisms - doubles pool production",
        "CELESTIAL": "Where earth's light meets the stars - a convergence of bioluminescent forces - doubles festival production",
        "AUTOCLICKER": "Automatically catches 1 firefly per second",
        "TOTAL_FPS": "Buildings produce " + format_value(calculate_reward(1)) + " per second",
        "BLANK": "&nbsp;",
        "BUILDING": "You have " + (jar_count + net_count + hatchery_count + meadow_count + lighthouse_count + garden_count + sanctuary_count + lab_count + forest_count + pool_count + festival_count) + " buildings",
        "COUNT": "Total production is " + format_value(calculate_reward(1)) + " per second",
        "PRICE": " ",
        "CLICKING": "You catch " + format_value(click_power) + " per click"
    };
    
    temp.innerHTML = tooltips[tip] || "&nbsp;";
}

function set_click_image(img) {
    let images = ["emberfly", "glowworm", "anglerfish"];
    images.forEach(elem => {
        let temp = document.getElementById(elem);
        if (temp) {
            temp.style.display = img == elem ? "inline-block" : "none";
        }
    });
}

if ('addEventListener' in window) {
    window.addEventListener('load', load);
}
