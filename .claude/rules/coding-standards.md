# Coding Standards — 編碼規範

從 CLAUDE.md 拆出的寫 code 細則，按需載入。適用於所有 `src/` 與 `backend/` 實作。

---

## 檔案與函式大小

| 指標 | 上限 |
|------|------|
| 單一檔案 | 500 行 |
| 單一函式 / 元件 | 80 行 |
| JSX 巢狀深度 | 4 層 |

超過上限先考慮拆檔、拆元件、抽 custom hook。

---

## React 元件

- 函式元件 + Hooks，不用 class component
- 一個檔案一個 default export 的主元件
- Props 解構於參數列，不寫 `props.xxx`
- 樣式優先用 MUI `sx` prop；重複樣式抽 `styled()` 或 theme override
- 條件渲染用三元 / `&&`，不用 IIFE
- list 必須有穩定的 `key`，禁止 `key={index}`（除非列表真的是 immutable 順序）
- 禁止 `dangerouslySetInnerHTML`（XSS 風險）
- 元件檔名使用 `PascalCase.jsx`，hook 檔名使用 `useXxx.js`

---

## Redux（Toolkit + Saga）

- 業務狀態放 Redux（product / user / cart / ui）
- 純 UI state（開關、input）用 `useState`，不進 Redux
- 每個 domain 一個 folder：`Redux/{Domain}/{domain}Slice.js` + `{domain}Saga.js`
- Saga 僅處理副作用（Firebase / axios），不放 UI 邏輯
- Selector 優先用 `useSelector((s) => s.x.y)`，複雜計算才用 `reselect`
- Action 命名：過去式（`userLoggedIn`）或動詞（`fetchProducts`），不混用
- Saga 成功 / 失敗 / 取消三路徑都要處理，loading show / hide 成對

---

## 表單

- 統一使用 `react-hook-form` + `yupResolver`
- Schema 獨立於元件外（利於測試與重用）
- `mode: 'onBlur'` 為預設，避免輸入中頻繁驗證
- 錯誤訊息使用繁體中文，具體描述問題（「Email 格式錯誤」，不寫「格式錯誤」）
- 送出前再驗一次完整 schema，不信任單一欄位的即時驗證

---

## 效能

- 圖片 `loading="lazy"`（首屏以外）、明確指定 `width` / `height` 避免 CLS
- 列表長度 > 50 筆考慮 `react-lazyload` 或虛擬捲動
- `useMemo` / `useCallback` 只在**實測有必要**時加，不預先優化
- Bundle 大小變化（新增 dep）須在 PR 描述說明
- 首屏關鍵資源（hero image、logo）用 `<link rel="preload">` 或 `<img fetchpriority="high">`
- 避免在 render 層做昂貴計算；抽出為 `useMemo` 或 selector

---

## 命名

- 變數 / 函式：`camelCase`
- 元件 / 類別：`PascalCase`
- 常數：`SCREAMING_SNAKE_CASE`（僅 module-scope 常數）
- 檔案：React 元件 `PascalCase.jsx`、hook `useXxx.js`、其他 `camelCase.js`
- Redux action：`domainEvent`（`userLoggedIn`、`productsFetched`）
- 事件 handler：`handleXxx`（本地）、`onXxx`（props 傳入）

---

## 註解

- **預設不寫註解**。命名良好的 code 勝過註解
- 僅在 WHY 不明顯時才寫：隱藏約束、workaround、surprising behavior
- 不寫 WHAT（code 已說明）、不寫「fix for issue #123」（commit message 才是載體）
- TODO 必附認領者或 issue：`// TODO(#42): ...`
- JSDoc 只在對外 API 或複雜 util 寫，內部函式不寫

---

## Import 順序

```js
// 1. React / framework
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// 2. 第三方套件
import { Box, Button } from '@mui/material';
import axios from 'axios';

// 3. 專案內（絕對路徑優先；相對路徑最後）
import { useAuth } from 'Redux/User/hooks';
import ProductCard from './ProductCard';

// 4. 樣式 / assets
import './styles.css';
```

---

## Error Handling

- 不用 try-catch 吞錯（見 `rules/investigation-rigor.md`）
- 預期可能失敗的 async → try-catch + dispatch error state + 顯示給使用者
- 非預期錯誤 → 讓 error boundary / 全域 handler 接
- 錯誤訊息**給使用者**：用人話，說明怎麼解
- 錯誤訊息**給開發者**（log）：帶 context（操作、時間、使用者 ID）

---

## 參考

- [CLAUDE.md](../../CLAUDE.md) — 紅線、Git 工作流程、文件同步
- [rules/security.md](./security.md) — 安全底線
- [rules/investigation-rigor.md](./investigation-rigor.md) — 除錯紀律
- [rules/scope-guard.md](./scope-guard.md) — 範圍守門
