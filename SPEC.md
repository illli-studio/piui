# PiUI - 视频封面制作工具

## 1. Project Overview

**Project Name:** PiUI  
**Type:** Web Application (React + Vite)  
**Core Functionality:** A video cover creation tool similar to Canva, featuring multiple size presets and AI-powered cover generation via pi agent.  
**Target Users:** Content creators, video producers, social media managers

## 2. UI/UX Specification

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Header (Logo + Title + Export Button)                      │
├────────────┬────────────────────────────┬──────────────────┤
│            │                            │                   │
│  Sidebar   │      Canvas Area           │   Properties     │
│  (Sizes +  │      (Cover Editor)        │   Panel          │
│   Templates│                            │   (Layers,       │
│   + AI)    │                            │    Styles)       │
│            │                            │                   │
└────────────┴────────────────────────────┴──────────────────┘
```

- **Header:** 60px height, fixed
- **Sidebar:** 280px width, collapsible
- **Canvas:** Flexible, centered
- **Properties Panel:** 300px width, collapsible

### Responsive Breakpoints
- Desktop: >= 1200px (full layout)
- Tablet: 768px - 1199px (collapsed panels)
- Mobile: < 768px (stacked layout, simplified)

### Visual Design

#### Color Palette
- **Background Dark:** #0D0D0F
- **Surface:** #18181B
- **Surface Elevated:** #27272A
- **Border:** #3F3F46
- **Primary:** #F97316 (Vibrant Orange)
- **Primary Hover:** #FB923C
- **Accent:** #22D3EE (Cyan)
- **Text Primary:** #FAFAFA
- **Text Secondary:** #A1A1AA
- **Text Muted:** #71717A
- **Success:** #22C55E
- **Error:** #EF4444

#### Typography
- **Font Family:** "Outfit" (headings), "DM Sans" (body)
- **Headings:** 
  - H1: 32px, 700 weight
  - H2: 24px, 600 weight
  - H3: 18px, 600 weight
- **Body:** 14px, 400 weight
- **Small:** 12px, 400 weight

#### Spacing System
- Base unit: 4px
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px

#### Visual Effects
- Border radius: 8px (small), 12px (medium), 16px (large)
- Shadows: 
  - Subtle: 0 2px 8px rgba(0,0,0,0.3)
  - Elevated: 0 8px 32px rgba(0,0,0,0.5)
- Transitions: 200ms ease-out (default), 300ms ease-out (complex)
- Glassmorphism on panels: backdrop-filter: blur(12px)

### Components

#### Size Presets Panel
- Grid of preset cards (2 columns)
- Each card shows: name, dimensions, preview icon
- Presets:
  - YouTube Thumbnail (1280x720)
  - Instagram Post (1080x1080)
  - TikTok Cover (1080x1920)
  - Story (1080x1920)
  - Facebook Cover (820x312)
  - Twitter Header (1500x500)
  - Custom (user-defined)

#### Canvas Editor
- Zoomable canvas (25% - 400%)
- Pan with middle mouse / space+drag
- Grid snap (optional)
- Rulers (optional)
- Selection handles with rotation

#### Layers Panel
- Layer list with drag reorder
- Visibility toggle (eye icon)
- Lock toggle (lock icon)
- Layer types: Text, Image, Shape, AI Generated

#### Properties Panel
- Context-sensitive (shows relevant props for selected element)
- Position (X, Y), Size (W, H)
- Rotation, Opacity
- Fill color, Stroke
- Typography (for text): Font, Size, Weight, Line Height

#### AI Agent Panel
- Text input for describing desired cover
- "Generate" button with loading state
- Preview of generated result
- "Apply to Canvas" button

#### Export Modal
- Format selection: PNG, JPG, SVG, PDF
- Quality slider (for JPG)
- Export button with progress

## 3. Functionality Specification

### Core Features

1. **Canvas Management**
   - Create new canvas with preset sizes
   - Resize canvas
   - Zoom and pan
   - Undo/Redo (Ctrl+Z / Ctrl+Shift+Z)

2. **Element Manipulation**
   - Add text elements
   - Add shapes (rect, circle, line, arrow)
   - Add images (upload, drag & drop)
   - Select, move, resize, rotate elements
   - Multi-select with Shift
   - Copy/Paste elements
   - Delete elements

3. **Element Styling**
   - Fill color (solid, gradient)
   - Stroke (color, width, style)
   - Shadow (color, blur, offset)
   - Opacity
   - Blend modes

4. **Text Editing**
   - Rich text formatting
   - Font selection (Google Fonts)
   - Text alignment
   - Line height, letter spacing

5. **AI Generation (pi agent)**
   - User describes desired cover
   - Agent generates code (HTML/CSS/Canvas) to render
   - Preview generated result
   - Apply to canvas as editable elements

6. **Templates**
   - Built-in template gallery
   - Save custom templates
   - Apply template to current canvas

7. **Export**
   - Export as PNG (default)
   - Export as JPG
   - Export as SVG
   - Copy to clipboard

### User Interactions

- **Double-click** text: Enter edit mode
- **Click** element: Select
- **Drag** element: Move
- **Drag** corner handles: Resize
- **Drag** rotation handle: Rotate
- **Delete** key: Remove selected
- **Ctrl+C/V**: Copy/Paste
- **Ctrl+Z/Y**: Undo/Redo
- **Ctrl+S**: Save project
- **Scroll**: Zoom canvas
- **Space+Drag**: Pan canvas

### Data Handling

- Project state stored in React context
- Local storage for auto-save
- Import/Export as JSON for project files

## 4. Acceptance Criteria

### Visual Checkpoints
- [ ] Dark theme with orange accent colors
- [ ] Glassmorphism effect on sidebar/panels
- [ ] Smooth transitions on all interactions
- [ ] Proper typography hierarchy
- [ ] Responsive layout works on tablet

### Functional Checkpoints
- [ ] Can create canvas with different presets
- [ ] Can add and manipulate text elements
- [ ] Can add and manipulate shapes
- [ ] Can upload and position images
- [ ] Can select, move, resize, rotate elements
- [ ] Undo/Redo works correctly
- [ ] AI generation produces visible output
- [ ] Export produces valid image files

### Performance
- [ ] Canvas renders smoothly at 60fps
- [ ] No lag when manipulating elements
- [ ] AI generation completes within 10 seconds
