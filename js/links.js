import { loadCards } from "./render-cards.js";

function renderLink(item) {
  return `
    <a class="card link-card reveal" href="${item.url}" target="_blank" rel="noopener noreferrer">
      <svg class="icon" aria-hidden="true"><use href="assets/img/icons/sprite.svg?v=4#${item.iconId}"></use></svg>
      <span>
        <span class="label">${item.platform}</span>
        <span class="handle">${item.handle}</span>
      </span>
    </a>
  `;
}

export function initLinks() {
  const container = document.getElementById("links-grid");
  if (!container) return Promise.resolve();
  return loadCards("data/links.json", container, renderLink, "リンクは準備中です");
}
