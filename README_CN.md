# PiUI - AI 视频封面制作工具

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-7-purple?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

> 一个强大的 AI 驱动的视频封面制作工具，类似 Canva。为 YouTube、Instagram、TikTok 等平台创建精美的封面，支持智能 AI 生成。

[English](./README.md) | [中文](./README_CN.md)

## ✨ 功能特性

### 🎨 画布编辑器
- **多种尺寸预设** - YouTube 缩略图、Instagram 帖子、TikTok 封面、故事、Facebook 封面、Twitter 头图
- **智能缩放和平移** - 缩放范围 10%-400%，空格+拖拽平移
- **撤销/重做** - 完整历史支持，Ctrl+Z / Ctrl+Shift+Z

### 🖱️ 元素操作
- **添加元素** - 文本、矩形、圆形形状
- **图片上传** - 拖放或点击上传
- **选择和移动** - 点击选择，拖拽移动
- **调整大小** - 8个控制手柄（角落+边缘）精确调整大小
- **旋转** - 拖拽旋转手柄自由旋转
- **多选** - Shift+点击选择多个元素

### 🎭 文本编辑
- **字体选择** - 9种精美字体（Outfit、DM Sans、Inter、Poppins 等）
- **字重** - Light、Regular、Medium、Semi Bold、Bold
- **文本对齐** - 左对齐、居中、右对齐
- **字体样式** - 正常、斜体
- **颜色选择器** - 完整的颜色选择

### 🌈 样式
- **纯色填充** - 形状的纯色填充
- **渐变填充** - 线性渐变和径向渐变，角度可控
- **描边** - 边框颜色和宽度
- **阴影** - 颜色、模糊、偏移控制
- **透明度** - 调整元素透明度

### 🤖 AI 生成
- **智能模板** - 自动检测场景类型（YouTube、Instagram、Quote、Sale、TikTok）
- **配色方案** - 10种预设计配色（科技、霓虹、极简、游戏、自然等）
- **渐变背景** - 美观的渐变背景
- **装饰元素** - AI 添加的装饰圆形和形状
- **MiniMax API 支持** - 可选 API 密钥用于高级 AI 生成

### 💾 项目管理
- **保存项目** - 保存到本地存储
- **加载项目** - 从已保存项目加载
- **导出 JSON** - 导出项目为 JSON 文件
- **导入 JSON** - 从 JSON 文件导入项目

### 📤 导出选项
- **导出 PNG** - 高质量 PNG
- **导出 JPG** - 压缩 JPG
- **复制到剪贴板** - 一键复制到剪贴板

### ⌨️ 键盘快捷键
| 快捷键 | 操作 |
|--------|------|
| Ctrl+Z | 撤销 |
| Ctrl+Shift+Z | 重做 |
| Delete / Backspace | 删除选中 |
| Ctrl+C | 复制选中元素 |
| Ctrl+V | 粘贴元素 |
| Ctrl+D | 复制选中元素 |

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装

```bash
# 克隆仓库
git clone https://github.com/illli-studio/piui.git

# 进入项目目录
cd piui

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 生产环境构建

```bash
npm run build
```

构建后的文件在 `dist` 目录中。

## 🖥️ 使用指南

### 创建新封面

1. **选择画布尺寸** - 从侧边栏选择预设（YouTube、Instagram、TikTok 等）
2. **添加元素** - 点击文本、矩形或圆形工具，然后在画布上点击
3. **上传图片** - 点击图片上传按钮或拖放
4. **编辑元素** - 选择元素后在右侧面板编辑属性
5. **使用 AI** - 在 AI 生成器面板描述想要的封面

### 编辑元素

- **选择** - 点击元素
- **移动** - 拖拽选中的元素
- **调整大小** - 拖拽角落/边缘控制手柄
- **旋转** - 拖拽元素上方的旋转手柄
- **编辑文本** - 双击文本元素
- **删除** - 按 Delete 键或点击属性面板中的删除按钮

### 使用 AI 生成器

1. 在 AI 生成器文本区域输入描述
2. 点击 "Generate with AI"
3. 示例：
   - "Dark tech YouTube thumbnail with neon accents"（科技感 YouTube 缩略图）
   - "Minimalist quote graphic"（极简引言图）
   - "Bold sale banner with discount badges"（醒目促销横幅）

### 保存和加载

- **保存** - 点击保存按钮，输入项目名称
- **加载** - 点击加载按钮，从已保存项目中选择
- **导出 JSON** - 保存项目为 JSON 文件备份
- **导入 JSON** - 从 JSON 文件加载项目

## 📁 项目结构

```
piui/
├── public/              # 静态资源
├── src/
│   ├── components/     # React 组件
│   │   ├── AIGenerator.tsx    # AI 生成面板
│   │   ├── Canvas.tsx         # 主画布编辑器
│   │   ├── Header.tsx         # 顶部操作栏
│   │   ├── LayersPanel.tsx   # 图层管理
│   │   ├── PropertiesPanel.tsx # 元素属性
│   │   ├── ProjectManager.tsx # 项目保存/加载
│   │   └── Sidebar.tsx       # 工具和模板
│   ├── data/
│   │   └── templates.ts       # 内置模板
│   ├── hooks/
│   │   └── useCanvas.ts      # 画布状态管理
│   ├── services/
│   │   └── aiService.ts      # AI 生成服务
│   ├── types.ts              # TypeScript 类型定义
│   ├── App.tsx              # 主应用组件
│   └── App.css              # 样式
├── package.json
├── vite.config.ts
└── README.md
```

## 🛠️ 技术栈

- **React 19** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Framer Motion** - 动画
- **Lucide React** - 图标
- **UUID** - 唯一 ID

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

## 📝 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE)。

## 🙏 致谢

- [Unsplash](https://unsplash.com/) - 示例图片
- [Google Fonts](https://fonts.google.com/) - 字体
- [MiniMax AI](https://api.minimaxi.com/) - AI 生成 API

---

<p align="center">由 <a href="https://github.com/illli-studio">illli Studio</a> 用 ❤️ 制作</p>
