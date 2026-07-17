/**
 * data/*.json を取得し、renderItem() が返すHTML文字列をコンテナに描画する共通ヘルパー。
 * schedule.js / links.js / goods.js から利用する。
 */
export async function loadCards(jsonPath, container, renderItem, emptyMessage = "情報がありません") {
  try {
    // data/*.json は運用者が頻繁に編集するため、常に最新を取得する（ブラウザキャッシュを使わない）
    const res = await fetch(jsonPath, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load ${jsonPath}: ${res.status}`);
    const items = await res.json();

    if (!Array.isArray(items) || items.length === 0) {
      container.innerHTML = `<p class="empty-state">${emptyMessage}</p>`;
      return;
    }

    container.innerHTML = items.map(renderItem).join("");
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="empty-state">読み込みに失敗しました</p>`;
  }
}
