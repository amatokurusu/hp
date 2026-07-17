# キャラクター名 活動ホームページ

プレーンHTML/CSS/JSで構築した、GitHub Pages公開用のVtuber活動ホームページです。
ビルドステップは不要で、ファイルを編集してそのままpushすれば公開されます。

## ローカルで確認する

`data/*.json` を `fetch` で読み込むため、`index.html` を直接ブラウザで開くとCORSエラーで
コンテンツが表示されません。以下のいずれかでローカルサーバーを起動してください。

- VS Code拡張機能「Live Server」で `index.html` を開く
- もしくはターミナルで `npx serve .` を実行

## 日常的な更新方法

以下の3ファイルを編集するだけで、レイアウトに触れずに内容を更新できます。

- `data/schedule.json` — 配信・動画スケジュール
- `data/links.json` — SNSリンク一覧
- `data/goods.json` — グッズ・ファンアート一覧（`tag` は `"official"` か `"fanart"`）

## 差し替えが必要な項目（公開前チェックリスト）

- [ ] `index.html` 内の「キャラクター名」をすべて実際の名前に置き換える
- [ ] `assets/img/logo.svg` / `hero-illustration.svg` / `favicon.svg` を実際のイラストに差し替え
- [ ] `assets/img/og-image.png`（1200×630程度）を追加し、`index.html` の `og:image` から参照されていることを確認
- [ ] `css/variables.css` の `--color-primary` などをキャラクターカラーに変更
- [ ] `index.html` 内のSNS・YouTubeチャンネルURLを実際のものに変更
- [ ] `#schedule` 内のYouTube埋め込み `list=UUxxxxxxxxxxxxxxxxxxxxxx` を、実際のチャンネルの
      アップロード再生リストID（チャンネルID `UCxxxxxxxx` の `UC` を `UU` に置き換えたもの）に変更
- [ ] `data/goods.json` の `assets/img/goods/placeholder.svg` を実際の画像に差し替え

## GitHub Pagesへのデプロイ

1. このフォルダで `git init`
2. GitHubに空のリポジトリを作成（例: `character-name-hp`）
3. `git remote add origin <リポジトリURL>` → `git push -u origin main`
4. リポジトリの Settings → Pages で、Source を「Deploy from a branch」、
   branchを `main` / `/(root)` に設定
5. 数分後、`https://<ユーザー名>.github.io/<リポジトリ名>/` で公開される

独自ドメインを使う場合は、リポジトリ直下に `CNAME` ファイル（中身はドメイン名1行）を追加し、
DNS側で `CNAME` レコードを `<ユーザー名>.github.io` に向けてください。
