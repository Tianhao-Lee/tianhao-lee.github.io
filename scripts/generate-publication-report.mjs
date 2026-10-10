import fs from 'node:fs/promises';

const details = JSON.parse(await fs.readFile('content/publication-details.json', 'utf8')).papers;
const metadata = JSON.parse(await fs.readFile('data/publications/orcid-works.json', 'utf8')).works;
const metadataByDoi = new Map(metadata.map((paper) => [paper.doi.toLowerCase(), paper]));
const statusLabel = { 'full-text': '已核对全文', abstract: '基于可靠摘要', 'metadata-only': '仅元数据' };

const lines = [
  '# V0.3 论文资源核查报告',
  '',
  `生成时间：${new Date().toISOString()}`,
  '',
  '本报告区分全文核对、摘要依据和仅元数据三种状态。未确认再发布许可的图片没有放入网站。',
  '',
];

for (const [index, detail] of details.entries()) {
  const paper = metadataByDoi.get(detail.doi.toLowerCase());
  lines.push(`## ${index + 1}. ${paper?.title || detail.id}`);
  lines.push('');
  lines.push(`- DOI：${detail.doi}`);
  lines.push(`- 取得 PDF：${detail.audit.pdfAcquired ? '是' : '否'}`);
  lines.push(`- 取得可展示真实方法图：${detail.audit.imageAcquired ? '是' : '否'}`);
  lines.push(`- 图片来源：${detail.audit.imageFigure || '无'}`);
  lines.push(`- 图片许可：${detail.audit.imagePermission || '不适用/未确认，未展示'}`);
  lines.push(`- 论文介绍：${statusLabel[detail.contentBasis]}`);
  lines.push(`- 内容核实依据：${detail.audit.evidence}`);
  lines.push(`- 尚缺材料：${detail.audit.missing.length ? detail.audit.missing.join('；') : '无'}`);
  lines.push('');
}

lines.push('## 资源统计');
lines.push('');
lines.push(`- 论文总数：${details.length}`);
lines.push(`- 全文核对：${details.filter((item) => item.contentBasis === 'full-text').length}`);
lines.push(`- 摘要依据：${details.filter((item) => item.contentBasis === 'abstract').length}`);
lines.push(`- 仅元数据：${details.filter((item) => item.contentBasis === 'metadata-only').length}`);
lines.push(`- 真实配图：${details.filter((item) => item.audit.imageAcquired).length}`);
lines.push(`- PDF：${details.filter((item) => item.audit.pdfAcquired).length}`);
lines.push('');

await fs.writeFile('docs/publication-resource-audit.md', `${lines.join('\n')}\n`, 'utf8');
console.log(`Wrote report for ${details.length} publications`);