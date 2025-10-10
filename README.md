## UmaFan 静态仪表盘

这个子项目把原先 `muxuel-blog` 里的 UmaFan 仪表盘独立出来，保持 Vue 3 + Vite + Tailwind 技术栈，完全前端运行，适合部署到任意静态空间（如 GitHub Pages、Vercel、FunctionCat、OSS 等）。

### 目录结构

- `src/umafan/data`：静态 JSON 数据文件。只要新增 `YYYYMMDD.json` 文件并保持原有字段结构，构建后即可被自动加载。
- `src/components`：UmaFan 仪表盘与图表组件，以及复用的 UI Button 组件。
- `src/lib/utils.ts`：Tailwind class 合并工具。
- `public/`：静态资源与站点图标。

### 开发

```bash
npm install
npm run dev
```

### 构建

```bash
npm run build
```

生成的 `dist/` 目录即可直接上传到静态服务器进行部署。

### 自定义数据

1. 将新的圈子粉丝快照放入 `src/umafan/data/`。
2. 文件名使用日期（例如 `20251012.json`）。
3. 字段格式与原始数据一致，`import.meta.glob` 会在构建时自动打包。

构建完成后，浏览器端会根据所选圈子与时间范围即时计算增长趋势，无需后端服务。
