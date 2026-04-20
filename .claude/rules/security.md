# Security — 安全底線

基於 README「2026-04 安全與體驗重構」一節的經驗固化為規範。違反視同嚴重瑕疵。

---

## 絕對禁止（Hard Stop）

### 1. 前端硬編碼 Secret

**禁止**在 `src/` 內出現以下任何項目的明文：

- `HashKey` / `HashIV`（綠界金流）
- Firebase Admin SDK Key、Service Account JSON
- 第三方 API 的 Server-side Secret
- 資料庫連線字串、私鑰、憑證

**允許**寫在前端的：

- Firebase Web SDK 設定（`REACT_APP_FIREBASE_*`）— 本質為 public key，靠 Security Rules 防護
- 公開 API endpoint URL

檢查方式：commit 前 `grep -rE "(HashKey|HashIV|serviceAccount|PRIVATE KEY)" src/` 必須無結果。

### 2. 用可偽造來源判斷身分

**禁止**：

- `localStorage.getItem("isMember")` 判斷登入
- `sessionStorage` 存角色
- URL query string 傳 `?admin=1`
- Cookie 不帶 `Secure` + `HttpOnly`（若自行實作）

**唯一 SSOT**：Firebase `onAuthStateChanged` → Redux userSlice → `<RequireAuth>` 守門。

### 3. 金流 callback 無驗簽

綠界 callback 必須以 `crypto.timingSafeEqual` 驗簽：

```js
if (!timingSafeEqual(Buffer.from(received), Buffer.from(expected))) {
  return res.send("0|CheckMacValue Invalid");
}
```

不得用 `===` 比對（timing attack）、不得省略驗簽直接回 `1|OK`。

---

## 高風險區必讀

| 區域 | 檔案 | 風險 |
|------|------|------|
| 金流簽章 | `backend/server.js` | HashKey 洩漏 / 驗簽繞過 |
| 身分驗證 | `src/App.js`、`src/Redux/User/` | 角色偽造 |
| 路由守門 | `<RequireAuth>` | dashboard 未保護 |
| Firestore | `firestore.rules`（若有） | 任意讀寫 |
| 環境變數 | `.env` / `.env.example` | Secret 進 git |

動這些區域前 → 先讀相關 commit（b97e284、e489d5b）理解脈絡。

---

## 輸入驗證

- 所有表單送出前 → `yup` schema 驗證
- 後端 API 收到請求 → 再驗一次（前端驗證可繞過）
- 金額、數量、ID 等數值 → 型別 + 範圍檢查
- 字串 → 長度上限 + 危險字元過濾（避免 XSS；React 預設 escape，但 `dangerouslySetInnerHTML` 禁用）

---

## 日誌

- `console.log` 不進 production（CI 設定或手動 review）
- 錯誤日誌**不得**包含：密碼、Token、完整信用卡號、Session ID
- 後端 log 使用 `console.error` 並加上 request context（路徑 / 方法 / 使用者 ID）

---

## 相依套件

- 新增 dep 前 → `npm view <pkg>` 檢查 weekly downloads、last publish、maintainer
- `npm audit` 高風險警示須在 PR 說明處理方式
- Dependabot PR 不無腦合併；major 升級視為 refactor 流程

---

## Git 提交前檢查

- [ ] 無 `.env` 被 stage（`.gitignore` 已排除，但仍須手動確認）
- [ ] 無 Secret、Token、金鑰在 diff 中
- [ ] 無本機 IP、內部網址、內部同事姓名
- [ ] 無 `TODO: remove before commit` 類遺留註記

---

## 破壞性操作

需使用者明確同意才執行：

- `firebase deploy` 至 production
- `rm -rf node_modules` / `rm -rf build`（雖可還原，仍先告知）
- `git push --force`、`git reset --hard` 對任何共用分支
- 修改 Firestore Security Rules
- 刪除 Firebase Auth 使用者、Firestore 資料

---

## 發生洩漏時的 SOP

若已推送含 secret 的 commit 至遠端：

1. **立即**在源頭撤銷（綠界後台換 Key、Firebase 產生新憑證）
2. 用 `git filter-repo` 或 BFG 移除歷史中的 secret
3. `git push --force` 並通知所有協作者重新 clone
4. 不要只是再 commit 一次「移除」— 歷史裡還在
