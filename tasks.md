# UmaFan 优化与重构计划

本文档列出了 UmaFan 项目的详细优化建议、实现流程以及 UI 重构方案。

## 📅 阶段一：基础修复与代码质量 (P0 - 立即执行) ✅

这些修改旨在修复明显的错误并提升代码的可维护性，不会大幅改变视觉效果。

### 1. 修复路由与命名错误 ✅
- [x] **路由路径修正**：将 `src/router/index.ts` 中的 `/dashiboard` 修正为 `/dashboard`。
- [x] **组件重命名**：将 `src/components/UmaDashiboard.vue` 重命名为 `UmaDashboard.vue`，并更新所有引用。
- [x] **链接更新**：更新 `HOME.vue` 和 `UmaDashBoard.vue` 中的 `router-link`。

### 2. 代码清理 ⚠️
- [x] **CSS 去重**：清理 `src/index.css` 中重复定义的 `@keyframes` 和 `@layer base`。
- [ ] **类型修复**：修复 `UmaDataChart.vue` 中 ECharts 配置的类型警告（如 `interval: 'auto'` 的类型问题）。
- [ ] **CSS 文件修复**：修复 `src/index.css` 中的重复内容（当前存在问题）。

### 3. 安全性增强
- [ ] **外链安全**：为所有 `target="_blank"` 的链接添加 `rel="noopener noreferrer"`。

---

## 🚀 阶段二：性能与体验优化 (P1 - 本周完成)

### 1. 性能优化
- [ ] **路由懒加载**：
  ```typescript
  component: () => import('@/views/UmaDashBoard.vue')
  ```
- [ ] **Element Plus 按需引入**：移除全局 CSS 引入，配置 `unplugin-vue-components` 和 `unplugin-auto-import` 以减小打包体积。
- [ ] **粒子效果优化**：根据设备性能（如检测 FPS 或设备类型）动态调整粒子数量，移动端减少至 100-150。

### 2. 用户体验 (UX)
- [ ] **骨架屏 (Skeleton)**：在数据加载（`initializing` 状态）时，展示布局骨架屏而非简单的文字提示。
- [ ] **错误处理**：设计更友好的错误提示组件，提供"重试"按钮。
- [ ] **交互反馈**：为按钮和卡片添加更细腻的 Hover 态和点击反馈（Ripple 效果）。

---

## 🎨 阶段三：UI 界面重构 (P2 - 核心重点) ✅

**核心目标**：以 `exp.vue` 为原型重构 `HOME.vue`，将项目从单一的仪表盘升级为综合性攻略站点，并应用 **Modern Glassmorphism (现代玻璃拟态)** 视觉风格。

### 1. 架构调整 ✅
- [x] **主页重构 (`HOME.vue`)**：
  - 废弃原有的简单 Landing Page 设计。
  - 采用 `exp.vue` 的 **Header + Content + Sidebar** 布局结构。
  - **Header**：包含 Logo、搜索栏、登录/收藏入口（响应式）。
  - **Content**：展示攻略/文章列表卡片（Grid 布局）。
  - **Sidebar**：包含筛选、排序、**常用工具（粉丝数据入口）**、活动预告等。

### 2. 视觉升级 (基于 exp.vue 结构) ✅
- [x] **全局风格定义**：
  - **背景**：替换 `exp.vue` 的浅灰背景 (`#f5f7fa`) 为 **深色动态背景** (深蓝/紫灰渐变 + 粒子效果)。
  - **容器质感**：将 `el-card` 和 Sidebar 区块改造为 **玻璃态面板** (Frosted Glass, `bg-white/5 backdrop-blur`)。
- [x] **组件样式改造**：
  - **导航栏 (Header)**：改为悬浮式玻璃导航，底部带微弱光边。
  - **攻略卡片**：
    - 去除默认边框，增加 Hover 时的上浮 (`-translate-y-1`) 和 霓虹光晕 (`shadow-[0_0_20px_rgba(...)]`)。
    - 图片占位区使用渐变色或骨架屏动画。
  - **侧边栏工具**：
    - "粉丝数据查询"入口作为视觉焦点，使用高亮色（如赛马娘主题绿/粉）和图标强调。

### 3. 具体开发任务 ✅
- [x] **布局迁移**：将 `exp.vue` 的 Template 和 Script 逻辑迁移至 `src/views/HOME.vue`。
- [x] **样式替换**：移除 `exp.vue` 中的原生 CSS，全面替换为 Tailwind CSS 工具类。
- [x] **路由整合**：确保侧边栏的"粉丝数据查询"按钮正确跳转至 `/dashboard`。
- [x] **响应式适配**：保留并优化 `exp.vue` 中的 `hidden-xs-only` 等响应式逻辑，确保移动端 Drawer 菜单体验流畅。

---

## 📊 阶段四：Dashboard 重构 (P2 - 已完成) ✅

### 1. Dashboard 视觉统一 ✅
- [x] **背景统一**：应用与主页一致的深色粒子背景和氛围光晕。
- [x] **组件玻璃化**：
  - 控制面板、指标卡片、图表容器全部换上半透明磨砂玻璃质感。
  - 精致的边框和发光效果。
- [x] **深色模式适配**：
  - 重写 Element Plus 下拉框样式（使用 `!important` 强制覆盖）。
  - 优化 ECharts 图表配色（文字、坐标轴、Tooltip 等）。

### 2. 移动端体验优化 🚧
- [x] **底部悬浮按钮 (FAB)**：添加固定在右下角的"查数据"按钮，带脉冲动画和提示角标。
- [ ] **自定义选择框组件**：替换 Element Plus 的 `el-select`，手写符合网站风格的深色玻璃态选择框。
- [ ] **移动端横幅入口**：在 Header 下方增加醒目的 Banner 横幅。

---

## 📸 阶段五：静态资源管理 (待实施)

### 1. 攻略图片添加指南
**当前数据结构** (`HOME.vue` 第 179-189 行)：
```javascript
const guideList = ref([
  { 
    title: '短距离育成速通指南（2025版）', 
    time: 8, 
    category: '新手', 
    tags: ['#短距离', '#事件选择'] 
  },
  // ... 更多文章
])
```

**添加图片的步骤**：
1. 将图片文件放置到 `public/images/guides/` 目录（需创建）。
2. 在数据对象中添加 `image` 字段：
   ```javascript
   { 
     title: '短距离育成速通指南（2025版）',
     image: '/images/guides/short-distance-guide.jpg', // 新增
     time: 8,
     category: '新手',
     tags: ['#短距离', '#事件选择']
   }
   ```
3. 修改模板中的图片占位符，从 `bg-slate-800` 改为：
   ```vue
   <div 
     class="h-48 w-full rounded-t-2xl bg-cover bg-center"
     :style="{ backgroundImage: `url(${article.image || '/images/placeholder.jpg'})` }"
   ></div>
   ```

### 2. 待办事项
- [ ] 创建 `public/images/guides/` 目录。
- [ ] 准备占位图 `public/images/placeholder.jpg`。
- [ ] 更新 `guideList` 数据结构，添加 `image` 字段。
- [ ] 修改 `HOME.vue` 模板以显示图片。

---

## 🚫 暂不包含
- 国际化 (i18n) 支持
- SEO 深度优化
