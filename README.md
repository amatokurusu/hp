# 来栖天人 活動ホームページ

プレーンHTML/CSS/JSで構築した、GitHub Pages公開用のVtuber活動ホームページです。
ビルドステップは不要で、ファイルを編集してそのままpushすれば公開されます。

- 公開URL: https://amatokurusu.github.io/hp/
- リポジトリ: https://github.com/amatokurusu/hp

## ローカルで確認する

`data/*.json` を `fetch` で読み込むため、`index.html` を直接ブラウザで開くとCORSエラーで
コンテンツが表示されません。以下のいずれかでローカルサーバーを起動してください。

- VS Code拡張機能「Live Server」で `index.html` を開く
- もしくはターミナルで `npx serve .` や `python -m http.server` を実行

## 日常的な更新方法

以下のファイルを編集するだけで、レイアウトに触れずに内容を更新できます。JSON側は
`no-store`で取得しているので、通常のリロードで反映されます。

- `data/schedule.json` — 配信・動画スケジュール（配列を空にすると「不定期開催」の案内文が表示されます）
- `data/links.json` — SNSリンク一覧（表示順もこの配列の順番のまま反映されます）
- `data/goods.json` — 公式グッズ一覧（`tag` は `"official"` 固定。画像・リンク・クレジットを追加/編集）
- `data/friends.json` — FRIENDS一覧（アイコン画像・名前・リンク・一言紹介文）
- `data/drive-config.json` — イラスト/ファンアートを自動取得するGoogleドライブのフォルダID・APIキー

### イラスト・ファンアートの更新について

`data/drive-config.json` で指定した2つのGoogleドライブフォルダ（イラスト用・ファンアート用）に
画像を置くだけで、`illustration.html` / `fanart.html` に自動反映されます。コード変更は不要です。

- ファンアートのファイル名は **「アーティスト名_amato.拡張子」**（例: `sion_amato.jpg`）にすると、
  クレジット表記（`@sion`）が自動生成されます。
- トップページの各カテゴリー（グッズ/イラスト/ファンアート）のプレビュー画像を特定の1枚に固定したい場合は、
  `js/goods.js` の `CATEGORY_PREVIEW_IMAGE_OVERRIDES` を編集してください。

### Google Drive APIキーについて

`data/drive-config.json` のAPIキーはHTTPリファラー制限（Google Cloud Console側）で保護しています。
公開ドメインやlocalhostを変更した場合は、Google Cloud Consoleの認証情報でキーの
「ウェブサイトの制限」に新しいURLを追加してください。

## サイト構成

- `index.html` — トップページ（プロフィール／最新のPOST／スケジュール／イラスト・ファンアート・FRIENDS・グッズの導線／SNSリンク／お問い合わせ）
- `goods.html` / `illustration.html` / `fanart.html` / `friends.html` — 各カテゴリーの一覧ページ
- `css/variables.css` — 配色・フォント・余白などのデザイン変数（配色を変える場合はここだけ編集）

## GitHub Pagesへのデプロイ（更新の反映方法）

初回セットアップは完了済みです。以降の更新は以下だけで反映されます。

```
git add -A
git commit -m "更新内容"
git push
```

pushしてから数分でhttps://amatokurusu.github.io/hp/ に反映されます。
