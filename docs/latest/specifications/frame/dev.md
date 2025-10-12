# 特效開發規範 - 工程

本文件將產品互動意圖（UX/Game intent）轉化為前端工程規範，涵蓋 UI 元件、互動流程、動態效果與狀態  
文件適用於 Figma 設計轉工程，建議在 Chrome、Firefox、Edge 及 Mobile Web 測試。

## 文件用途

- 將玩家互動與系統事件映射至 UI 元件及 CSS 動態效果
- 規範元件互動狀態、動畫與 CSS transition

## 動態特效

### Button/Primary

| Class 狀態            | 說明 / 觸發條件 | 動態效果                      |
| --------------------- | --------------- | ----------------------------- |
| .btn-primary          | 預設            | 綠底白字，圓角 8px            |
| .btn-primary:hover    | 游標移入        | 深綠底 + Box Shadow           |
| .btn-primary:disabled | 不可操作        | 灰底灰字，cursor: not-allowed |

### Button/Secondary

| Class 狀態           | 說明 / 觸發條件 | 動態效果            |
| -------------------- | --------------- | ------------------- |
| .btn-secondary       | 預設            | 藍底白字，圓角 8px  |
| .btn-secondary:hover | 游標移入        | 深藍底 + Box Shadow |

### Button/Action/Pause

| Class 狀態               | 說明 / 觸發條件 | 動態效果              |
| ------------------------ | --------------- | --------------------- |
| .btn-action-pause        | 預設            | 綠底白字，圓角 8px    |
| .btn-action-pause.active | 暫停後高亮      | Box Shadow + 顏色加深 |

### Button/Action/Mute

| Class 狀態              | 說明 / 觸發條件 | 動態效果           |
| ----------------------- | --------------- | ------------------ |
| .btn-action-mute        | 預設            | 藍底白字           |
| .btn-action-mute.active | 靜音狀態        | 顏色加深，圖示變化 |

### Button/Action/Replay

| Class 狀態                | 說明 / 觸發條件 | 動態效果                                |
| ------------------------- | --------------- | --------------------------------------- |
| .btn-replay               | 預設            | 藍底白字                                |
| .btn-replay.replay-active | 閃爍特效        | flash keyframes 0.6s infinite alternate |

### Card/Rules

| Class 狀態            | 說明 / 觸發條件 | 動態效果                               |
| --------------------- | --------------- | -------------------------------------- |
| .card-rules.collapsed | 收合            | 高度 120px, Opacity0.9, Transition0.3s |
| .card-rules.expanded  | 展開            | 高度 240px, Opacity1, Transition0.3s   |

### Score/Current

| Class 狀態            | 說明 / 觸發條件    | 動態效果                |
| --------------------- | ------------------ | ----------------------- |
| .score-current        | 遊戲進行中顯示分數 | 字色#28a745, 淡入 0.25s |
| .score-current.update | 分數變化動畫       | fadeIn keyframes 0.25s  |

### Score/Final

| Class 狀態   | 說明 / 觸發條件      | 動態效果                   |
| ------------ | -------------------- | -------------------------- |
| .score-final | 遊戲結束顯示最終分數 | 字色#FF9800, ScaleUp 0.35s |

### Game/Canvas

| Class 狀態            | 說明 / 觸發條件 | 動態效果                   |
| --------------------- | --------------- | -------------------------- |
| .game-canvas.playing  | 遊戲進行中      | 實時渲染角色/道具/敵人動畫 |
| .game-canvas.paused   | 遊戲暫停        | 畫布凍結, 按鈕高亮         |
| .game-canvas.gameover | 遊戲結束        | 顯示分數 + 重玩按鈕動畫    |

### Modal/Leaderboard

| Class 狀態    | 說明 / 觸發條件    | 動態效果                                |
| ------------- | ------------------ | --------------------------------------- |
| .modal-active | 點擊排行榜按鈕彈出 | 半透明背景 + Modal 置中, Transition0.3s |

```css
/* 開始遊戲按鈕 */
.btn-primary {
  background-color: #28a745;
  color: #fff;
  border-radius: 8px;
  width: 200px;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s, box-shadow 0.2s;
}
.btn-primary:hover {
  background-color: #218838;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.btn-primary:disabled {
  background-color: #6c757d;
  color: #dcdcdc;
  cursor: not-allowed;
  box-shadow: none;
}

/* 遊戲規則卡片展開 / 收合 */
.card-rules {
  width: 320px;
  overflow: hidden;
  background: #f8f9fa;
  border-radius: 8px;
  transition: height 0.3s ease, opacity 0.3s ease;
  height: 120px;
}
.card-rules.expanded {
  height: 240px;
  opacity: 1;
}
.card-rules.collapsed {
  height: 120px;
  opacity: 0.9;
}

/* 分數動畫 */
.score-current {
  font-family: "Inter", sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: #28a745;
  transition: opacity 0.25s ease-out;
}
.score-current.update {
  opacity: 0;
  animation: fadeIn 0.25s forwards;
}
.score-final {
  font-family: "Inter", sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: #ff9800;
  transform: scale(1);
  animation: highlightScale 0.35s ease-out forwards;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes highlightScale {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

/* 重玩按鈕閃爍 */
.btn-replay {
  background: #007bff;
  color: #fff;
  border-radius: 8px;
  width: 48px;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  animation: none;
}
.btn-replay.replay-active {
  animation: flash 0.6s infinite alternate;
}
@keyframes flash {
  0% {
    background: #007bff;
  }
  50% {
    background: #339cff;
  }
  100% {
    background: #007bff;
  }
}

/* 操作按鈕暫停 / 靜音 */
.btn-action-pause.active {
  background-color: #28a745;
  box-shadow: 0 0 8px rgba(40, 167, 69, 0.6);
}
.btn-action-mute.active {
  background-color: #007bff;
  color: #fff;
}
```
