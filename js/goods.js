import { loadDriveGoods } from "./drive-gallery.js";

const TAG_LABELS = {
  official: "公式グッズ",
  illustration: "イラスト",
  fanart: "ファンアート",
};

const CATEGORY_PAGES = {
  official: "goods.html",
  illustration: "illustration.html",
  fanart: "fanart.html",
};

const CATEGORY_TITLES = {
  official: "グッズ",
  illustration: "イラスト",
  fanart: "ファンアート",
};

// トップページのカテゴリー代表画像を、一覧ページとは別の専用画像に固定したい場合はここに指定する
const CATEGORY_PREVIEW_IMAGE_OVERRIDES = {
  official: "assets/img/goods/line-sticker-0.png",
  // Googleドライブのイラストフォルダ内「APEXサムネ3」(ファイルID固定のサムネイルURL。thumbnailLinkの署名付きURLは
  // 取得のたびに変わるため使わない)
  illustration: "https://drive.google.com/thumbnail?id=1hxCNDkStykC51Mk1LCDNx49jw9WnpwGY&sz=w800",
};

function renderGoods(item, isNew = false) {
  const tagLabel = TAG_LABELS[item.tag] ?? item.tag;
  const inner = `
    ${isNew ? '<span class="new-badge">NEW</span>' : ""}
    <img src="${item.image}" alt="${item.title}" loading="lazy">
    <div class="goods-info">
      <span class="tag ${item.tag}">${tagLabel}</span>
      <p class="title">${item.title}</p>
      <p class="credit">${item.credit}</p>
    </div>
  `;

  if (item.link) {
    return `<a class="card goods-card reveal" href="${item.link}" target="_blank" rel="noopener noreferrer">${inner}</a>`;
  }
  return `<div class="card goods-card reveal">${inner}</div>`;
}

// 公式グッズ(JSON手動管理) + Googleドライブの2フォルダ(イラスト/ファンアート)をまとめて取得
export async function fetchAllGoods() {
  const [officialItems, driveItems] = await Promise.all([
    fetch("data/goods.json", { cache: "no-store" }).then((res) => res.json()),
    loadDriveGoods(),
  ]);
  return [...officialItems, ...driveItems];
}

// トップページ用: カテゴリーごとの代表画像を、それぞれ独立したセクションのコンテナに1枚ずつ表示する
// containerMap = { official: "goods-preview", illustration: "illustration-preview", fanart: "fanart-preview" }
export async function initGoodsCategoryPreview(containerMap) {
  const targets = Object.entries(containerMap)
    .map(([tag, id]) => [tag, document.getElementById(id)])
    .filter(([, el]) => el);

  if (targets.length === 0) return;

  try {
    const items = await fetchAllGoods();

    targets.forEach(([tag, container]) => {
      const item = items.find((i) => i.tag === tag);
      const image =
        CATEGORY_PREVIEW_IMAGE_OVERRIDES[tag] ?? (item ? item.image : "assets/img/goods/placeholder.svg");
      const title = CATEGORY_TITLES[tag];
      const bodyText = tag === "fanart" && item ? item.title : `${title}を見る`;
      container.innerHTML = `
        <a class="card goods-card reveal" href="${CATEGORY_PAGES[tag]}">
          <img src="${image}" alt="${title}" loading="lazy">
          <div class="goods-info">
            <span class="tag ${tag}">${TAG_LABELS[tag]}</span>
            <p class="title">${bodyText}</p>
          </div>
        </a>
      `;
    });
  } catch (err) {
    console.error(err);
    targets.forEach(([, container]) => {
      container.innerHTML = `<p class="empty-state">読み込みに失敗しました</p>`;
    });
  }
}

// カテゴリー別ページ用: tagFilter を指定するとそのタグのみ表示（未指定なら全件）
export async function initGoodsGallery(containerId, tagFilter) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const items = await fetchAllGoods();
    const filtered = tagFilter ? items.filter((item) => item.tag === tagFilter) : items;

    if (filtered.length === 0) {
      container.innerHTML = `<p class="empty-state">準備中です</p>`;
      return;
    }

    // official(JSON手動管理)は配列の最後が最新。illustration/fanart(Drive)は取得時点で新しい順に
    // 並んでいるので配列の先頭が最新。
    const newIndex = tagFilter === "official" ? filtered.length - 1 : 0;
    container.innerHTML = filtered.map((item, i) => renderGoods(item, i === newIndex)).join("");
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="empty-state">読み込みに失敗しました</p>`;
  }
}
