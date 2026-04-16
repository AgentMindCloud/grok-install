// Marketplace UI for index.html. Loads featured-agents.json and trending.json,
// renders cards, wires the search box, and builds the category chip list from
// whatever categories appear in the fixtures — no framework, just fetch + DOM.

const CATEGORY_EMOJI = {
  telegram: "📨",
  "x-native": "🐦",
  discord: "🛡️",
  orchestration: "🔗",
  twitter: "🐦",
  example: "✨",
};

const featuredRoot = document.querySelector('[data-role="featured"]');
const featuredError = document.querySelector('[data-role="featured-error"]');
const trendingRoot = document.querySelector('[data-role="trending"]');
const categoriesRoot = document.querySelector('[data-role="categories"]');
const searchInput = document.getElementById("marketplace-search");
const searchCount = document.querySelector('[data-role="search-count"]');

let allFeatured = [];

function emojiFor(category) {
  return CATEGORY_EMOJI[category] ?? "🤖";
}

function installCount(n) {
  return Intl.NumberFormat("en-US").format(n);
}

function renderFeatured(list) {
  if (!featuredRoot) return;
  featuredRoot.setAttribute("aria-busy", "false");
  featuredRoot.innerHTML = "";
  if (!list.length) {
    featuredRoot.innerHTML =
      '<p class="col-span-3 text-zinc-500 text-center py-8">No agents match your search.</p>';
    return;
  }
  for (const agent of list) {
    const card = document.createElement("a");
    card.href = agent.repo;
    card.className = "glass rounded-3xl p-6 card-hover block";
    card.rel = "noopener";
    card.innerHTML = `
      <div class="h-48 bg-zinc-800 rounded-2xl mb-4 flex items-center justify-center text-4xl"
           aria-hidden="true">${emojiFor(agent.category)}</div>
      <h4 class="font-semibold text-lg mb-2"></h4>
      <p class="text-zinc-400 text-sm mb-4"></p>
      <div class="flex items-center justify-between text-xs">
        <span class="text-emerald-400"></span>
        <span class="px-3 py-1 bg-[#00f0ff]/10 text-[#00f0ff] rounded-3xl">Verified by Grok</span>
      </div>
    `;
    card.querySelector("h4").textContent = agent.name;
    card.querySelector("p").textContent = agent.description;
    card.querySelector(".text-emerald-400").textContent =
      `${installCount(agent.installs)} installs`;
    featuredRoot.appendChild(card);
  }
}

function renderTrending(list) {
  if (!trendingRoot) return;
  trendingRoot.innerHTML = "";
  for (const item of list) {
    const row = document.createElement("div");
    row.className = "glass p-4 rounded-2xl flex justify-between items-center";
    const name = document.createElement("span");
    name.textContent = item.name;
    const delta = document.createElement("span");
    delta.className = "text-emerald-400";
    delta.textContent = `+${installCount(item.installs_this_week)} installs`;
    row.append(name, delta);
    trendingRoot.appendChild(row);
  }
}

function renderCategories(categories) {
  if (!categoriesRoot) return;
  categoriesRoot.innerHTML = "";
  for (const cat of categories) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.dataset.category = cat;
    chip.className =
      "glass px-5 py-2 rounded-3xl text-sm hover:border-[#00f0ff] cursor-pointer";
    chip.textContent = cat;
    chip.addEventListener("click", () => {
      if (!searchInput) return;
      searchInput.value = chip.dataset.category;
      applyFilter();
      searchInput.focus();
    });
    categoriesRoot.appendChild(chip);
  }
}

function matches(agent, q) {
  if (!q) return true;
  const needle = q.toLowerCase();
  const hay = [
    agent.name,
    agent.description,
    agent.category,
    ...(agent.tags ?? []),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(needle);
}

function applyFilter() {
  if (!searchInput) return;
  const q = searchInput.value.trim();
  const filtered = allFeatured.filter((a) => matches(a, q));
  renderFeatured(filtered);
  if (searchCount) {
    searchCount.textContent = q
      ? `${filtered.length} of ${allFeatured.length} agents match "${q}"`
      : "";
  }
}

async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.json();
}

async function init() {
  try {
    const [featured, trending] = await Promise.all([
      loadJSON("featured-agents.json"),
      loadJSON("trending.json"),
    ]);
    allFeatured = featured.featured ?? [];
    renderFeatured(allFeatured);
    renderTrending(trending.trending_this_week ?? []);
    const cats = Array.from(
      new Set(allFeatured.map((a) => a.category).filter(Boolean)),
    ).sort();
    renderCategories(cats);
  } catch (err) {
    if (featuredRoot) featuredRoot.setAttribute("aria-busy", "false");
    if (featuredError) {
      featuredError.textContent = `Could not load marketplace data: ${err.message}`;
      featuredError.classList.remove("hidden");
    }
    // eslint-disable-next-line no-console
    console.error(err);
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilter);
  }
}

init();
