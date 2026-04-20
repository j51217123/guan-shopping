# AGENTS.md — guan-shopping 專案上下文錨點

讓 AI Agent 在開場就掌握「這個 repo 長什麼樣、東西放哪、改的時候要注意什麼」。

> 做事規矩見 [CLAUDE.md](./CLAUDE.md)；硬規範見 [.claude/rules/](./.claude/rules/)。

---

## 專案摘要

React 18 + Material UI + Firebase 建構的食品電商（個人練習作品）。使用者角色：

- **訪客**：瀏覽商品、加入購物車
- **會員（member）**：訪客能力 + 結帳、歷史訂單
- **管理員（admin）**：會員能力 + 商品 CRUD（Dashboard）

部署：

- 前端：Firebase Hosting — `https://guan-shopping-web.web.app/`
- 後端（金流代理）：Zeabur — `https://guan-shopping-backend.zeabur.app/`

---

## 目錄結構

```
guan-shopping/
├── .claude/                 ← AI 協作設定
│   └── rules/               ← 硬規範（所有 AI 行為強制遵守）
├── backend/                 ← Express 後端（綠界金流簽章代理）
│   ├── server.js            ← 主入口
│   └── package.json
├── build/                   ← CRA 產物（不進 git）
├── public/                  ← 靜態資源、index.html、manifest
├── src/
│   ├── Api/
│   │   └── Api.js           ← Axios instance、後端 API 呼叫封裝
│   ├── Assets/              ← 圖片、字型、靜態資源
│   ├── Components/          ← 所有 UI 元件（見下方分層）
│   ├── Redux/               ← 狀態管理（Slice + Saga）
│   ├── Utils/
│   │   ├── firebase.js      ← Firebase SDK 初始化（Auth / Firestore / Storage）
│   │   ├── firebaseConfig.js← 從 process.env 讀設定
│   │   └── UtilityJS.js     ← 共用工具函式
│   ├── App.js               ← 路由總覽 + onAuthStateChanged 訂閱
│   ├── App.css / index.css  ← 全域樣式（盡量少用，優先 MUI sx）
│   └── index.js             ← ReactDOM entry + Redux Provider
├── CLAUDE.md                ← AI 協作指南（本專案做事規矩）
├── AGENTS.md                ← 本檔
├── README.md                ← 專案介紹 + Demo 連結
├── firebase.json            ← Hosting 設定
├── .firebaserc              ← Firebase 專案綁定
└── package.json
```

### src/Components/ 分層

| 資料夾 | 職責 | 使用者可見路由 |
|--------|------|--------------|
| `App/` | App 層級殼（layout、provider） | - |
| `Header/` | 全站頁首、nav、user menu | - |
| `Footer/` | 全站頁尾 | - |
| `Home/` | 首頁 | `/` |
| `MainBannerSlider/` | 首頁輪播（react-slick） | 嵌於 Home |
| `Contents/` | 商品列表頁容器 | `/products` |
| `ProductCardList/` | 商品卡片清單（RWD grid） | - |
| `ProductCard/` | 單張商品卡片 | - |
| `ProductDetail/` | 商品詳情頁 | `/products/:id` |
| `ShoppingCart/` | 購物車頁 | `/shopping-cart` |
| `Checkout/` | 結帳流程 | `/checkout` |
| `Payment/` | 綠界金流表單（僅組裝參數） | `/payment` |
| `PaymentResult/` | 結帳結果頁 | `/payment-result` |
| `Login/` | 登入 / 註冊 / 密碼重設 | `/login` |
| `Dashboard/` | 後台商品 CRUD（需 admin） | `/dashboard/*` |
| `TabPanel/` | MUI Tab 共用 | - |
| `Common/` | 跨頁面共用元件（LoadingMask、skeleton 等） | - |
| `Alert/` | 全域 Alert / Confirm | - |

### src/Redux/ 分層

```
Redux/
├── configureStore.js        ← Redux Toolkit store + saga middleware 組裝
├── index.js                 ← 匯出 store
├── Product/
│   ├── productSlice.js      ← 商品 state（list、detail）
│   └── productSaga.js       ← Firestore 讀寫
├── User/
│   ├── userSlice.js         ← 登入狀態、profile、role
│   └── userSaga.js          ← Firebase Auth 相關 side-effect
└── Ui/
    └── uiSlice.js           ← loadingCount、全域 alert 等純 UI 狀態
```

**注意**：目前沒有獨立的 `Cart/` domain — 購物車狀態散在 `localStorage` + 元件內 state。若未來要集中管理，新增 `Redux/Cart/` 並依循三件組（slice / saga / selector）模式。

---

## 關鍵流程

### 身分驗證

1. `App.js` 掛載時訂閱 `onAuthStateChanged(auth, callback)`
2. 有使用者 → dispatch `userSlice.setUser(user)` + 從 Firestore 撈 `users/{uid}` 取 role
3. `<RequireAuth requireAdmin>` 守門 `/dashboard/*`，未登入 redirect `/login`
4. **不要**用 `localStorage` 判斷身分（歷史債，已於 b97e284 移除）

### 金流

1. 前端 `Payment.jsx` 收集訂單資訊
2. POST `backend/server.js` `/api/payment/create`
3. 後端以 HashKey / HashIV 產生 `CheckMacValue`，回傳完整表單資料
4. 前端用 auto-submit form 導向綠界
5. 綠界 callback 打後端 `/api/payment/callback`，後端 `crypto.timingSafeEqual` 驗簽
6. 驗簽通過 → 更新 Firestore 訂單狀態 → redirect `PaymentResult`

**Secret 清單**（禁止出現在前端）：
`ECPAY_MERCHANT_ID` / `ECPAY_HASH_KEY` / `ECPAY_HASH_IV` / Firebase Admin SDK 任何 Key

### 全域 Loading

- 任何 async 流程的 Saga 發 action → `uiSlice.showLoading` / `hideLoading`
- `<LoadingMask>`（掛在 App 層）依 `loadingCount > 0` 顯示 MUI Backdrop
- 新增 async 流程時**必須**成對呼叫 show / hide（finally 裡 hide）

---

## 環境變數

`.env`（不進 git，對照 `.env.example`）：

```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_BACKEND_API_URL=
```

後端 `backend/.env`（部署於 Zeabur，env 由平台注入）：

```
ECPAY_MERCHANT_ID=
ECPAY_HASH_KEY=
ECPAY_HASH_IV=
FRONTEND_ORIGIN=
```

---

## 常用指令

```bash
# 前端開發
npm start                    # http://localhost:3000
npm run build                # 產出 build/
npm test                     # Jest watch mode

# 後端（金流代理）
cd backend && npm start      # http://localhost:3001（or 自訂 PORT）

# Firebase 部署
firebase deploy --only hosting

# 檢視未提交變更
git status
git diff
```

---

## 改動時常踩的坑

1. **React Router v6** 路由名區分大小寫 — 全專案統一 `lowercase-kebab-case`（見 f25e3b3）
2. **Firestore 讀寫**不要放在元件內 `useEffect` 裡直接 call — 走 Saga 統一處理
3. 新增 MUI 元件時先查 `@mui/material` 是否已有，不另裝 headless UI
4. `react-slick` 有個 CSS 載入順序地雷 — 確認 `slick-carousel/slick/slick.css` 早於自訂樣式
5. `react-scripts 5` 對 polyfill 處理有 breaking change — 新 dep 若用到 `crypto` / `stream` 可能需 webpack config override（目前 `crypto-js` 是純 JS 實作，無此問題）

---

## 未處理技術債（優先級由高至低）

見 [README.md#已知但未處理的項目](./README.md#已知但未處理的項目-trade-off-後刻意延後)。概要：

1. TypeScript 導入
2. Redux-Saga → Zustand / TanStack Query 遷移評估
3. `UserSaga.js` 登入失敗自動註冊邏輯審視
4. 相依版本升級（Dependabot 100+ 警示）

改動涉及以上任一項時，先與使用者確認範圍與時機，勿順手開坑。

---

**最後更新**：2026-04-21
