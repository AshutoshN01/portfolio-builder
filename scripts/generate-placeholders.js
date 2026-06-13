import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const assetsDir = path.join(publicDir, 'assets');

// Create directories if they do not exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. 16x16 transparent favicon.ico base64 payload
const faviconIcoBase64 = 
  'AAABAAEAEBAAAAEAIABoQgAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAA' +
  'AAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP//' +
  '/wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP//' +
  '/wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP//' +
  '/wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP//' +
  '/wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP//' +
  '/wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP//' +
  '/wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP//' +
  '/wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP//' +
  '/wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP//' +
  '/wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP//' +
  '/wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP//' +
  '/wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP//' +
  '/wD///8A////AP///wD///8A////AP///wD///8A';

// 2. 1x1 transparent apple-touch-icon.png base64 payload
const appleTouchIconPngBase64 = 
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// 3. 1x1 transparent og-image.webp base64 payload
const ogImageWebpBase64 = 
  'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAPgAA3AAPi1yAPPP0AAL';

// 4. Minimal valid 1-page PDF file text
const resumePdfContent = 
  '%PDF-1.4\n' +
  '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n' +
  '2 0 obj << /Type /Pages /Kids [ 3 0 R ] /Count 1 >> endobj\n' +
  '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [ 0 0 612 792 ] /Contents 4 0 R >> endobj\n' +
  '4 0 obj << /Length 40 >> stream\n' +
  'BT /F1 12 Tf 72 712 Td (Placeholder Resume PDF) Tj ET\n' +
  'endstream\n' +
  'endobj\n' +
  'xref\n' +
  '0 5\n' +
  '0000000000 65535 f \n' +
  '0000000009 00000 n \n' +
  '0000000058 00000 n \n' +
  '0000000115 00000 n \n' +
  '0000000213 00000 n \n' +
  'trailer << /Size 5 /Root 1 0 R >>\n' +
  'startxref\n' +
  '303\n' +
  '%%EOF\n';

// Write files to target directories
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), Buffer.from(faviconIcoBase64, 'base64'));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), Buffer.from(appleTouchIconPngBase64, 'base64'));
fs.writeFileSync(path.join(assetsDir, 'og-image.webp'), Buffer.from(ogImageWebpBase64, 'base64'));
fs.writeFileSync(path.join(assetsDir, 'resume.pdf'), resumePdfContent, 'utf-8');

console.log('✓ Successfully generated public/favicon.ico');
console.log('✓ Successfully generated public/apple-touch-icon.png');
console.log('✓ Successfully generated public/assets/og-image.webp');
console.log('✓ Successfully generated public/assets/resume.pdf');
