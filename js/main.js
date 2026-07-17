import { initLinks } from "./links.js";
import { initSchedule } from "./schedule.js";
import { initGoodsCategoryPreview } from "./goods.js";
import { initFriendsPreview } from "./friends.js";
import { initNavToggle } from "./nav.js";
import { observeReveals } from "./scroll-reveal.js";

async function init() {
  initNavToggle();
  observeReveals(); // 静的コンテンツ（プロフィール等）を先に監視開始

  await Promise.all([
    initLinks(),
    initSchedule(),
    initGoodsCategoryPreview({
      official: "goods-preview",
      illustration: "illustration-preview",
      fanart: "fanart-preview",
    }),
    initFriendsPreview("friends-preview"),
  ]);
  observeReveals(); // 動的に追加されたカードも監視対象に追加
}

document.addEventListener("DOMContentLoaded", init);
