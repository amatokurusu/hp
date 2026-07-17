let observer;

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
  }
  return observer;
}

/**
 * root配下の未観測な .reveal 要素を監視対象に追加する。
 * JSONから動的に描画されたカードにも対応できるよう、描画のたびに呼び直す想定。
 */
export function observeReveals(root = document) {
  const obs = getObserver();
  root.querySelectorAll(".reveal:not([data-observed])").forEach((el) => {
    el.dataset.observed = "true";
    obs.observe(el);
  });
}
