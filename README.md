
# Markdown 转 Word 格式转换器

## 项目简介

本项目是一个支持自定义样式的 Markdown 转 Word 富文本格式转换工具。用户可输入 Markdown 文本，并为一级标题、二级标题、三级标题和正文分别设置字体、字号、加粗等样式，一键复制为可直接粘贴到 Word 并保留格式的内容。

## 功能特性

- 支持常见 Markdown 语法（标题、列表、代码块、表格等）
- 实时预览 Markdown 渲染效果
- 分别为一级、二级、三级标题和正文设置字体、字号、加粗
- 支持字体：Arial、Times New Roman、微软雅黑、宋体
- 支持字号：10、12、14、16、18、20、24、28、32
- 一键“复制为 Word 格式”，粘贴到 Word 后样式与设置一致
- “恢复默认”按钮，快速还原样式
- 现代化苹果风格 UI，响应式设计

## 安装与运行

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

浏览器访问 [http://localhost:5173](http://localhost:5173)（端口号以实际输出为准）。

## 使用说明

1. 在左侧输入框粘贴或输入 Markdown 文本。
2. 在“样式设置”区域，为一级标题、二级标题、三级标题和正文分别选择字体、字号、加粗。
3. 可点击“恢复默认”按钮还原样式。
4. 右侧实时预览 Markdown 渲染效果。
5. 点击“复制为 Word 格式”按钮。
6. 在 Word 文档中粘贴（Ctrl+V / Cmd+V），即可保留所选样式。

## 技术栈

- React 18 + TypeScript
- Vite
- Material UI (MUI)
- marked（Markdown 解析）
- react-markdown（预览）
- Clipboard API

## 常见问题

### 1. 粘贴到 Word 后格式不对怎么办？
- 请确保使用“复制为 Word 格式”按钮复制，直接粘贴即可，无需特殊操作。
- 如遇字体未生效，请确认 Word 支持该字体。

### 2. 为什么不能直接粘贴 Markdown 格式？
- 粘贴时会自动以纯文本方式粘贴，避免格式错乱。

### 3. 支持哪些 Markdown 语法？
- 标题、列表、代码块、表格、加粗、斜体、引用等常见语法均支持。

## 贡献与反馈

如有建议或 bug，欢迎到 993946638@qq.com 提出

---

如需英文版或有其他定制需求，请告知！
