import { cp, mkdir, readFile, access } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
const html = await readFile('dist/index.html', 'utf8');
for (const match of html.matchAll(/(?:src|href)="(\/[^"?#]+)"/g)) {
  await access(`dist${match[1]}`);
}
console.log('Built landing page; all local HTML assets exist.');
