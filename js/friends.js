async function fetchFriends() {
  const res = await fetch("data/friends.json", { cache: "no-store" });
  return res.json();
}

function renderFriend(item) {
  return `
    <a class="card friend-card reveal" href="${item.link}" target="_blank" rel="noopener noreferrer">
      <img class="friend-icon" src="${item.icon}" alt="${item.name}">
      <div class="friend-info">
        <p class="friend-name">${item.name}</p>
        <p class="friend-bio">${item.bio}</p>
      </div>
    </a>
  `;
}

// トップページ用: 代表として1人だけ表示し、専用ページへのリンクにする
export async function initFriendsPreview(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const friends = await fetchFriends();

    if (friends.length === 0) {
      container.innerHTML = `<p class="empty-state">友達紹介は準備中です</p>`;
      return;
    }

    const friend = friends[0];
    container.innerHTML = `
      <a class="card friend-card reveal" href="friends.html">
        <img class="friend-icon" src="${friend.icon}" alt="${friend.name}">
        <div class="friend-info">
          <p class="friend-name">${friend.name}</p>
          <p class="friend-bio">FRIENDS一覧を見る</p>
        </div>
      </a>
    `;
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="empty-state">読み込みに失敗しました</p>`;
  }
}

// 専用ページ用: 全員を表示
export async function initFriendsGallery(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const friends = await fetchFriends();

    if (friends.length === 0) {
      container.innerHTML = `<p class="empty-state">友達紹介は準備中です</p>`;
      return;
    }

    container.innerHTML = friends.map(renderFriend).join("");
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="empty-state">読み込みに失敗しました</p>`;
  }
}
