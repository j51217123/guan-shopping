# Agent 參考文件

> SSOT：每個 agent 的職責與能力以 `.claude/agents/**/*.md` 的 frontmatter + 內文為準。
> 本檔僅作為索引與呼叫方式速查。

## Agent 總覽

| 角色 | Agent Name | 檔案 | 主要職責 |
|------|-----------|------|---------|
| 前端開發 | `frontend-developer` | `agents/development/frontend-developer.md` | React 18、MUI 5、Redux Saga、React Hook Form |
| 後端開發 | `backend-developer` | `agents/development/backend-developer.md` | Express、Node.js、綠界金流簽章與驗簽 |
| DevOps | `devops-engineer` | `agents/development/devops-engineer.md` | Firebase、Zeabur 部署、相依管理、CI/CD |
| QA | `qa-engineer` | `agents/quality/qa-engineer.md` | Jest + RTL、測試策略、Bug 分類 |
| 產品經理 | `product-manager` | `agents/product/product-manager.md` | 需求釐清、User Story、優先序決策 |
| UX 設計師 | `ux-designer` | `agents/product/ux-designer.md` | UI/UX 審視、RWD、a11y、文案 |

---

## 呼叫方式

**主 session 本身即 orchestrator**，按需 spawn agent；無 manager agent 中介層。

### 自然語言（推薦）

```
請使用 frontend-developer agent 實作商品篩選
請使用 backend-developer agent 審查金流 callback 驗簽
請使用 devops-engineer agent 檢查 Firestore Rules
請使用 qa-engineer agent 規劃新功能測試策略
請使用 product-manager agent 釐清需求並寫成 spec
請使用 ux-designer agent 審視 Dashboard 設計稿
```

### Task tool 明確指定

```
subagent_type="frontend-developer"
subagent_type="ux-designer"
```

---

## 命名規範

- Agent name（frontmatter）與檔名一致：**kebab-case**
- 不接受：`Frontend Developer`（空格 / Title Case）、`FrontendDeveloper`（Pascal）、`frontend_developer`（snake）

---

## 使用場景速查

| 場景 | 建議 agent |
|------|-----------|
| React 元件實作、RWD 修復、前端重構 | `frontend-developer` |
| Express API、金流邏輯、後端安全 | `backend-developer` |
| Firebase 設定、部署、相依升級 | `devops-engineer` |
| 測試撰寫、測試策略、Bug 分析 | `qa-engineer` |
| 需求釐清、Story 拆分、優先序 | `product-manager` |
| UI 審視、RWD / a11y 檢查、文案 | `ux-designer` |

---

## 跨角色協作範例

### 新功能完整流程

```
product-manager   → 釐清需求、寫 spec、排優先序
ux-designer       → 審視設計、列互動狀態、a11y 檢查
frontend-developer → 實作 UI 與 state
backend-developer → 實作 API（若需）
devops-engineer   → 設定環境變數、Rules、部署
qa-engineer       → 規劃測試、補測試、回歸
```

### Bug 修復流程

```
qa-engineer       → 收集重現步驟、評估嚴重度
frontend/backend  → 找 root cause、修正
qa-engineer       → 補回歸測試
```

### 優化流程

```
ux-designer       → 指出 UX 問題（CLS、loading、a11y）
frontend-developer → 實作優化
qa-engineer       → 量測前後對比（Lighthouse、RTL）
```

---

## 協作原則

- **跨 agent 協調由主 session 直接進行**，不需協調者 agent
- **agent 之間不直接溝通**，透過主 session 整合
- **同一 PR 可呼叫多個 agent**（主 session 決定順序）
- Agent 在自己管轄外的事項**須拒絕並指引**至對應 agent

---

**最後更新**：2026-04-21
