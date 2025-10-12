# UmaFan 静态仪表盘

UmaFan 是一个基于 **Vue 3 + Vite + Tailwind CSS** 的前端单页应用，用来展示《赛马娘 Pretty Derby》国服圈子粉丝的历史快照。项目完全运行在浏览器端，利用静态 JSON 数据生成圈子概览、成员排行榜与粉丝趋势图表，适合部署到任意静态托管平台（GitHub Pages、Vercel、OSS 等）。

> 这个子仓库源自 `muxuel-blog`，在这里我们将 UmaFan 仪表盘拆分出来，方便独立维护与部署。

## ✨ 核心功能

- **多圈子切换**：自动扫描 `src/umafan/data` 下的 JSON 文件并提取圈子信息，进入仪表盘即可选择目标圈子。
- **日期范围分析**：支持按起止日期筛选粉丝快照，也提供「最近 3/7/14/30 天」快速范围按钮。
- **关键指标卡片**：展示所选区间的总粉丝增长、当日新增以及活动状态提示。
- **双轴图表**：使用 ECharts 可视化累积粉丝与每日新增趋势，并随筛选条件实时刷新。
- **成员排行榜**：按粉丝增长量降序列出圈内成员，包含初末粉丝、增长、备注等字段。
- **主题与视觉效果**：提供暗/亮主题切换、粒子背景（Ballpit）与多种动画过渡，保持良好的视觉沉浸体验。
- **移动端优化**：组件布局、图表与触控交互均针对手机做了响应式调整。

## 📁 目录结构

```
├─ src
│  ├─ components           # 仪表盘组件、通用 UI 组件（Button、RippleGrid 等）
│  ├─ router               # Vue Router 配置（首页 / 仪表盘）
│  ├─ umafan
│  │  ├─ data              # 静态粉丝快照 JSON 文件（构建时自动打包）
│  │  └─ dataLoader.ts     # 数据解析、统计、图表与排行榜构建逻辑
│  └─ views                # HOME 与 UmaDashBoard 页面
├─ public                  # 静态资源与站点图标
├─ dist                    # 构建产物（运行 `npm run build` 后生成）
└─ vite.config.ts          # Vite 配置
```

## 🚀 快速开始

### 环境要求

- Node.js ≥ 18
- npm（随 Node.js 一同安装）

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

Vite 默认会在 `http://localhost:5173` 启动开发服务器，支持热更新。

### 类型检查（可选）

项目使用 TypeScript，你可以在构建前手动运行类型检查：

```bash
npx vue-tsc --noEmit
```

## 🏗️ 构建与部署

构建前请确保依赖已安装：

```bash
npm run build
```

命令会先执行 `vue-tsc -b` 进行类型检查，再调用 `vite build` 生成静态资源。产物位于 `dist/` 目录，直接上传到任意静态托管平台即可。

如果需要在本地预览构建结果：

```bash
npm run preview
```

## 📊 数据格式与扩展

仪表盘的全部统计都来自 `src/umafan/data` 目录下的静态文件。每个文件以日期命名（`YYYYMMDD.json`），内容为以玩家 `viewer_id` 作为键的对象，例如：

```json
{
  "121130161": {
    "name": "海老冢智",
    "fan": 841639348,
    "circle_name": "魔結社2会",
    "ts": "20251001",
    "viewer_id": 121130161,
    "comment": "死了",
    "rank_score": 10505837,
    "circle_id": 391405678
  }
}
```

添加新数据的步骤：

1. 在 `src/umafan/data/` 中新增 `YYYYMMDD.json` 文件，保持字段结构一致。
2. 每条记录必须包含 `fan`、`circle_id`、`viewer_id`，其余字段可选但会用于 UI 展示（如 `name`、`comment`）。
3. 运行 `npm run dev` 或重新构建，Vite 的 `import.meta.glob` 会自动收集所有文件并生成新圈子、日期选项。
4. 构建后的站点仍旧是纯静态的，所有统计（总量、差值、图表）都在浏览器端完成。

## 🧰 技术栈

- [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 7](https://vitejs.dev/) 构建工具
- [Tailwind CSS 4](https://tailwindcss.com/) 与 `tailwind-merge` 做样式管理
- [ECharts 6](https://echarts.apache.org/) 绘制粉丝趋势图
- [VueUse](https://vueuse.org/) 提供响应式工具（如主题切换）
- 自定义 Three.js/OGL 粒子背景与 GSAP 动画增强交互体验

## 🙌 致谢

- 仪表盘设计灵感与数据结构来自原 `muxuel-blog` 项目。
- 特别感谢圈子成员与粉丝的支持，以及伊邪那マリカさん提供的创意协助。

欢迎 fork/issue，共同完善 UmaFan！

## 🤝 如何提交你的更改？

如果你想把文档或代码修改贡献回仓库，可以按照以下流程操作：

1. **拉取最新代码**：确保本地仓库已经与远端同步。
   ```bash
   git pull origin main
   ```
2. **新建分支并进行修改**：
   ```bash
   git checkout -b docs/update-readme
   # 在此分支内编辑 README 或其他文件
   ```
3. **查看并提交变更**：
   ```bash
   git status        # 查看改动的文件
   git add README.md # 将文件加入暂存区
   git commit -m "docs: refine README instructions"
   ```
4. **推送到远端并创建 PR**：
   ```bash
   git push origin docs/update-readme
   ```
   然后在仓库页面点击「Compare & pull request」，填写说明后提交。

如果你没有直接推送权限，也可以先 fork 仓库，再按上述步骤在自己的远端仓库上推送并发起 Pull Request。
