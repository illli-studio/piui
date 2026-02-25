# PiUI 升级任务 - 第一批

## 项目路径
~/.openclaw/workspace/piui

## 技术栈
React + Vite + TypeScript

## 当前问题
- 没有样式，页面很乱
- 需要全面升级

## 任务 1: 创建 CSS 变量文件

在 src/styles/variables.css 中创建以下内容：

```css
:root {
  /* Colors - Dark Theme */
  --color-bg: #0D0D0F;
  --color-surface: #18181B;
  --color-surface-elevated: #27272A;
  --color-border: #3F3F46;
  
  /* Primary Colors */
  --color-primary: #F97316;
  --color-primary-hover: #FB923C;
  --color-accent: #22D3EE;
  
  /* Text Colors */
  --color-text-primary: #FAFAFA;
  --color-text-secondary: #A1A1AA;
  --color-text-muted: #71717A;
  
  /* Status Colors */
  --color-success: #22C55E;
  --color-error: #EF4444;
  --color-warning: #F59E0B;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  
  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  
  /* Shadows */
  --shadow-subtle: 0 2px 8px rgba(0,0,0,0.3);
  --shadow-elevated: 0 8px 32px rgba(0,0,0,0.5);
  
  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-default: 200ms ease-out;
  --transition-slow: 300ms ease-out;
  
  /* Layout */
  --header-height: 60px;
  --sidebar-width: 280px;
  --properties-width: 300px;
}
```

## 任务 2: 更新 src/index.css

引入变量文件并设置全局样式：

```css
@import './styles/variables.css';
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--color-bg);
  color: var(--color-text-primary);
  font-family: 'DM Sans', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Outfit', sans-serif;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
}

input, textarea {
  font-family: inherit;
}
```

## 任务 3: 更新 App.tsx 布局

添加 className 来应用样式。修改 App.tsx 中的布局：

- 主容器添加 className="app"
- main 区域添加 className="main-layout"
- Header 组件会自动应用样式

## 完成后

1. 运行 `npm run dev` 测试
2. 确认样式正常显示
3. git commit + push

开始执行！
