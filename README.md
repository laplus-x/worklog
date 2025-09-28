# Worklog

為個人開發者使用的現代化工作日誌與知識管理系統。

## 專案簡介
Worklog 提供結構化的日誌、產品、報告與貢獻記錄，方便團隊協作與知識沉澱。適合需要高可維護性與可擴展性的專案管理場景。

## 特色
- 架構：模組化目錄，支援多層級內容分類。
- 程式品質：採用 TypeScript，嚴格型別檢查。
- 文件：所有內容皆以 Markdown 管理，易於追蹤與維護。
- 依賴：整合 Rspress、Tailwind CSS、PostCSS 等現代前端工具。
- 模組化：日誌、產品、報告、貢獻分區明確，易於擴展。
- 測試：建議以自動化測試確保內容正確性。
- 效能：靜態內容生成，載入快速。
- 安全性：內容皆為靜態檔案，無伺服器端風險。
- 整合性：可與 CI/CD、靜態網站部署服務整合。
- 可擴展性：支援自訂分類與內容結構。

## 資料夾結構
```
├─ bun.lock
├─ package.json
├─ postcss.config.js
├─ README.md
├─ rspress.config.ts
├─ tailwind.config.js
├─ tsconfig.json
├─ docs/
│  ├─ index.md
│  └─ latest/
│     ├─ _meta.json
│     ├─ contributions/
│     ├─ logs/
│     ├─ products/
│     └─ reports/
├─ public/
└─ styles/
	└─ index.css
```

- 根目錄：專案設定與依賴管理檔案。
- ```docs/```：所有內容與知識文件。
- ```public/```：靜態資源。
- ```styles/```：全域樣式。

## 模組與技術
- 語言：TypeScript
- 框架：Rspress
- 樣式：Tailwind CSS、PostCSS
- 文件格式：Markdown
- 設定：tsconfig、rspress、tailwind、postcss

## 快速開始
### 先決條件
- Node.js 18+
- Bun (建議)

### 安裝
```
bun install
```

### 啟動開發伺服器
```
bun run dev
```

### 建置靜態網站
```
bun run build
```

### 測試
請依專案需求補充自動化測試腳本。

## 發展規劃
- 增加自動化測試與 CI/CD
- 支援多語系內容
- 提供 API 整合與外部資料同步
- 強化內容搜尋與索引

## 貢獻方式
歡迎提交 Pull Request、回報問題或建議新功能。請遵循專案規範與分支策略。

## 授權條款
本專案採用 MIT License，詳見 ```LICENSE``` 檔案。

## 致謝
感謝所有開源社群、相關套件作者與貢獻者。
