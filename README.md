# PiUI - AI Video Cover Creator

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-7-purple?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

> A powerful AI-powered video cover creation tool similar to Canva. Create stunning covers for YouTube, Instagram, TikTok, and more with intelligent AI generation.

[English](./README.md) | [中文](./README_CN.md)

## ✨ Features

### 🎨 Canvas Editor
- **Multiple Size Presets** - YouTube Thumbnail, Instagram Post, TikTok Cover, Story, Facebook Cover, Twitter Header
- **Smart Zoom & Pan** - Zoom from 10% to 400%, pan with space+drag
- **Undo/Redo** - Full history support with Ctrl+Z / Ctrl+Shift+Z

### 🖱️ Element Manipulation
- **Add Elements** - Text, Rectangle, Circle shapes
- **Image Upload** - Drag & drop or click to upload
- **Select & Move** - Click to select, drag to move
- **Resize** - 8 handles (corners + edges) for precise resizing
- **Rotate** - Drag the rotation handle for free rotation
- **Multi-select** - Shift+click to select multiple elements

### 🎭 Text Editing
- **Font Selection** - 9 beautiful fonts (Outfit, DM Sans, Inter, Poppins, etc.)
- **Font Weight** - Light, Regular, Medium, Semi Bold, Bold
- **Text Alignment** - Left, Center, Right
- **Font Style** - Normal, Italic
- **Color Picker** - Full color selection

### 🌈 Styling
- **Solid Fill** - Solid color for shapes
- **Gradient Fill** - Linear and radial gradients with angle control
- **Stroke** - Border color and width
- **Shadow** - Color, blur, and offset controls
- **Opacity** - Adjust element transparency

### 🤖 AI Generation
- **Smart Templates** - Automatically detect scene type (YouTube, Instagram, Quote, Sale, TikTok)
- **Color Schemes** - 10 pre-designed color palettes (Tech, Neon, Minimal, Gaming, Nature, etc.)
- **Gradient Backgrounds** - Beautiful gradient backgrounds
- **Decorative Elements** - AI-added accent circles and shapes
- **MiniMax API Support** - Optional API key for advanced AI generation

### 🔧 AI Configuration

PiUI supports two modes for AI generation:

1. **Smart Templates (Default, No API Key Required)**
   - Works offline without any configuration
   - 10 beautiful color schemes
   - Multiple scene types (YouTube, Instagram, Quote, Sale, TikTok, etc.)
   - Auto-generates gradient backgrounds and decorative elements

2. **Advanced AI (Requires MiniMax API Key)**
   - Get your API key from: https://platform.minimaxi.com
   - Click "API Settings" in the AI panel
   - Enter your API key and click "Save Key"
   - More intelligent and customizable generation

### 💾 Project Management
- **Save Projects** - Save to local storage
- **Load Projects** - Load from saved projects
- **Export JSON** - Export project as JSON file
- **Import JSON** - Import project from JSON file

### 📤 Export Options
- **Export PNG** - High quality PNG
- **Export JPG** - Compressed JPG
- **Copy to Clipboard** - One-click copy to clipboard

### ⌨️ Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| Ctrl+Z | Undo |
| Ctrl+Shift+Z | Redo |
| Delete / Backspace | Delete selected |
| Ctrl+C | Copy selected elements |
| Ctrl+V | Paste elements |
| Ctrl+D | Duplicate selected |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/illli-studio/piui.git

# Navigate to project directory
cd piui

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🖥️ Usage Guide

### Creating a New Cover

1. **Select Canvas Size** - Choose from presets in the sidebar (YouTube, Instagram, TikTok, etc.)
2. **Add Elements** - Click on text, rectangle, or circle tools, then click on canvas
3. **Upload Images** - Click the image upload button or drag & drop
4. **Edit Elements** - Select an element to edit its properties in the right panel
5. **Use AI** - Describe your desired cover in the AI generator panel

### Editing Elements

- **Select** - Click on an element
- **Move** - Drag the selected element
- **Resize** - Drag the corner/edge handles
- **Rotate** - Drag the rotation handle above the element
- **Edit Text** - Double-click on text elements
- **Delete** - Press Delete key or click delete in properties panel

### Using AI Generator

1. Enter a description in the AI generator text area
2. Click "Generate with AI"
3. Examples:
   - "Dark tech YouTube thumbnail with neon accents"
   - "Minimalist quote graphic"
   - "Bold sale banner with discount badges"

### Saving & Loading

- **Save** - Click Save button, enter project name
- **Load** - Click Load button, select from saved projects
- **Export JSON** - Save project as JSON file for backup
- **Import JSON** - Load project from JSON file

## 📁 Project Structure

```
piui/
├── public/              # Static assets
├── src/
│   ├── components/     # React components
│   │   ├── AIGenerator.tsx    # AI generation panel
│   │   ├── Canvas.tsx         # Main canvas editor
│   │   ├── Header.tsx         # Header with actions
│   │   ├── LayersPanel.tsx   # Layers management
│   │   ├── PropertiesPanel.tsx # Element properties
│   │   ├── ProjectManager.tsx # Project save/load
│   │   └── Sidebar.tsx       # Tools & templates
│   ├── data/
│   │   └── templates.ts       # Built-in templates
│   ├── hooks/
│   │   └── useCanvas.ts      # Canvas state management
│   ├── services/
│   │   └── aiService.ts      # AI generation service
│   ├── types.ts              # TypeScript types
│   ├── App.tsx              # Main app component
│   └── App.css              # Styles
├── package.json
├── vite.config.ts
└── README.md
```

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **UUID** - Unique IDs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [Unsplash](https://unsplash.com/) - Sample images
- [Google Fonts](https://fonts.google.com/) - Typography
- [MiniMax AI](https://api.minimaxi.com/) - AI generation API

---

<p align="center">Made with ❤️ by <a href="https://github.com/illli-studio">illli Studio</a></p>
