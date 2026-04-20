# Branch Workflow — 分支與提交流程規範

---

## 分支命名

```
feature/<短描述>      新功能
fix/<短描述>          bug 修復
refactor/<短描述>     重構（無行為變更）
perf/<短描述>         效能優化
chore/<短描述>        建置、相依、設定
docs/<短描述>         文件
hotfix/<短描述>       緊急修復
```

**規則**：

- 全小寫 + `kebab-case`（例：`feature/add-wishlist`）
- 短描述 ≤ 40 字元
- 不使用底線、駝峰、中文
- 單一任務一個分支，不複用舊分支開新任務

---

## 保護分支

- `master` 僅接受 PR 合併，**禁止**直接 push
- 任何 AI 自動化動作若意圖改動 master（reset、force push、直接 commit），**必須**先徵詢使用者
- `git push --force` 對任何共用分支都須先徵詢

---

## Commit 顆粒度

- 一個 commit = 一個可獨立 revert 的邏輯單元
- **禁止** WIP commit 進入 master（本地可，PR 前 squash）
- 不把 feat + 無關 refactor + 格式化混在同一 commit

---

## Commit Message 格式

詳見 [CLAUDE.md#Git 工作流程](../../CLAUDE.md#git-工作流程)。要點：

```
<type>(<scope>): <subject>

<body>（zh-TW，說明為何）

<footer>（Closes #123 / BREAKING CHANGE）
```

**Subject**：英文祈使句、小寫、≤ 60 字、無句號。
**Body**：繁體中文、每行 ≤ 72 字、說明動機與取捨。

---

## PR 流程

1. 從 `master` 切新分支
2. 開發 + 本機驗證（`npm start` 無 error / warning）
3. 自審 `git diff`：無 `console.log`、無 secret、無 debug code
4. Push + 開 PR
5. PR 描述四件套：**動機 / 改動摘要 / 測試方式 / 風險與回滾**
6. 合併策略：squash merge（保持 master 線性歷史）

---

## 合併後清理

- 本機 `git branch -d <branch>`
- 遠端分支由 GitHub 自動刪除（設定中開啟）
- 不保留已合併的 stale 分支
