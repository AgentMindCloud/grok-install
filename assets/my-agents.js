// Private dashboard for installed agents. State lives in localStorage
// under `grok-install.my-agents`. Voice uses the Web Speech API where
// available and gracefully degrades to a friendly message otherwise.

const STORAGE_KEY = "grok-install.my-agents";

const LANG = "en-US";

const DEFAULT_AGENTS = [
  {
    id: "hermes-telegram-dashboard",
    name: "Hermes Telegram Dashboard",
    repo: "https://github.com/AgentMindCloud/hermes-telegram-dashboard",
    category: "telegram",
    status: "active",
    installedAt: null,
  },
  {
    id: "twitter-reply-bot",
    name: "Smart Twitter Reply Bot",
    repo: "https://github.com/AgentMindCloud/twitter-reply-bot",
    category: "x-native",
    status: "active",
    installedAt: null,
  },
  {
    id: "discord-ai-mod",
    name: "Discord AI Moderator",
    repo: "https://github.com/AgentMindCloud/discord-ai-mod",
    category: "discord",
    status: "paused",
    installedAt: null,
  },
];

const list = document.querySelector('[data-role="agent-list"]');
const emptyState = document.querySelector('[data-role="empty"]');
const counter = document.querySelector('[data-role="counter"]');
const addBtn = document.getElementById("add-agent");
const resetBtn = document.getElementById("reset-demo");
const voiceBtn = document.getElementById("voice-btn");
const voiceTranscript = document.querySelector(
  '[data-role="voice-transcript"]',
);
const voiceStatus = document.querySelector('[data-role="voice-status"]');
const dialog = document.getElementById("add-dialog");
const form = document.getElementById("add-form");

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...DEFAULT_AGENTS];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...DEFAULT_AGENTS];
  } catch {
    return [...DEFAULT_AGENTS];
  }
}

function save(agents) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
  } catch (err) {
    console.error("Could not persist agents:", err);
  }
}

let agents = load();

function slugify(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function statusChip(status) {
  const chip = document.createElement("span");
  const base = "text-xs px-3 py-1 rounded-3xl";
  if (status === "active") {
    chip.className = `${base} bg-emerald-400/10 text-emerald-400`;
    chip.textContent = "Active";
  } else if (status === "paused") {
    chip.className = `${base} bg-amber-400/10 text-amber-400`;
    chip.textContent = "Paused";
  } else {
    chip.className = `${base} bg-zinc-400/10 text-zinc-400`;
    chip.textContent = status || "Unknown";
  }
  return chip;
}

function iconButton(label, icon, variant = "ghost") {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.setAttribute("aria-label", label);
  btn.title = label;
  const classes = {
    primary:
      "px-3 py-2 rounded-3xl bg-[#00f0ff] text-black font-semibold text-sm",
    ghost:
      "px-3 py-2 rounded-3xl bg-white/5 hover:bg-white/10 text-sm text-zinc-200",
    danger:
      "px-3 py-2 rounded-3xl bg-rose-500/10 hover:bg-rose-500/20 text-sm text-rose-300",
  };
  btn.className = classes[variant];
  const i = document.createElement("i");
  i.className = icon;
  i.setAttribute("aria-hidden", "true");
  btn.appendChild(i);
  return btn;
}

function render() {
  list.innerHTML = "";
  counter.textContent = `${agents.length} agent${agents.length === 1 ? "" : "s"}`;
  emptyState.hidden = agents.length > 0;

  for (const agent of agents) {
    const card = document.createElement("article");
    card.className = "glass rounded-3xl p-6 flex flex-col gap-4";

    const header = document.createElement("div");
    header.className = "flex justify-between items-start gap-3";
    const titleBox = document.createElement("div");
    const title = document.createElement("h3");
    title.className = "font-semibold text-lg";
    title.textContent = agent.name;
    const meta = document.createElement("p");
    meta.className = "text-xs text-zinc-500 mt-1";
    meta.textContent = agent.category || "uncategorized";
    titleBox.append(title, meta);
    header.append(titleBox, statusChip(agent.status));
    card.appendChild(header);

    if (agent.repo) {
      const link = document.createElement("a");
      link.href = agent.repo;
      link.rel = "noopener";
      link.target = "_blank";
      link.className = "text-sm text-[#00f0ff] underline break-all";
      link.textContent = agent.repo;
      card.appendChild(link);
    }

    const actions = document.createElement("div");
    actions.className = "flex gap-2 mt-auto pt-2";

    const toggle = iconButton(
      agent.status === "active" ? "Pause agent" : "Resume agent",
      agent.status === "active" ? "fa-solid fa-pause" : "fa-solid fa-play",
    );
    toggle.addEventListener("click", () => {
      agent.status = agent.status === "active" ? "paused" : "active";
      save(agents);
      render();
    });

    const remove = iconButton("Remove agent", "fa-solid fa-trash", "danger");
    remove.addEventListener("click", () => {
      if (!confirm(`Remove ${agent.name}?`)) return;
      agents = agents.filter((a) => a.id !== agent.id);
      save(agents);
      render();
    });

    actions.append(toggle, remove);
    card.appendChild(actions);
    list.appendChild(card);
  }
}

addBtn?.addEventListener("click", () => {
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    // Fallback for browsers without <dialog>
    dialog.setAttribute("open", "");
  }
});

for (const btn of dialog?.querySelectorAll("[data-dialog-close]") ?? []) {
  btn.addEventListener("click", () => dialog.close());
}

form?.addEventListener("submit", (e) => {
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const repo = String(data.get("repo") || "").trim();
  const category = String(data.get("category") || "").trim();
  if (!name) {
    e.preventDefault();
    return;
  }
  const id = slugify(name) || `agent-${Date.now()}`;
  if (agents.some((a) => a.id === id)) {
    e.preventDefault();
    alert("An agent with a similar name already exists.");
    return;
  }
  agents.push({
    id,
    name,
    repo,
    category,
    status: "active",
    installedAt: new Date().toISOString(),
  });
  save(agents);
  form.reset();
  render();
});

resetBtn?.addEventListener("click", () => {
  if (!confirm("Reset to demo data? This clears everything you added.")) return;
  localStorage.removeItem(STORAGE_KEY);
  agents = load();
  render();
});

// --- Voice: Web Speech API with graceful degradation ---
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

function setVoiceStatus(text, tone = "idle") {
  voiceStatus.textContent = text;
  voiceStatus.className =
    "text-xs " +
    (tone === "error"
      ? "text-rose-400"
      : tone === "listening"
        ? "text-[#00f0ff]"
        : "text-zinc-500");
}

function handleCommand(transcript) {
  const cmd = transcript.toLowerCase();
  if (cmd.includes("show") && cmd.includes("agent")) {
    window.scrollTo({ top: list.offsetTop - 40, behavior: "smooth" });
    setVoiceStatus(`Heard: "${transcript}"`, "idle");
  } else if (cmd.includes("pause") || cmd.includes("stop all")) {
    agents = agents.map((a) => ({ ...a, status: "paused" }));
    save(agents);
    render();
    setVoiceStatus("Paused all agents.", "idle");
  } else if (cmd.includes("resume") || cmd.includes("start all")) {
    agents = agents.map((a) => ({ ...a, status: "active" }));
    save(agents);
    render();
    setVoiceStatus("Resumed all agents.", "idle");
  } else if (cmd.includes("add")) {
    addBtn.click();
    setVoiceStatus("Opened add dialog.", "idle");
  } else {
    setVoiceStatus(`Did not recognize: "${transcript}"`, "error");
  }
}

if (!SpeechRecognition) {
  voiceBtn.disabled = true;
  voiceBtn.title = "Voice input not supported in this browser";
  setVoiceStatus("Voice input not supported in this browser.", "error");
} else {
  const recog = new SpeechRecognition();
  recog.lang = LANG;
  recog.interimResults = false;
  recog.maxAlternatives = 1;

  let listening = false;

  voiceBtn.addEventListener("click", () => {
    if (listening) {
      recog.stop();
      return;
    }
    try {
      recog.start();
    } catch (err) {
      setVoiceStatus(err.message, "error");
    }
  });

  recog.addEventListener("start", () => {
    listening = true;
    voiceBtn.setAttribute("aria-pressed", "true");
    setVoiceStatus("Listening… try “show my agents”.", "listening");
  });
  recog.addEventListener("end", () => {
    listening = false;
    voiceBtn.setAttribute("aria-pressed", "false");
  });
  recog.addEventListener("error", (e) => {
    setVoiceStatus(`Voice error: ${e.error}`, "error");
  });
  recog.addEventListener("result", (event) => {
    const transcript = event.results[0][0].transcript;
    voiceTranscript.textContent = transcript;
    handleCommand(transcript);
  });
}

render();
