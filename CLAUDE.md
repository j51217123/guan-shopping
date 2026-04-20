# guan-shopping — AI 協作指南

React 18 + Material UI + Firebase 架構的食品電商網站（個人作品）。本檔為 AI Agent 進入專案的錨點，描述「此專案的做事規矩」。

> 目錄結構、模組職責見 [AGENTS.md](./AGENTS.md)；硬規範見 [.claude/rules/](./.claude/rules/)。

---

## 溝通語言

- 對話、PR 描述、commit body、程式碼註解皆使用**繁體中文（zh-TW）**
- 變數、函式、檔名、技術術語、commit subject 保持**英文**
- 不使用 emoji 於 commit / 程式碼 / 文件，除非使用者明確要求

---

## 技術棧

| 層級 | 技術 |
|------|------|
| 框架 | React 18 + react-scripts 5（Create React App） |
| 路由 | React Router v6 |
| 狀態管理 | Redux Toolkit + Redux Saga（server side-effect） |
| UI | Material UI 5（@mui/material + @emotion） |
| 表單 | React Hook Form + Yup |
| HTTP | Axios |
| 後端服務 | Firebase 9（Auth / Firestore / Storage / Hosting） |
| 金流代理 | Express 後端（`backend/server.js`，部署於 Zeabur） |
| 測試 | Jest + React Testing Library（CRA 預設） |

**不要引入**：TypeScript、Next.js、Zustand、RTK Query、Tailwind — 除非使用者明確要求遷移。

---

## 編碼規範

### 檔案與函式大小

| 指標 | 上限 |
|------|------|
| 單一檔案 | 500 行 |
| 單一函式 / 元件 | 80 行 |
| JSX 巢狀深度 | 4 層 |

超過上限先考慮拆檔、拆元件、抽 custom hook。

### React 元件

- 函式元件 + Hooks，不用 class component
- 一個檔案一個 default export 的主元件
- Props 解構於參數列，不寫 `props.xxx`
- 樣式優先用 MUI `sx` prop；重複樣式抽 `styled()` 或 theme override
- 條件渲染用三元 / `&&`，不用 IIFE
- list 必須有穩定的 `key`，禁止 `key={index}`（除非列表真的是 immutable 順序）

### Redux

- 業務狀態放 Redux（product / user / cart / ui）
- 純 UI state（開關、input）用 `useState`，不進 Redux
- 每個 domain 一個 folder：`Redux/{Domain}/{domain}Slice.js` + `{domain}Saga.js`
- Saga 僅處理副作用（Firebase / axios），不放 UI 邏輯
- Selector 優先用 `useSelector((s) => s.x.y)`，複雜計算才用 `reselect`

### 表單

- 統一使用 `react-hook-form` + `yupResolver`
- Schema 獨立於元件外（利於測試與重用）
- `mode: 'onBlur'` 為預設，避免輸入中頻繁驗證

### 安全

- **禁止**在前端寫入 API Key、HashKey、HashIV、憑證（見 README `2026-04 安全與體驗重構`）
- 金流、簽章、任何含 secret 的邏輯一律後端處理
- Firebase 設定從 `process.env.REACT_APP_*` 讀取，`.env` 不進 git
- 登入狀態以 `onAuthStateChanged` 訂閱為 SSOT，**禁止**用 `localStorage` 判斷身分
- 路由守門用 `<RequireAuth>` 元件，不在各頁面自行判斷

### 效能

- 圖片 `loading="lazy"`（首屏以外）、明確指定 `width` / `height` 避免 CLS
- 列表長度 > 50 筆考慮 `react-lazyload` 或虛擬捲動
- `useMemo` / `useCallback` 只在實測有必要時加，不預先優化
- Bundle 大小變化（新增 dep）須在 PR 描述說明

---

## Git 工作流程

### 分支策略

```
master           ← 穩定主幹，僅接受來自 feature/* 的 PR
feature/xxx      ← 新功能
fix/xxx          ← Bug 修復
refactor/xxx     ← 重構（無行為變更）
perf/xxx         ← 效能優化
chore/xxx        ← 建置、相依、設定
docs/xxx         ← 文件
hotfix/xxx       ← 緊急修復（可直接從 master 切、修完 PR 回 master）
```

**禁止**直接 push 至 master。所有改動經 PR。

### Commit 規範（Conventional Commits + zh-TW body）

**格式**：

```
<type>(<scope>): <subject>

<body>（可選；若有，說明「為何」而非「做了什麼」）

<footer>（可選；BREAKING CHANGE / Closes #123）
```

**Type**（小寫）：

| Type | 用途 |
|------|------|
| `feat` | 使用者可感知的新功能 |
| `fix` | 修 bug（使用者可感知的錯誤行為） |
| `refactor` | 重構，不改變外部行為 |
| `perf` | 效能改善（附數據更佳） |
| `test` | 新增 / 修改測試 |
| `docs` | 文件（README、CLAUDE.md、註解） |
| `style` | 格式（Prettier、空白、標點），無邏輯變更 |
| `build` | 建置系統、相依更新（package.json、firebase.json） |
| `ci` | CI 設定（GitHub Actions 等） |
| `chore` | 其他雜項（.gitignore、設定檔微調） |
| `revert` | 還原先前 commit |

**Scope**（小寫，常用域名）：

| Scope | 涵蓋 |
|-------|------|
| `auth` | 登入、註冊、密碼重設、RequireAuth |
| `cart` | 購物車 |
| `product` | 商品列表、商品詳情、ProductCard |
| `dashboard` | 後台商品管理 |
| `payment` | 綠界金流、結帳流程 |
| `home` | 首頁、MainBannerSlider |
| `header` / `footer` | 頁首頁尾 |
| `redux` | slice / saga 共用改動 |
| `api` | `src/Api/` 或 `backend/` |
| `firebase` | Firestore rules、Functions、設定 |
| `ui` | MUI theme、全域樣式、LoadingMask |
| `deps` | 套件升降級 |

若跨多個 scope 且無單一主 scope，可省略 scope：`refactor: extract common form hook`

**Subject 規則**：

- 英文祈使句、小寫開頭、不加句號
- ≤ 60 字元
- 動詞用 **現在式祈使形**（`add`, `fix`, `remove`, `rename`, `extract`），不用 `added` / `adds`
- 避免 `update`、`change`、`modify` 這類無資訊動詞；改用具體動詞（`rename`、`replace`、`extract`、`simplify`）

**Body 規則**（zh-TW，可選）：

- 與 subject 間隔一空行
- 每行 ≤ 72 字元
- 說明「為何改」、「取捨為何」、「影響範圍」
- 不複述 diff 已明顯可見的「做了什麼」

**範例**（良好）：

```
feat(payment): move ECPay hash signing to backend

HashKey 原本寫死在前端，透過 DevTools 即可偽造金額。將簽章邏輯
搬至後端 `/api/payment/create`，前端僅傳金額與品項；callback 端
以 crypto.timingSafeEqual 驗簽，失敗回傳 0|CheckMacValue Invalid。
```

```
fix(auth): drop localStorage-based membership check

原判斷 `localStorage.getItem("isMember") === "true"` 可由
DevTools 繞過。改訂閱 onAuthStateChanged 作為 Redux state
的單一真實來源，並以 <RequireAuth> 守門 dashboard 路由。
```

```
perf(home): eliminate CLS by reserving hero image dimensions
```

```
refactor(product): use MUI Grid v2 for responsive list
```

**範例**（反模式，不要寫）：

```
update home page               ← 動詞無資訊
Fix Bug                        ← 大寫、沒 scope、沒細節
feat: 新增商品頁                ← subject 不用中文
wip                            ← 禁止 WIP commit 進入 master
chore: misc changes            ← 太模糊
```

### Commit 顆粒度

- 一個 commit = 一個邏輯單元（可獨立 revert）
- 不要把「feat + 無關 refactor + 順手格式化」混在同一 commit
- 格式化（prettier、rename）另開 `style:` / `refactor:` commit

### PR 規範

- Title 同 commit subject 格式
- Description 必含：**動機** / **改動摘要** / **測試方式** / **風險與回滾**
- 小 PR 優先（≤ 400 行 diff）；超過先考慮拆

---

## 工作流程

### 開始任務前

1. 確認需求（不明確則問清楚，勿猜測）
2. 搜尋既有實作（grep、glob）避免重複造輪
3. 若牽動超過 3 個檔案或需設計決策，先簡述計畫再動工

### 提交前

1. 本機跑過 `npm start` 確認無 console error / warning
2. 更動 UI 流程者，golden path 手測一次
3. `git diff` 自審：無 `console.log`、無 secret、無 debug code
4. commit message 符合上述規範

### 遇到問題時

1. 先找 root cause，不用 try-catch 吞錯來「繞過」
2. 同一問題重試 2 次無進展 → 停下來重新理解，而非第 3 次重試
3. 查 `.claude/rules/investigation-rigor.md`

---

## AI Agent 使用守則

- 改動前**必讀** [AGENTS.md](./AGENTS.md) 目錄結構
- 破壞性操作（刪檔、`git reset --hard`、`firebase deploy` 至 prod）**必須**先徵詢使用者
- 不確定時寧可多問，勿自行做架構決策
- 不自行新增未討論過的相依套件

---

## 參考

- [README.md](./README.md) — 專案簡介與 demo 連結
- [AGENTS.md](./AGENTS.md) — 目錄結構與模組職責
- [.claude/rules/](./.claude/rules/) — 硬規範集
