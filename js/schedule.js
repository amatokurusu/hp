import { loadCards } from "./render-cards.js";

function renderSchedule(item) {
  return `
    <a class="card schedule-card reveal${item.isLive ? " is-live" : ""}" href="${item.url}" target="_blank" rel="noopener noreferrer">
      <span class="date-badge">${item.isLive ? "LIVE" : item.date}</span>
      <span>
        <span class="title">${item.title}</span><br>
        <span class="meta">${item.date} ${item.time}</span>
      </span>
    </a>
  `;
}

export function initSchedule() {
  const container = document.getElementById("schedule-grid");
  if (!container) return Promise.resolve();
  return loadCards(
    "data/schedule.json",
    container,
    renderSchedule,
    "配信は不定期です。開始時間の目安は22:00〜。最新情報はSNSをご確認ください"
  );
}
