#!/usr/bin/env node
// Static checks so a broken skill never gets pushed. Run from the repo root: node tests/lint.mjs
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const ALLOWED_KEYS = ['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools'];

// Tiny purpose-built YAML subset: scalars (plain/quoted), >, >-, |, |- block scalars, one nested map level.
// shortcut: folded blocks ignore "more indented" lines, upgrade to a real parser if skills need that.
function parseScalar(v) {
  const bad = () => new Error(`unsupported YAML scalar: ${v}`);
  if (v[0] === '"') {
    try { return [JSON.parse(v), 'quoted']; } catch { throw bad(); }
  }
  if (v[0] === "'") {
    const inner = v.slice(1, -1);
    if (v.length < 2 || !v.endsWith("'") || inner.replace(/''/g, '').includes("'")) throw bad();
    return [inner.replace(/''/g, "'"), 'quoted'];
  }
  if (/^(?:[[{&*!%@`>|]|-\s)/.test(v) || v.includes(' #')) throw bad();
  return [v, 'plain'];
}

function parseFrontmatter(text) {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);
  if (lines[0].trimEnd() !== '---') return null;
  const end = lines.findIndex((l, i) => i > 0 && l.trimEnd() === '---');
  if (end < 0) return null;
  const fm = lines.slice(1, end);
  const data = {}, kinds = {};
  for (let i = 0; i < fm.length;) {
    const line = fm[i++];
    if (!line.trim()) continue;
    const m = /^([A-Za-z0-9_-]+):(?:[ \t]+(.*))?$/.exec(line);
    if (!m) throw new Error(`unsupported YAML: "${line.trim()}"`);
    const key = m[1], v = (m[2] ?? '').trim();
    if (key in data) throw new Error(`unsupported YAML: duplicate key "${key}"`);
    const block = [];
    while (i < fm.length && (!fm[i].trim() || /^\s/.test(fm[i]))) block.push(fm[i++]);
    while (block.length && !block[block.length - 1].trim()) block.pop();
    const indent = (l) => l.length - l.trimStart().length;
    const nonBlank = block.filter((l) => l.trim());
    const base = nonBlank.length ? Math.min(...nonBlank.map(indent)) : 0;
    const ind = /^([>|])([-+]?)$/.exec(v);
    if (ind) {
      const body = block.map((l) => l.slice(base));
      let val = ind[1] === '|' ? body.join('\n') : body.join('\n').split(/\n\n+/).map((p) => p.replace(/\n/g, ' ')).join('\n');
      if (ind[2] !== '-') val += '\n';
      data[key] = val;
      kinds[key] = 'block';
    } else if (v === '') {
      const map = {};
      for (const l of nonBlank) {
        const mm = /^\s+([A-Za-z0-9_-]+):(?:[ \t]+(.*))?$/.exec(l);
        if (!mm || indent(l) !== base) throw new Error(`unsupported YAML in "${key}": "${l.trim()}"`);
        map[mm[1]] = (mm[2] ?? '').trim() === '' ? '' : parseScalar(mm[2].trim())[0];
      }
      data[key] = nonBlank.length ? map : '';
      kinds[key] = nonBlank.length ? 'map' : 'plain';
    } else {
      if (nonBlank.length) throw new Error(`unsupported YAML: multi-line plain scalar for "${key}"`);
      [data[key], kinds[key]] = parseScalar(v);
    }
  }
  return { data, kinds, body: lines.slice(end + 1).join('\n') };
}

function selfTest() {
  const a = parseFrontmatter('---\nname: foo\ndescription: "Hello: world"\nlicense: MIT\n---\nbody');
  assert.deepEqual(a.data, { name: 'foo', description: 'Hello: world', license: 'MIT' });
  assert.equal(a.kinds.description, 'quoted');
  assert.equal(a.kinds.name, 'plain');
  assert.equal(a.body, 'body');
  const b = parseFrontmatter('---\nname: x\ndescription: >-\n  Line one\n  line two: with colon\nlicense: MIT\n---\n');
  assert.equal(b.data.description, 'Line one line two: with colon');
  assert.equal(b.kinds.description, 'block');
  assert.equal(b.data.license, 'MIT');
  const c = parseFrontmatter('---\nname: x\nmetadata:\n  version: "1.0.0"\n  baseline: \'2026-11\'\n---\n');
  assert.deepEqual(c.data.metadata, { version: '1.0.0', baseline: '2026-11' });
  assert.equal(c.kinds.metadata, 'map');
  assert.throws(() => parseFrontmatter('---\ntags: [a, b]\n---\n'), /unsupported YAML/);
  assert.equal(parseFrontmatter('no frontmatter'), null);
}

const listFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? listFiles(`${dir}/${e.name}`) : [`${dir}/${e.name}`]);
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

let checks = 0, problems = 0;
const ok = (cond, where, why) => {
  checks++;
  if (!cond) { problems++; console.log(`FAIL ${where}: ${why}`); }
  return cond;
};
const warn = (where, why) => console.log(`WARN ${where}: ${why}`);

function lintSkill(dir) {
  const root = `skills/${dir}`;
  const skillPath = `${root}/SKILL.md`;
  if (!ok(fs.existsSync(skillPath), root, 'SKILL.md is missing')) return;
  const text = fs.readFileSync(skillPath, 'utf8');

  // 10. file size and BOM
  for (const f of listFiles(root)) {
    ok(fs.statSync(f).size <= 500 * 1024, f, 'larger than 500 KB');
    const fd = fs.openSync(f, 'r');
    const head = Buffer.alloc(3);
    fs.readSync(fd, head, 0, 3, 0);
    fs.closeSync(fd);
    ok(!(head[0] === 0xef && head[1] === 0xbb && head[2] === 0xbf), f, 'starts with a UTF-8 BOM');
  }

  // 1-4. frontmatter
  let fm = null;
  try {
    fm = parseFrontmatter(text);
    ok(fm, skillPath, 'no frontmatter between leading --- lines');
  } catch (e) {
    ok(false, skillPath, e.message);
  }
  if (fm) {
    const { data, kinds } = fm;
    for (const k of Object.keys(data)) ok(ALLOWED_KEYS.includes(k), skillPath, `unknown frontmatter key "${k}" (claude.ai rejects it)`);
    const name = data.name;
    if (ok(typeof name === 'string' && name, skillPath, 'name is missing')) {
      ok(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name), skillPath, `name "${name}" must be lowercase letters, digits and single hyphens`);
      ok(name.length <= 64, skillPath, 'name is longer than 64 characters');
      ok(name === dir, skillPath, `name "${name}" must equal the directory name "${dir}"`);
      ok(!/claude|anthropic/i.test(name), skillPath, 'name must not contain "claude" or "anthropic"');
    }
    const desc = typeof data.description === 'string' ? data.description.trim() : '';
    if (ok(desc, skillPath, 'description is missing or empty')) {
      ok(desc.length <= 1024, skillPath, `description is ${desc.length} characters (max 1024)`);
      ok(!/[<>]/.test(desc), skillPath, 'description contains < or >');
      ok(!(kinds.description === 'plain' && desc.includes(': ')), skillPath, 'plain-scalar description contains ": " (strict YAML parsers drop the skill; quote it or use >-)');
      if (desc.length > 700) warn(skillPath, `description is ${desc.length} characters (over 700)`);
    }
  }

  // 5. size limits
  const lineCount = text.replace(/\r?\n$/, '').split(/\r?\n/).length;
  ok(lineCount <= 500, skillPath, `${lineCount} lines (max 500)`);
  const body = fm ? fm.body : text;
  ok(body.length <= 20000, skillPath, `body is ${body.length} characters (max 20000)`);

  // 6. referenced paths exist
  const refs = new Set();
  for (const m of text.matchAll(/`((?:references|assets|scripts)\/[^`\s]*)[^`]*`/g)) {
    if (!/[*<>{}]/.test(m[1])) refs.add(m[1].replace(/[.,;:]+$/, ''));
  }
  for (const r of refs) ok(fs.existsSync(`${root}/${r}`), skillPath, `mentions \`${r}\` but it does not exist`);

  // 7-9. reference files
  const refDir = `${root}/references`;
  if (!fs.existsSync(refDir)) return;
  const refFiles = listFiles(refDir);
  const names = refFiles.map((f) => path.posix.basename(f));
  for (const f of refFiles) {
    const name = path.posix.basename(f);
    const content = fs.readFileSync(f, 'utf8');
    ok(text.includes(name), f, 'not mentioned in SKILL.md (orphan)');
    ok(!content.includes('references/'), f, 'contains "references/": reference files must not link to each other');
    const others = names.filter((n) => n !== name && new RegExp(`(?<![\\w.-])${escapeRe(n)}`).test(content));
    ok(!others.length, f, `names another reference file (${others.join(', ')})`);
    const lines = content.split(/\r?\n/);
    if (lines.length > 100) ok(lines.slice(0, 30).some((l) => /^##\s+Contents\s*$/.test(l)), f, `${lines.length} lines but no "## Contents" heading in the first 30`);
  }
}

function lintMarketplace() {
  const file = '.claude-plugin/marketplace.json';
  if (!fs.existsSync(file)) return;
  let m;
  try { m = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { ok(false, file, `invalid JSON: ${e.message}`); return; }
  ok(m.name, file, 'missing "name"');
  ok(m.owner && m.owner.name, file, 'missing "owner.name"');
  if (!ok(Array.isArray(m.plugins) && m.plugins.length, file, '"plugins" must be a non-empty array')) return;
  m.plugins.forEach((p, i) => {
    const where = `${file} plugins[${i}]`;
    ok(p.name, where, 'missing "name"');
    ok(p.source, where, 'missing "source"');
    for (const s of p.skills ?? []) {
      // Paths may be relative to the repo root or to the plugin's source directory.
      const bases = ['.', typeof p.source === 'string' ? p.source : '.'];
      ok(bases.some((b) => fs.existsSync(path.join(b, s, 'SKILL.md'))), where, `skill path "${s}" has no SKILL.md`);
    }
  });
}

function main() {
  process.chdir(path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
  if (ok(fs.existsSync('skills'), 'skills', 'directory is missing')) {
    for (const e of fs.readdirSync('skills', { withFileTypes: true })) if (e.isDirectory()) lintSkill(e.name);
  }
  lintMarketplace();
  if (problems) {
    console.log(`lint failed (${problems} problems)`);
    process.exitCode = 1;
  } else {
    console.log(`lint ok (${checks} checks)`);
  }
}

if (process.argv.includes('--self-test')) {
  selfTest();
  console.log('self-test ok');
} else {
  main();
}
