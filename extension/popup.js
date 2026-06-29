/* Credit Elite Boost — popup logic */

const SITE = "https://cpncreditboost.com";

const balanceEl = document.getElementById("balance");
const limitEl = document.getElementById("limit");
const utilValue = document.getElementById("utilValue");
const utilBadge = document.getElementById("utilBadge");
const meterFill = document.getElementById("meterFill");
const advice = document.getElementById("advice");

const STORAGE_KEY = "ceb_calc";

/** Open a site path in a new tab (works in popup context). */
function openPath(path) {
  const url = SITE + path;
  if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.create) {
    chrome.tabs.create({ url });
  } else {
    window.open(url, "_blank", "noopener");
  }
}

document.querySelectorAll("[data-path]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    openPath(el.getAttribute("data-path"));
  });
});

function classify(util) {
  if (util <= 10) {
    return {
      cls: "good",
      label: "Excellent",
      tip: "Great work — under 10% utilization helps maximize your score.",
    };
  }
  if (util <= 30) {
    return {
      cls: "ok",
      label: "Good",
      tip: "Solid, but paying down to under 10% can give your score an extra lift.",
    };
  }
  if (util <= 50) {
    return {
      cls: "bad",
      label: "High",
      tip: "High utilization drags your score. Pay down balances or add available credit.",
    };
  }
  return {
    cls: "bad",
    label: "Very high",
    tip: "Very high utilization. Tradelines can add credit limit and lower this fast.",
  };
}

function recalc() {
  const balance = parseFloat(balanceEl.value);
  const limit = parseFloat(limitEl.value);

  if (!isFinite(balance) || !isFinite(limit) || limit <= 0) {
    utilValue.textContent = "—";
    utilBadge.textContent = "Enter your numbers";
    utilBadge.className = "badge";
    meterFill.style.width = "0%";
    advice.textContent = "";
    save();
    return;
  }

  const util = (balance / limit) * 100;
  const rounded = Math.round(util * 10) / 10;
  const { cls, label, tip } = classify(util);

  utilValue.textContent = rounded.toFixed(1) + "%";
  utilBadge.textContent = label;
  utilBadge.className = "badge " + cls;
  meterFill.style.width = Math.min(util, 100) + "%";
  meterFill.style.background =
    cls === "good"
      ? "var(--emerald)"
      : cls === "ok"
      ? "var(--warning)"
      : "var(--danger)";
  advice.textContent = tip;

  save();
}

function save() {
  const data = { balance: balanceEl.value, limit: limitEl.value };
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ [STORAGE_KEY]: data });
  }
}

function restore() {
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get([STORAGE_KEY], (res) => {
      const data = res[STORAGE_KEY];
      if (data) {
        balanceEl.value = data.balance || "";
        limitEl.value = data.limit || "";
        recalc();
      }
    });
  }
}

balanceEl.addEventListener("input", recalc);
limitEl.addEventListener("input", recalc);
restore();
