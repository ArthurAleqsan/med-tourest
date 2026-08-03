/**
 * Production proxies often return HTTP 400 for Next.js chunk URLs containing
 * `%5Bslug%5D` / `%5Bid%5D` (encoded `[slug]` / `[id]` folders).
 *
 * After `next build`, rename those folders under `.next/static/chunks` and patch
 * only manifests that embed those chunk URLs. Route keys like
 * `/(public)/centers/[slug]/page` are left untouched.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..');
const staticChunks = path.join(webRoot, '.next', 'static', 'chunks');
const nextRoot = path.join(webRoot, '.next');

const RENAMES = [
  { from: '[slug]', to: '_slug_', encodedFrom: '%5Bslug%5D', encodedTo: '_slug_' },
  { from: '[id]', to: '_id_', encodedFrom: '%5Bid%5D', encodedTo: '_id_' },
];

function renameDynamicDirs(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (!ent.isDirectory()) continue;
    count += renameDynamicDirs(full);
    const match = RENAMES.find((r) => r.from === ent.name);
    if (!match) continue;
    const dest = path.join(dir, match.to);
    if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
    fs.renameSync(full, dest);
    count += 1;
    console.log(`[sanitize-chunks] renamed ${path.relative(webRoot, full)} -> ${match.to}`);
  }
  return count;
}

function shouldPatchFile(filePath) {
  const base = path.basename(filePath);
  if (base === 'app-build-manifest.json') return true;
  if (base.endsWith('_client-reference-manifest.js')) return true;
  // Client-facing compiled assets under /_next/static
  if (filePath.includes(`${path.sep}static${path.sep}`)) {
    return /\.(js|json|txt|html)$/.test(base);
  }
  return false;
}

function patchEncodedPaths(dir) {
  if (!fs.existsSync(dir)) return 0;
  let files = 0;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      // Never touch webpack caches / traces
      if (ent.name === 'cache' || ent.name === 'trace') continue;
      files += patchEncodedPaths(full);
      continue;
    }
    if (!shouldPatchFile(full)) continue;
    let text = fs.readFileSync(full, 'utf8');
    let next = text;
    for (const r of RENAMES) {
      if (next.includes(r.encodedFrom)) {
        next = next.split(r.encodedFrom).join(r.encodedTo);
      }
    }
    if (next !== text) {
      fs.writeFileSync(full, next);
      files += 1;
    }
  }
  return files;
}

if (!fs.existsSync(nextRoot)) {
  console.warn('[sanitize-chunks] .next not found — skip');
  process.exit(0);
}

const renamed = renameDynamicDirs(staticChunks);
const patched = patchEncodedPaths(nextRoot);
console.log(`[sanitize-chunks] done (dirs=${renamed}, files=${patched})`);
