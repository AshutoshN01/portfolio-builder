import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Cache of env variables parsed from .env files
let parsedEnv = null;

function loadEnv() {
  if (parsedEnv !== null) return parsedEnv;
  
  const env = {};
  const envFiles = ['.env', '.env.local', '.env.production', '.env.production.local'];
  
  for (const file of envFiles) {
    const envPath = path.join(rootDir, file);
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf-8');
        const lines = content.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          
          const match = trimmed.match(/^([^=]+)=(.*)$/);
          if (match) {
            const key = match[1].trim();
            let val = match[2].trim();
            // Remove quotes if present
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.substring(1, val.length - 1);
            }
            env[key] = val;
          }
        }
      } catch (err) {
        console.error(`Failed reading env file ${file}:`, err);
      }
    }
  }
  
  parsedEnv = env;
  return env;
}

function getEnvVar(key, fallback) {
  const env = loadEnv();
  return env[key] !== undefined ? env[key] : fallback;
}

const siteUrl = getEnvVar('VITE_SITE_URL', 'https://ashutosh.dev');
const profileName = getEnvVar('VITE_PROFILE_NAME', 'Ashutosh');
const profileTitle = getEnvVar('VITE_PROFILE_TITLE', 'Software Developer');
const seoDescription = getEnvVar('VITE_SEO_DESCRIPTION', 'Portfolio of Ashutosh, showing React development, Mobile applications, and Firebase project works.');
const ogImage = getEnvVar('VITE_SEO_OG_IMAGE', '/assets/og-image.webp');

const distDir = path.join(rootDir, 'dist');
const robotsPath = path.join(distDir, 'robots.txt');
const sitemapPath = path.join(distDir, 'sitemap.xml');
const indexPath = path.join(distDir, 'index.html');

console.log(`Starting SEO post-build compilation using base URL: ${siteUrl}`);

// Update robots.txt targets
if (fs.existsSync(robotsPath)) {
  try {
    let content = fs.readFileSync(robotsPath, 'utf-8');
    content = content.replace(/https:\/\/yourportfolio\.com/g, siteUrl);
    fs.writeFileSync(robotsPath, content, 'utf-8');
    console.log('✓ Successfully processed dist/robots.txt');
  } catch (err) {
    console.error('Error processing robots.txt:', err);
  }
} else {
  console.warn('dist/robots.txt not found.');
}

// Update sitemap.xml targets & dates
if (fs.existsSync(sitemapPath)) {
  try {
    let content = fs.readFileSync(sitemapPath, 'utf-8');
    content = content.replace(/https:\/\/yourportfolio\.com/g, siteUrl);
    
    // Dynamically insert build execution date
    const today = new Date().toISOString().split('T')[0];
    content = content.replace(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
    
    fs.writeFileSync(sitemapPath, content, 'utf-8');
    console.log(`✓ Successfully processed dist/sitemap.xml (Lastmod: ${today})`);
  } catch (err) {
    console.error('Error processing sitemap.xml:', err);
  }
} else {
  console.warn('dist/sitemap.xml not found.');
}

// Update index.html meta placeholders for non-JS/crawler initial loads
if (fs.existsSync(indexPath)) {
  try {
    let content = fs.readFileSync(indexPath, 'utf-8');
    
    // 1. Replace titles (match both & and &amp;)
    content = content.replace(/Ashutosh — Software Developer/gi, `${profileName} — ${profileTitle}`);
    
    // 2. Replace Author
    content = content.replace(/<meta name="author" content="Ashutosh"\s*\/?>/gi, `<meta name="author" content="${profileName}" />`);
    content = content.replace(/content="Ashutosh"/gi, `content="${profileName}"`);
    
    // 3. Replace Descriptions
    content = content.replace(/Portfolio of Ashutosh showcasing React development, Android mobile apps, and Firebase integrations\./gi, seoDescription);
    
    // 4. Replace OG Images
    content = content.replace(/\/assets\/og-image\.webp/gi, ogImage);
    
    fs.writeFileSync(indexPath, content, 'utf-8');
    console.log('✓ Successfully processed dist/index.html metadata placeholders');
  } catch (err) {
    console.error('Error processing index.html:', err);
  }
} else {
  console.warn('dist/index.html not found.');
}
