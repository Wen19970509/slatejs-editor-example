### 使用方式
<br/>Slate + NextJS 範本，使用TailwindCSS 進行Style制定
```
    npm ci  //安裝


    npm run dev //執行
```
## SlateJS Editor Example


[線上Demo](https://slate-editor.netlify.app/)


編輯器使用`SlateJS`進行撰寫，目前已完成功能有：

## 左側功能列：

- Heading類型限制 text style 使用
- 內文`H2`大標
- 內文`H3`小標
- `blockquote` 引言
- 數字列表、無數字列表
- 圖片插入：URL 插入、本地圖片上傳
- 圖片插入時強制輸入alt，圖片提供刪除與修改alt按鈕
- 客製區塊插入


## 反白功能列(控制所選文字)：

- 粗體 (快捷鍵：`ctrl/cmd + b`)
- 斜體 (快捷鍵：`ctrl/cmd + i`)
- 底線 (快捷鍵：`ctrl/cmd + u`)
- `Code` (快捷鍵：`ctrl/cmd` +  ` )
- 刪除線
- 超連結新增
- 超連結移除
- 反白功能列依照所屬區塊型態進行限制

##快捷鍵(HotKey)說明：

- `shift + Enter` - soft break
- `Enter` - 列表型態時無內容自動回復為default
- `Enter` - 標題型態斷行時不繼承，回復為default
- `ctrl/cmd + Backspace` - 刪除整個區塊 
- `Backspace` - 段落內無文字時，會先清除樣式再刪除段落