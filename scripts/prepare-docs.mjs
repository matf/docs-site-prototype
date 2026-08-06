#!/usr/bin/env node
/**
 * Composes one documentation tree per environment.
 *
 *   content/base/            authored once, shared by every environment
 *   content/overrides/<env>/ what differs on that environment
 *   docs-build/<env>/        the composed tree Docusaurus actually reads
 *
 * Composition is a copy of `base` followed by an overlay of `overrides/<env>`.
 * A file in the overrides replaces the file at the same path; a file that only
 * exists in the overrides is added. That is the whole model: something exists on
 * an environment when its file exists there.
 *
 * `docs-build/` is generated and git-ignored. Never edit it — edit the source
 * under `content/` and re-run this script.
 */
import {readFileSync, rmSync, mkdirSync, cpSync, existsSync, writeFileSync} from 'node:fs';
import {readdirSync, statSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = path.join(root, 'content', 'base');
const OVERRIDES = path.join(root, 'content', 'overrides');
const OUT = path.join(root, 'docs-build');

const {environments} = JSON.parse(
  readFileSync(path.join(root, 'content', 'environments.json'), 'utf8'),
);

/** Every file below `dir`, as paths relative to it. */
function walk(dir, prefix = '', acc = []) {
  for (const entry of readdirSync(dir)) {
    const abs = path.join(dir, entry);
    const rel = prefix ? `${prefix}/${entry}` : entry;
    if (statSync(abs).isDirectory()) {
      walk(abs, rel, acc);
    } else {
      acc.push(rel);
    }
  }
  return acc;
}

rmSync(OUT, {recursive: true, force: true});

for (const env of environments) {
  const target = path.join(OUT, env.id);
  mkdirSync(target, {recursive: true});

  // 1. the shared tree
  cpSync(BASE, target, {recursive: true});
  const sources = Object.fromEntries(walk(BASE).map((rel) => [rel, `content/base/${rel}`]));

  // 2. the environment's overrides on top
  const overrideDir = path.join(OVERRIDES, env.id);
  let overridden = 0;
  let added = 0;
  if (existsSync(overrideDir)) {
    for (const rel of walk(overrideDir)) {
      if (rel.endsWith('README.md')) {
        continue; // documentation for humans, not site content
      }
      const dest = path.join(target, rel);
      mkdirSync(path.dirname(dest), {recursive: true});
      if (existsSync(dest)) {
        overridden += 1;
      } else {
        added += 1;
      }
      cpSync(path.join(overrideDir, rel), dest);
      sources[rel] = `content/overrides/${env.id}/${rel}`;
    }
  }

  // 3. where each composed file came from, so "Edit this page" points at the source
  writeFileSync(path.join(target, '.sources.json'), `${JSON.stringify(sources, null, 2)}\n`);

  const total = walk(target).filter((f) => f.endsWith('.mdx')).length;
  console.log(
    `  ${env.short.padEnd(5)} ${String(total).padStart(4)} pages` +
      `  (${overridden} overridden, ${added} added)`,
  );
}

console.log(`Composed ${environments.length} environment trees in docs-build/.`);
