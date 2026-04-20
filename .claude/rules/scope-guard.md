# Scope Guard — 範圍守門

AI Agent 容易在執行任務時「順手做更多」，本規範強制範圍邊界。

---

## 核心原則

**做使用者要求的事，不多做、不少做。**

---

## 禁止的自主擴張

| 類型 | 範例 | 正確做法 |
|------|------|---------|
| 未討論的套件 | 順手 `npm install lodash` | 先問使用者是否同意引入 |
| 順手重構 | 修 bug 時把整個檔案重排 | 只改相關行，其餘另開 refactor PR |
| 順手格式化 | 改一行觸發整檔 Prettier | 另開 `style:` commit |
| 順手升級 | 發現 dep 過舊就升 | 相依升級獨立 PR 評估風險 |
| 新增抽象層 | 看到兩處相似就抽 util | 三次以上才考慮抽象（rule of three） |
| 新增配置檔 | 沒被要求就新增 `.prettierrc` | 先問 |

---

## 何時應該停下來問

以下情境 AI **必須**停下來徵詢使用者：

1. 需新增相依套件
2. 需修改 `package.json` scripts、build 設定
3. 需調整 Redux store 結構、Saga pipeline
4. 需改動路由、身分驗證、金流邏輯
5. 需修改 `.env.example`、`firebase.json`、`.firebaserc`
6. 需執行破壞性指令（`git reset --hard`、`firebase deploy --force`、`rm -rf`）
7. 發現使用者未提及的 bug，要不要順便修

---

## Rule of Three（抽象化門檻）

兩處相似程式**不抽象**，第三次出現才抽。

原因：兩次相似可能是巧合；抽太早的抽象常常與第三個案例對不上，反而要再拆一次。

---

## 刪除守則

刪檔、刪函式、刪 Redux action 前：

1. 全專案 grep 該名稱確認無引用
2. 若是 exported symbol，檢查是否在測試、文件、註解中提及
3. 不確定是否死碼 → 保留，加 `// TODO: verify dead code` 回報使用者

---

## 反模式範例

❌ 使用者：「幫我修 Header 的登入按鈕點擊無反應」
AI：修完 Header bug，順便把 Footer 也改成一樣的 click handler 寫法，再把整個 `Common/` 資料夾重新命名為 `Shared/`。

✅ 使用者：「幫我修 Header 的登入按鈕點擊無反應」
AI：定位 Header bug → 修 → commit `fix(header): wire up click handler`。若注意到 Footer 也有類似模式，回報使用者「是否要同步處理」，不自行擴張。
