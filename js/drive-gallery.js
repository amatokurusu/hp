/**
 * Googleドライブの指定フォルダ内の画像一覧を取得し、goods-card用のitem形式に変換する。
 * data/drive-config.json が未設定（プレースホルダーのまま）の場合は何も取得しない。
 */
const DRIVE_FIELDS = "files(id,name,thumbnailLink,webViewLink,mimeType)";

function isConfigured(value) {
  return typeof value === "string" && value.length > 0 && !value.startsWith("YOUR_");
}

async function fetchDriveImages(folderId, apiKey) {
  if (!isConfigured(folderId) || !isConfigured(apiKey)) return [];

  const q = encodeURIComponent(`'${folderId}' in parents and trashed = false and mimeType contains 'image/'`);
  const url =
    `https://www.googleapis.com/drive/v3/files?q=${q}` +
    `&key=${encodeURIComponent(apiKey)}` +
    `&fields=${encodeURIComponent(DRIVE_FIELDS)}` +
    `&orderBy=createdTime desc&pageSize=100`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Google Drive API error: ${res.status}`);
    const data = await res.json();
    return data.files ?? [];
  } catch (err) {
    console.error("Google Driveフォルダの読み込みに失敗しました", err);
    return [];
  }
}

// Driveのサムネイル画像は既定で小さいため、サイズ指定を大きいものに置き換える
function upscaleThumbnail(thumbnailLink) {
  return thumbnailLink ? thumbnailLink.replace(/=s\d+$/, "=s800") : thumbnailLink;
}

function stripExtension(filename) {
  return filename.replace(/\.[^.]+$/, "");
}

// ファイル名が「アーティスト名_amato.拡張子」の命名規則の場合、アーティスト名を自動でクレジット表示する
function parseFanartCredit(filename) {
  const [handle] = stripExtension(filename).split("_");
  return handle ? `@${handle}` : "";
}

export async function loadDriveGoods() {
  let config;
  try {
    const res = await fetch("data/drive-config.json", { cache: "no-store" });
    config = await res.json();
  } catch (err) {
    console.error("data/drive-config.json の読み込みに失敗しました", err);
    return [];
  }

  const [illustrations, fanarts] = await Promise.all([
    fetchDriveImages(config.illustrationFolderId, config.apiKey),
    fetchDriveImages(config.fanartFolderId, config.apiKey),
  ]);

  const illustrationItems = illustrations.map((file) => ({
    image: upscaleThumbnail(file.thumbnailLink),
    title: stripExtension(file.name),
    credit: "",
    link: file.webViewLink,
    tag: "illustration",
  }));

  const fanartItems = fanarts.map((file) => {
    const credit = parseFanartCredit(file.name);
    const handle = credit.replace(/^@/, "");
    return {
      image: upscaleThumbnail(file.thumbnailLink),
      title: handle ? `${handle}さんの作品` : "ファンアート",
      credit,
      link: file.webViewLink,
      tag: "fanart",
    };
  });

  return [...illustrationItems, ...fanartItems];
}
