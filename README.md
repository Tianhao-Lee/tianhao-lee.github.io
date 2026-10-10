# Tianhao Li 学术主页

基于 [PRISM](https://github.com/xyjoey/PRISM) 构建的学术个人主页 V0.3。项目使用 Next.js 15、Tailwind CSS 4 和 TypeScript，默认语言为英文、默认主题为浅色，可切换中文和深色模式。

## 本地运行

环境要求：Node.js 22 或更高版本。

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:3000`。

静态构建：

```bash
npm run build
```

构建结果位于 `out/`，用于 GitHub Pages。

## 修改个人信息

- 站点、作者和社交链接：`content/config.toml`
- 中文站点、作者和导航：`content_zh/config.toml`
- 首页结构与研究兴趣：`content/about.toml`
- 首页简介：`content/bio.md`
- 研究页面：`content/research.toml` 和 `content/research.md`
- CV 页面：`content/cv.toml` 和 `content/cv.md`
- 新闻：`content/news.toml`；没有已核实内容时保持为空，首页会自动隐藏 News

头像当前使用 `public/avatar.webp`，由用户提供的证件照裁剪生成并移除 EXIF。替换头像时，把正式图片放入 `public/`，再更新 `content/config.toml` 的 `author.avatar`。

## 添加和维护论文

网站和首页精选论文都读取同一份文件：`content/publications.bib`。

- 完整论文列表自动读取所有 BibTeX 条目。
- 首页精选论文只显示带 `selected = {true}` 的条目。`selected_order` 用于固定人工精选顺序，不受元数据排序影响。
- `description` 可添加简洁说明。
- `preview` 可添加论文方法图或缩略图；图片放在 `public/papers/`，字段只写文件名，例如 `preview = {my-paper.png}`。
- BibTeX 中的人工字段是该论文展示状态的唯一来源。
- `slug` 决定论文详情页的内部路径。

自动元数据快照位于 `data/publications/orcid-works.json`：

```bash
npm run sync:metadata
```

该命令只从 ORCID 获取论文，并用 Crossref 校验作者、标题、年份和 DOI，不会覆盖 `content/publications.bib`。以后接入 OpenAlex 或 GitHub Actions 时，建议按规范化 DOI 去重，并始终保留 BibTeX 中已有的 `selected`、`preview`、`description`、`pdfUrl` 和 `code` 字段。

## 论文详情页与资源核查

论文详情页位于 `/publications/<slug>/`，由 `content/publications.bib` 和 `content/publication-details.json` 在构建时自动生成，不需要为每篇论文复制 React 页面。

- `content/publication-details.json` 保存研究动机、方法、贡献、结果、摘要、图片许可和内容核实状态。
- `contentBasis` 区分 `full-text`、`abstract` 和 `metadata-only`，不会把仅元数据内容标记为已完整核实。
- `preview` 对应的真实图片存放在 `public/papers/`。没有可靠图片时使用明确的文字型文献封面。
- `pdf_url` 和 `code` 只有在链接真实有效时才显示。

重新生成论文资源核查报告：

```bash
npm run report:publications
```

报告输出到 `docs/publication-resource-audit.md`。

从本地 PDF 重新提取方法图：

```bash
npm run extract:figures
```

脚本先定位 Figure 标题，再取标题上方面积最大的图形簇，并将该页面区域按 300 DPI 渲染导出。不单独导出嵌入位图：部分出版社会把图像压平后置于矢量文字之下，只取嵌入图像会丢失全部标注。源 PDF 默认读取 `../temple_paper`，可用 `PDF_DIR` 环境变量覆盖。

## 部署到 GitHub Pages

目标地址：`https://tianhao-lee.github.io/`。由于仓库名是 `tianhao-lee.github.io`，使用用户主页根路径，无需设置 `basePath`。

`.github/workflows/deploy.yml` 已配置静态构建、生成 `out/.nojekyll` 并上传 Pages artifact。当前工作流仅支持手动触发，确认页面效果后，再在 GitHub 仓库中启用 Pages 和运行工作流。

不要在自动同步脚本中直接覆盖 `content/publications.bib`。新增论文应先核对作者身份，尤其注意 `Tianhao Li` 同名作者问题。

## 上游与许可

PRISM 原始说明保留在 `README_PRISM.md` 和 `README_PRISM_cn.md`。项目继续遵循原项目的 MIT License，详见 `LICENSE`。
