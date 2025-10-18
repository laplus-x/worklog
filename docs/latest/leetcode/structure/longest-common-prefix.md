# Longest Common Prefix（最長公共前綴）

[題目連結](https://leetcode.com/problems/longest-common-prefix/)

## 設計用意

這題的目的是讓初階工程師學會如何處理字串（string）間的共通部分，並熟悉基本的字串比對技巧。這在實務開發中非常常見，例如：

- 檢查使用者輸入的關鍵字是否與資料庫中的條目有共同的前綴。
- 實作搜尋建議（autocomplete）功能，根據使用者輸入的前綴提供建議。

## 學習重點

1. **字串比對**：學會如何逐個字元比較字串。
2. **邊界條件處理**：處理空字串、空陣列等特殊情況。
3. **效率考量**：在最壞情況下，如何確保程式的效能。
4. **簡潔程式設計**：撰寫簡潔且易於理解的程式碼。

## 原文簡述

Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "".

## 題目講解

題目要求我們找出一組字串中最長的共同前綴。舉例來說：

- 輸入：`["flower","flow","flight"]`
- 輸出：`"fl"`

如果沒有共同的前綴，則回傳空字串 `""`。

## 範例講解

假設我們有以下字串陣列：

```
["dog", "racecar", "car"]
```

這些字串的共同前綴為空字串 `""`，因為它們沒有共同的開頭。

## 虛擬碼（Pseudocode）

```
function longestCommonPrefix(strs):
    if strs is empty:
        return ""
    for i from 0 to length of strs[0]:
        char = strs[0][i]
        for each string in strs:
            if string[i] != char:
                return strs[0][:i]
    return strs[0]
```

## 時間與空間複雜度

- **時間複雜度**：O(S)，其中 S 是所有字串中字符的總數。最壞情況下，我們需要遍歷所有字串的每個字符。
- **空間複雜度**：O(1)，我們只使用常數空間來儲存變數。

## 範例程式碼（JavaScript + JSDoc）

```js livecodes

/**
 * 找出字串陣列中的最長公共前綴
 * @param {string[]} strs - 字串陣列
 * @return {string} 最長公共前綴
 */
function longestCommonPrefix(strs) {
    if (strs.length === 0) {
        return "";
    }
    for (let i = 0; i < strs[0].length; i++) {
        const char = strs[0][i];
        for (let j = 1; j < strs.length; j++) {
            if (i === strs[j].length || strs[j][i] !== char) {
                return strs[0].slice(0, i);
            }
        }
    }
    return strs[0];
}

```

