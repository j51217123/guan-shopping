# .claude/rules — 硬規範索引

本目錄下所有 Markdown 規範對 AI Agent 具**強制約束力**，優先級高於模型預設行為，低於使用者當下明確指示。

---

## 規範一覽

| 規範 | 適用場景 | 核心要點 |
|------|---------|---------|
| [investigation-rigor.md](./investigation-rigor.md) | 除錯、測試失敗、非預期行為 | 先找 root cause，2 次法則，禁止吞錯 |
| [branch-workflow.md](./branch-workflow.md) | Git 分支與提交 | 命名規則、顆粒度、PR 四件套 |
| [spec-standards.md](./spec-standards.md) | 開始新任務前 | 先寫五段式 spec，非目標比目標重要 |
| [scope-guard.md](./scope-guard.md) | 執行任務過程 | 做被要求的事，不順手擴張，rule of three |
| [security.md](./security.md) | 身分、金流、secret 相關改動 | 前端不放 secret，不用 localStorage 判斷身分，驗簽 |

---

## 引用方式

- AI 在開工前應先瀏覽相關規範標題，遇特定場景時展開對應檔案詳讀
- 規範之間若有衝突，以較嚴格者為準；無法判斷時詢問使用者
- 規範更新須於 PR 描述註明「規範變更」，並說明影響範圍

---

## 新增規範的門檻

- 至少有**一次實際踩坑**或**一次 review 糾正**作為依據
- 規範文字具體、可執行、可驗證（不寫「要寫好的程式碼」這類無意義項目）
- 放在最小適用範圍（能放單一 scope rule 就不放通用 rule）
