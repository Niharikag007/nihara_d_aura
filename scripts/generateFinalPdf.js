import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const MD_PATH = path.resolve('RESPONSIVE_DESIGN_AUDIT_REPORT_FINAL.md');
const PDF_PATH = path.resolve('RESPONSIVE_DESIGN_AUDIT_REPORT_FINAL.pdf');

async function generateFinalPdf() {
  console.log('Generating FINAL PDF from markdown report...');
  const mdContent = fs.readFileSync(MD_PATH, 'utf-8');

  const lines = mdContent.split('\n');
  let htmlBody = '';
  let inTable = false;

  for (let line of lines) {
    if (line.startsWith('# ')) {
      htmlBody += `<h1 class="text-3xl font-serif font-bold text-[#855F14] border-b-2 border-[#DFBC77] pb-2 my-4">${line.slice(2)}</h1>`;
    } else if (line.startsWith('## ')) {
      htmlBody += `<h2 class="text-2xl font-serif font-bold text-[#1C1917] mt-6 mb-2 border-b border-stone-200 pb-1">${line.slice(3)}</h2>`;
    } else if (line.startsWith('### ')) {
      htmlBody += `<h3 class="text-lg font-serif font-bold text-[#A87D17] mt-4 mb-2">${line.slice(4)}</h3>`;
    } else if (line.startsWith('|')) {
      if (!inTable) {
        htmlBody += '<table class="w-full text-xs border-collapse my-4 border border-stone-300"><tbody>';
        inTable = true;
      }
      if (line.includes('---')) continue;
      const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      htmlBody += '<tr class="border-b border-stone-200">';
      for (const c of cells) {
        htmlBody += `<td class="p-2 border border-stone-200">${c.trim()}</td>`;
      }
      htmlBody += '</tr>';
    } else {
      if (inTable) {
        htmlBody += '</tbody></table>';
        inTable = false;
      }
      if (line.startsWith('- ')) {
        htmlBody += `<li class="text-xs text-stone-700 ml-4 list-disc my-1">${line.slice(2)}</li>`;
      } else if (line.startsWith('```')) {
        // Skip code fence markers or wrap them
      } else if (line.trim().length > 0) {
        htmlBody += `<p class="text-xs text-stone-700 my-2 leading-relaxed">${line}</p>`;
      }
    }
  }
  if (inTable) htmlBody += '</tbody></table>';

  const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Final Responsive Design Audit Report - Nihara D Aura</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page { margin: 20mm 15mm; size: A4 portrait; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    table { page-break-inside: auto; }
    tr { page-break-inside: avoid; page-break-after: auto; }
    h1, h2, h3 { page-break-after: avoid; }
  </style>
</head>
<body class="p-6 text-stone-800 bg-white">
  ${htmlBody}
</body>
</html>`;

  const tempHtmlPath = path.resolve('temp_final_report.html');
  fs.writeFileSync(tempHtmlPath, fullHtml);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.goto(`file://${tempHtmlPath}`, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: PDF_PATH,
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }
  });

  await browser.close();
  if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath);
  console.log(`FINAL PDF successfully generated: ${PDF_PATH}`);
}

generateFinalPdf().catch(console.error);
