# 後台系統規範 - 工程

本文件將遊戲營運需求轉化為可落地的系統行為、API 介面與權限規範，供前後端工程師實作與維運使用。  
包含 API Contract、WebSocket 事件定義、錯誤碼表與審計規範。

## 文件用途

- 將營運需求轉化為技術可執行邏輯。
- 提供開發團隊清楚的 API 與事件規格。
- 協助前後端對齊資料流、權限與狀態同步。

## 系統角色

| 角色     | 職責                         | 權限       |
| -------- | ---------------------------- | ---------- |
| 營運人員 | 調整設定、建立活動、封鎖玩家 | 有限存取   |
| 開發人員 | 維運系統、監控伺服器         | 完全存取   |
| 玩家     | 遊戲端使用者                 | 無後台權限 |

## 權限邏輯

| 模組     | 營運人員           | 開發人員            |
| -------- | ------------------ | ------------------- |
| 遊戲設定 | 編輯               | 編輯 + 系統參數管理 |
| 玩家資料 | 查詢 + 封鎖        | 全權操作            |
| 排行榜   | 查閱               | 查閱 + 重建快取     |
| 活動管理 | 建立 / 修改 / 刪除 | 修改 / 系統觸發     |
| 系統監控 | 無                 | 完全存取            |

## 系統架構

```mermaid
sequenceDiagram
  participant OP as 營運人員
  participant UI as 後台前端
  participant API as 後端 API
  participant DB as 資料庫 / Redis
  participant WS as WebSocket Server
  participant GAME as 遊戲伺服器

  OP->>UI: 開啟操作介面
  UI->>API: 發送 API 請求
  API->>DB: 驗證 & 更新資料
  DB-->>API: 更新結果
  API->>WS: 推送事件
  WS->>GAME: 通知遊戲伺服器
  GAME-->>WS: 確認同步
  WS-->>UI: 前端接收事件更新
```

## 遊戲設定更新流程

```mermaid
sequenceDiagram
  participant OP as 營運人員
  participant UI as 後台前端
  participant API as 後端 API
  participant DB as 資料庫
  participant WS as WebSocket Server
  participant GAME as 遊戲伺服器

  OP->>UI: 開啟遊戲設定頁面
  UI->>API: PATCH /v1/game/config
  API->>DB: 驗證 & 更新設定
  DB-->>API: 更新結果
  API->>WS: 推送 configUpdated 事件
  WS->>GAME: 通知遊戲伺服器
  GAME-->>WS: 確認同步
  WS-->>UI: 更新前端介面
```

API：

```
PATCH /v1/game/config
Request Body:
{
  "scoreMultiplier": number,
  "enemySpawnRate": number
}
Response:
{
  "status": "success",
  "updatedAt": "2025-10-11T08:00:00Z"
}
Errors:
  400: INVALID_VALUE
  403: UNAUTHORIZED
  500: INTERNAL_ERROR
```

## 排行榜即時更新

```mermaid
sequenceDiagram
  participant PLAYER as 玩家端
  participant API as 後端 API
  participant DB as 資料庫 / Redis
  participant WS as WebSocket Server
  participant UI as 後台前端

  PLAYER->>API: POST /v1/score
  API->>DB: 儲存分數
  DB-->>API: 儲存結果
  API->>WS: 推送 leaderboardUpdated
  WS-->>UI: 更新排行榜
```

API：

```
POST /v1/score
Request:
{
  "playerId": string,
  "score": number
}
Response:
{
  "rank": number,
  "isNewHighScore": boolean
}
Errors:
  400: INVALID_SCORE
  500: DB_WRITE_FAILED
```

## 活動建立與啟用流程

```mermaid
sequenceDiagram
  participant OP as 營運人員
  participant UI as 後台前端
  participant API as 後端 API
  participant DB as 資料庫
  participant WS as WebSocket Server
  participant GAME as 遊戲伺服器

  OP->>UI: 開啟活動管理
  UI->>API: POST /v1/events
  API->>DB: 驗證時間衝突 & 建立活動
  DB-->>API: 建立結果
  API->>WS: 推送 eventActivated
  WS->>GAME: 通知遊戲伺服器
```

API：

```
POST /v1/events
Request:
{
  "name": "Double Score Week",
  "startTime": "2025-10-12T00:00:00Z",
  "endTime": "2025-10-19T00:00:00Z",
  "multiplier": 2.0
}
Response:
{
  "eventId": string,
  "status": "active"
}
Errors:
  409: EVENT_TIME_CONFLICT
  400: INVALID_PARAMETERS
```

## 玩家封鎖流程

```mermaid
sequenceDiagram
  participant OP as 營運人員
  participant UI as 後台前端
  participant API as 後端 API
  participant DB as 資料庫
  participant WS as WebSocket Server
  participant GAME as 遊戲伺服器

  OP->>UI: 搜尋玩家
  UI->>API: POST /v1/player/ban
  API->>DB: 更新封鎖清單
  DB-->>API: 更新結果
  API->>WS: 推送 playerBanned
  WS->>GAME: 通知遊戲伺服器
```

API：

```
POST /v1/player/ban
Request:
{
  "playerId": string,
  "reason": string
}
Response:
{
  "status": "banned",
  "bannedAt": "2025-10-11T10:00:00Z"
}
Errors:
  404: PLAYER_NOT_FOUND
  409: ALREADY_BANNED
```

## 系統監控與維運流程

```mermaid
sequenceDiagram
  participant DEV as 開發人員
  participant UI as 後台前端
  participant API as 後端 API

  DEV->>UI: 開啟系統監控頁
  UI->>API: GET /v1/system/status
  API-->>UI: 回傳 CPU / Memory / API Error Rate / Uptime
  DEV->>UI: 選擇重啟或清快取
  UI->>API: POST /v1/system/restart 或 /flush
  API-->>UI: 回傳成功狀態
```

API：

```
GET /v1/system/status
Response:
{
  "cpuUsage": 35.2,
  "memoryUsage": 67.1,
  "apiErrorRate": 0.03,
  "uptime": "2d 5h 13m"
}

POST /v1/system/restart
Response:
{
  "status": "restarting"
}
```

## 系統設定更新

```mermaid
sequenceDiagram
participant WS as WebSocket Server
participant GAME as 遊戲伺服器
participant UI as 後台前端

WS->>GAME: configUpdated
Note right of GAME: payload: { "config": { "scoreMultiplier": 1.5, "enemySpawnRate": 2 } }
WS->>UI: configUpdated
Note right of UI: 前端即時更新設定顯示
```

WebSocket：

| 事件名稱      | 來源    | 接收端                | Payload 範例                                                    |
| ------------- | ------- | --------------------- | --------------------------------------------------------------- |
| configUpdated | 後端 WS | 遊戲伺服器 / 後台前端 | `{ "config": { "scoreMultiplier": 1.5, "enemySpawnRate": 2 } }` |

## 排行榜更新

```mermaid
sequenceDiagram
participant WS as WebSocket Server
participant UI as 後台前端

WS->>UI: leaderboardUpdated
Note right of UI: payload: { "topPlayers": [ { "playerId": "p123", "score": 5000 }, ... ] }
```

WebSocket：

| 事件名稱           | 來源    | 接收端   | Payload 範例                                                       |
| ------------------ | ------- | -------- | ------------------------------------------------------------------ |
| leaderboardUpdated | 後端 WS | 後台前端 | `{ "topPlayers": [ { "playerId": "p123", "score": 5000 }, ... ] }` |

## 活動管理

```mermaid
sequenceDiagram
participant WS as WebSocket Server
participant GAME as 遊戲伺服器

WS->>GAME: eventActivated
Note right of GAME: payload: { "event": { "name": "Double Score Week", "startTime": "...", "endTime": "..." } }
```

WebSocket：

| 事件名稱       | 來源    | 接收端     | Payload 範例                                                                         |
| -------------- | ------- | ---------- | ------------------------------------------------------------------------------------ |
| eventActivated | 後端 WS | 遊戲伺服器 | `{ "event": { "name": "Double Score Week", "startTime": "...", "endTime": "..." } }` |

## 玩家管理

```mermaid
sequenceDiagram
participant WS as WebSocket Server
participant GAME as 遊戲伺服器

WS->>GAME: playerBanned
Note right of GAME: payload: { "playerId": "abc123" }
```

WebSocket：

| 事件名稱     | 來源    | 接收端     | Payload 範例               |
| ------------ | ------- | ---------- | -------------------------- |
| playerBanned | 後端 WS | 遊戲伺服器 | `{ "playerId": "abc123" }` |

## 系統監控與維運

```mermaid
sequenceDiagram
participant WS as WebSocket Server
participant UI as 後台前端

WS->>UI: systemStatusUpdated
Note right of UI: payload: { "cpuUsage": 35.2, "memoryUsage": 67.1, "apiErrorRate": 0.03, "uptime": "2d 5h 13m" }
```

WebSocket：

| 事件名稱            | 來源    | 接收端   | Payload 範例                                                                             |
| ------------------- | ------- | -------- | ---------------------------------------------------------------------------------------- |
| systemStatusUpdated | 後端 WS | 後台前端 | `{ "cpuUsage": 35.2, "memoryUsage": 67.1, "apiErrorRate": 0.03, "uptime": "2d 5h 13m" }` |

## 錯誤碼定義

| 錯誤碼              | HTTP | 說明                   |
| ------------------- | ---- | ---------------------- |
| INVALID_PARAMETERS  | 400  | 參數不合法或缺少欄位   |
| INVALID_VALUE       | 400  | 數值範圍錯誤（如負數） |
| UNAUTHORIZED        | 403  | 權限不足               |
| PLAYER_NOT_FOUND    | 404  | 查無玩家資料           |
| EVENT_TIME_CONFLICT | 409  | 活動時間重疊           |
| DB_WRITE_FAILED     | 500  | 資料庫寫入失敗         |
| INTERNAL_ERROR      | 500  | 未預期的系統錯誤       |

## 審計與操作日誌規範

| 操作類型     | 記錄欄位                                  | 審計內容               |
| ------------ | ----------------------------------------- | ---------------------- |
| 遊戲設定修改 | operatorId, oldValue, newValue, timestamp | 誰改了哪個設定         |
| 活動建立     | operatorId, eventName, startTime, endTime | 建立與修改紀錄         |
| 玩家封鎖     | operatorId, playerId, reason              | 何人封鎖何玩家與原因   |
| 系統操作     | operatorId, actionType                    | 監控、重啟、清快取行為 |

所有操作記錄寫入 `audit_log` 表並每日匯出備份。
