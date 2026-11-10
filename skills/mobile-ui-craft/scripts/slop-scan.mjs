#!/usr/bin/env node
// Counts "generated-UI tells" in mobile source so a person or agent can review them.
// Deterministic regex scan, no network. Signatures mirror references/slop-tells.md.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import assert from 'node:assert/strict';

const USAGE = `Usage: node slop-scan.mjs <dir-or-file>... [--json] [--strict] [--max N] [--help] [--self-test]
  --json       print hits as a JSON array only
  --strict     exit 1 when there is at least one tier-1 hit
  --max N      sample lines shown per rule (default 5)
  --self-test  check every rule against its own sample lines
Exit codes: 0 ok, 1 tier-1 hit with --strict, 2 usage error.`;

const SKIP_DIRS = new Set(['node_modules', '.git', 'build', 'dist', 'Pods', '.dart_tool', '.gradle', 'DerivedData', '.expo', '.next', 'vendor']);
// html: mockups get the cross-stack rules only
const STACKS = { '.swift': 'swift', '.kt': 'kotlin', '.dart': 'dart', '.tsx': 'rn', '.jsx': 'rn', '.ts': 'rn', '.js': 'rn', '.html': 'html', '.htm': 'html' };
const THEME_HINTS = ['theme', 'color', 'colour', 'token', 'typography', 'palette', '/type'];
const TIERS = ['', 'Tier 1 - anyone notices', 'Tier 2 - a designer or developer notices', 'Tier 3 - craft gaps'];

// min = matching lines a file needs before the rule reports it; yes/no are self-test samples.
const RULES = [
  { id: 'template-purple', tier: 1, stacks: ['all'], re: /(?:#|0x(?:ff)?)(?:6366F1|8B5CF6|7C3AED|A855F7|4F46E5|667EEA|764BA2|6750A4|6650A4|D0BCFF)\b/i,
    msg: 'Template purple left in place', yes: 'val primary = Color(0xFF6750A4)', no: 'val primary = Color(0xFF1B4D3E)' },
  { id: 'emoji-in-ui', tier: 1, stacks: ['all'], re: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u,
    msg: 'Emoji used in UI source', yes: 'Text("\u{1F680} Launch")', no: 'Text("Launch")' },
  { id: 'placeholder-data', tier: 1, stacks: ['all'], re: /lorem ipsum|john doe|jane doe|jane smith|\bitem 1\b|pravatar|dicebear|picsum\.photos/i,
    msg: 'Placeholder data or stock avatars', yes: 'Text("Lorem ipsum dolor")', no: 'Text("Order summary")' },
  { id: 'build-note', tier: 1, stacks: ['all'], re: /in the (?:native )?build\b|goes here\b|buraya gelir|\(MapKit|\bTODO\b|from catalog\)|asset needed|photo needed/i,
    msg: 'A note for the builder shows on screen: image slots carry no text, notes go in the report', yes: '<span>Map tiles here (MapKit in the build)</span>', no: '<div class="slot" role="img" aria-label="Restaurant photo"></div>' },
  { id: 'fake-greeting', tier: 1, stacks: ['all'], re: /welcome back|good (?:morning|afternoon|evening)/i,
    msg: 'Greeting header instead of content', yes: 'Text("Welcome back, Alex")', no: 'Text("Resume chapter 3")' },
  { id: 'vague-error', tier: 2, stacks: ['all'], re: /\boops\b|something went wrong/i,
    msg: 'Error copy that names neither the problem nor the fix', yes: 'Text("Oops! Try again")', no: 'Text("Could not save. Check your connection.")' },
  { id: 'filler-copy', tier: 2, stacks: ['all'], re: /\b(?:seamless|effortless|supercharge|unlock your|elevate your|all-in-one|next[- ]level)/i,
    msg: 'Filler marketing copy', yes: 'Text("Seamlessly manage money")', no: 'Text("Add expense")' },
  { id: 'model-favourite-font', tier: 1, stacks: ['all'], re: /(?:font-?family|family=|GoogleFonts\.|Font\.custom\(|FontFamily\()[^;\n]{0,80}?(?:Inter\b|Fraunces|Instrument[ +](?:Serif|Sans)|Playfair|Space[ +]Grotesk|DM[ +](?:Sans|Serif)|Bricolage|Plus[ +]Jakarta|Manrope|Sora\b|Outfit\b|Syne\b|Poppins|Montserrat|Geist|Figtree|Barlow[ +]Condensed)/i,
    msg: 'Typeface from the short list models reach for: use the dealt one', yes: "font-family: 'Fraunces', serif;", no: "font-family: 'Literata', serif;" },
  { id: 'middot-chain', tier: 2, stacks: ['all'], min: 4, re: / \u00b7 /,
    msg: 'Metadata chained with middle dots', yes: 'Text("Kafe \u00b7 12:40")', no: 'Text("Kafe, 12:40")' },
  { id: 'drawn-icons', tier: 2, stacks: ['html'], min: 8, re: /<svg\b/,
    msg: 'Many inline SVGs: icons belong to a real icon set, not to hand-written paths', yes: '<svg viewBox="0 0 24 24">', no: '<i class="ph ph-house"></i>' },
  { id: 'glow', tier: 2, stacks: ['html'], re: /filter:\s*blur\(\s*(?:[2-9]\d|\d{3,})px/,
    msg: 'Blurred glow', yes: 'filter: blur(46px);', no: 'filter: blur(2px);' },
  { id: 'light-gradient', tier: 2, stacks: ['html'], min: 2, re: /radial-gradient\(/,
    msg: 'Radial gradients used as lighting', yes: 'background: radial-gradient(circle at 20% 0, #fff, #000);', no: 'background: #123456;' },

  { id: 'swift-fixed-font', tier: 2, stacks: ['swift'], re: /\.font\(\.system\(size:/,
    msg: 'Fixed font size instead of a text style', yes: '.font(.system(size: 14))', no: '.font(.body)' },
  { id: 'swift-screen-bounds', tier: 2, stacks: ['swift'], re: /UIScreen\.main/,
    msg: 'Layout from screen size', yes: 'let w = UIScreen.main.bounds.width', no: 'let w = proxy.size.width' },
  { id: 'swift-hardcoded-inset', tier: 2, stacks: ['swift'], re: /\.padding\(\.top,\s*(?:44|47|50|54|59)\b/,
    msg: 'Hard-coded status bar or safe-area inset', yes: '.padding(.top, 59)', no: '.padding(.top, 16)' },
  { id: 'swift-colour-literal', tier: 2, stacks: ['swift'], themeExempt: true, re: /\bColor\.(?:white|black)\b|\bColor\(red:/,
    msg: 'Colour literal outside the theme', yes: '.background(Color.white)', no: '.background(Color("Surface"))' },
  { id: 'swift-gradient', tier: 1, stacks: ['swift'], min: 3, re: /LinearGradient\(/,
    msg: 'Gradient used more than twice in one file', yes: 'LinearGradient(colors: [a, b], startPoint: .top, endPoint: .bottom)', no: 'RadialGradient(colors: [a, b])' },
  { id: 'swift-gradient-text', tier: 1, stacks: ['swift'], re: /foregroundStyle\(\s*LinearGradient/,
    msg: 'Gradient text', yes: '.foregroundStyle( LinearGradient(colors: c))', no: '.foregroundStyle(.secondary)' },
  { id: 'swift-custom-header', tier: 2, stacks: ['swift'], re: /navigationBarBackButtonHidden\(true\)|\.navigationBarHidden\(true\)|\.toolbar\(\.hidden,\s*for:\s*\.navigationBar/,
    msg: 'Native navigation bar hidden or replaced', yes: '.navigationBarBackButtonHidden(true)', no: '.navigationTitle("Inbox")' },
  { id: 'swift-sparkle', tier: 1, stacks: ['swift'], re: /systemName:\s*"(?:sparkles|sparkle|wand\.and\.stars)"/,
    msg: 'Sparkle icon', yes: 'Image(systemName: "sparkles")', no: 'Image(systemName: "tray")' },
  { id: 'swift-tap-gesture', tier: 3, stacks: ['swift'], re: /\.onTapGesture/,
    msg: 'Tap gesture where a Button may belong', yes: '.onTapGesture { open() }', no: 'Button("Open") { open() }' },
  { id: 'swift-one-radius', tier: 2, stacks: ['swift'], min: 6, re: /cornerRadius(?::\s*|\()16\b/,
    msg: 'Same corner radius repeated across the file', yes: 'RoundedRectangle(cornerRadius: 16)', no: '.cornerRadius(10)' },

  { id: 'compose-template-colours', tier: 1, stacks: ['kotlin'], re: /\b(?:Purple40|Purple80|PurpleGrey40|PurpleGrey80|Pink40|Pink80)\b/,
    msg: 'Compose template colours left in place', yes: 'primary = Purple80,', no: 'primary = Moss600,' },
  { id: 'compose-fixed-font', tier: 2, stacks: ['kotlin'], themeExempt: true, re: /fontSize\s*=\s*\d+(?:\.\d+)?\.sp\b/,
    msg: 'Fixed font size outside the typography file', yes: 'Text("Hi", fontSize = 14.sp)', no: 'style = MaterialTheme.typography.bodyLarge' },
  { id: 'compose-colour-literal', tier: 2, stacks: ['kotlin'], themeExempt: true, re: /\bColor\.(?:White|Black)\b|\bColor\(0x[0-9A-Fa-f]{8}\)/,
    msg: 'Colour literal outside the theme', yes: 'color = Color.White', no: 'color = MaterialTheme.colorScheme.surface' },
  { id: 'compose-gradient', tier: 1, stacks: ['kotlin'], min: 3, re: /Brush\.(?:linear|vertical|horizontal)Gradient/,
    msg: 'Gradient used more than twice in one file', yes: 'Brush.verticalGradient(listOf(a, b))', no: 'SolidColor(a)' },
  { id: 'compose-one-radius', tier: 2, stacks: ['kotlin'], min: 6, re: /RoundedCornerShape\(16\.dp\)/,
    msg: 'Same corner radius repeated across the file', yes: 'shape = RoundedCornerShape(16.dp)', no: 'shape = RoundedCornerShape(8.dp)' },
  { id: 'compose-sparkle', tier: 1, stacks: ['kotlin'], re: /Icons\.(?:Default|Filled|Rounded|Outlined)\.AutoAwesome/,
    msg: 'Sparkle icon', yes: 'Icon(Icons.Default.AutoAwesome, null)', no: 'Icon(Icons.Default.Search, null)' },

  { id: 'flutter-template-colours', tier: 1, stacks: ['dart'], re: /Colors\.deepPurple|seedColor:\s*Colors\.(?:purple|indigo|blue)\b/,
    msg: 'Flutter template seed colour left in place', yes: 'ColorScheme.fromSeed(seedColor: Colors.deepPurple)', no: 'ColorScheme.fromSeed(seedColor: brandMoss)' },
  { id: 'flutter-fixed-font', tier: 2, stacks: ['dart'], themeExempt: true, re: /TextStyle\(.*fontSize:\s*\d/,
    msg: 'Fixed font size outside the theme', yes: 'style: TextStyle(fontSize: 14),', no: 'style: Theme.of(context).textTheme.bodyMedium,' },
  { id: 'flutter-colour-literal', tier: 2, stacks: ['dart'], themeExempt: true, re: /\bColors\.(?:white|black|grey)(?![A-Za-z])|\bColor\(0x[0-9A-Fa-f]{8}\)/,
    msg: 'Colour literal outside the theme', yes: 'color: Colors.white,', no: 'color: scheme.surface,' },
  { id: 'flutter-gradient', tier: 1, stacks: ['dart'], min: 3, re: /LinearGradient\(/,
    msg: 'Gradient used more than twice in one file', yes: 'gradient: LinearGradient(colors: [a, b]),', no: 'color: scheme.surface,' },
  { id: 'flutter-one-radius', tier: 2, stacks: ['dart'], min: 6, re: /BorderRadius\.circular\(16(?:\.0)?\)/,
    msg: 'Same corner radius repeated across the file', yes: 'borderRadius: BorderRadius.circular(16),', no: 'borderRadius: BorderRadius.circular(8),' },
  { id: 'flutter-wrong-uniform', tier: 2, stacks: ['dart'], re: /Cupertino(?:Switch|AlertDialog)\(/,
    msg: 'Cupertino widget: check it is behind a platform branch', yes: 'CupertinoSwitch(value: on, onChanged: set)', no: 'Switch.adaptive(value: on, onChanged: set)' },
  { id: 'flutter-bare-tap', tier: 3, stacks: ['dart'], re: /\bGestureDetector\(/,
    msg: 'GestureDetector where a button or InkWell may belong', yes: 'GestureDetector(onTap: open, child: row)', no: 'InkWell(onTap: open, child: row)' },
  { id: 'flutter-bounce', tier: 2, stacks: ['dart'], re: /Curves\.(?:bounce|elastic)/,
    msg: 'Bounce or elastic curve on UI', yes: 'curve: Curves.elasticOut,', no: 'curve: Curves.easeOutCubic,' },
  { id: 'flutter-template-residue', tier: 1, stacks: ['dart'], re: /Flutter Demo|You have pushed the button/,
    msg: 'Template text left in place', yes: "title: 'Flutter Demo',", no: "title: 'Tidewatch'," },
  { id: 'flutter-sparkle', tier: 1, stacks: ['dart'], re: /Icons\.auto_awesome/,
    msg: 'Sparkle icon', yes: 'Icon(Icons.auto_awesome)', no: 'Icon(Icons.search)' },

  { id: 'rn-touchable', tier: 2, stacks: ['rn'], re: /\bTouchable(?:Opacity|Highlight)\b/,
    msg: 'Legacy Touchable instead of Pressable', yes: '<TouchableOpacity onPress={go}>', no: '<Pressable onPress={go}>' },
  { id: 'rn-hover', tier: 1, stacks: ['rn'], re: /onMouseEnter|cursor:\s*['"]pointer['"]/,
    msg: 'Hover or cursor styling in a touch UI', yes: "style={{ cursor: 'pointer' }}", no: 'onPressIn={() => setPressed(true)}' },
  { id: 'rn-hardcoded-inset', tier: 2, stacks: ['rn'], re: /\b(?:paddingTop|marginTop):\s*(?:44|47|50|54|59)\b|StatusBar\.currentHeight/,
    msg: 'Hard-coded status bar or safe-area inset', yes: 'paddingTop: 44,', no: 'paddingTop: insets.top,' },
  { id: 'rn-screen-bounds', tier: 2, stacks: ['rn'], re: /Dimensions\.get\(/,
    msg: 'Layout from screen size', yes: "const { width } = Dimensions.get('window');", no: 'const { width } = useWindowDimensions();' },
  { id: 'rn-custom-header', tier: 2, stacks: ['rn'], re: /headerShown:\s*false/,
    msg: 'Native header hidden: check it is not rebuilt by hand', yes: 'options={{ headerShown: false }}', no: 'options={{ title: "Inbox" }}' },
  { id: 'rn-drawer', tier: 1, stacks: ['rn'], re: /createDrawerNavigator/,
    msg: 'Drawer as primary navigation', yes: 'const Drawer = createDrawerNavigator();', no: 'const Tab = createBottomTabNavigator();' },
  { id: 'rn-colour-literal', tier: 2, stacks: ['rn'], themeExempt: true, re: /backgroundColor:\s*['"]#(?:fff|ffffff|000|000000)['"]/i,
    msg: 'Colour literal outside the theme', yes: "backgroundColor: '#FFF',", no: 'backgroundColor: colors.surface,' },
  // Opening tags only: counting the import and closing tag would report a single gradient.
  { id: 'rn-gradient', tier: 1, stacks: ['rn'], min: 3, re: /<LinearGradient\b/,
    msg: 'Gradient used more than twice in one file', yes: '<LinearGradient colors={[a, b]} style={s.bg}>', no: '<View style={s.bg}>' },
  { id: 'rn-side-stripe', tier: 2, stacks: ['rn'], re: /borderLeft(?:Width|Color)/,
    msg: 'Coloured side stripe', yes: 'borderLeftWidth: 4,', no: 'borderBottomWidth: 1,' },
  { id: 'rn-grand-entrance', tier: 2, stacks: ['rn'], re: /FadeIn(?:Down|Up)|\.delay\(\s*(?:index|i)\b/,
    msg: 'Staggered entrance animation', yes: 'entering={FadeInDown.delay(index * 80)}', no: 'entering={FadeIn}' },
  { id: 'rn-dead-control', tier: 2, stacks: ['rn'], re: /onPress=\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*\}/,
    msg: 'Control with an empty handler', yes: '<Pressable onPress={() => {}}>', no: '<Pressable onPress={() => save()}>' },
  { id: 'rn-web-font', tier: 2, stacks: ['rn'], re: /fontFamily:\s*['"]Inter['"]/,
    msg: 'Web font reflex: check the platform face is not better', yes: "fontFamily: 'Inter',", no: 'fontFamily: Platform.select({ ios: "System" }),' },
  { id: 'rn-template-residue', tier: 1, stacks: ['rn'], re: /Open up App|Welcome to React Native/,
    msg: 'Template text left in place', yes: '<Text>Open up App.js to start working</Text>', no: '<Text>Tide table</Text>' },
];

const ascii = (s) => s.replace(/[^\x20-\x7e]/gu, (c) => `\\u{${c.codePointAt(0).toString(16)}}`);

function display(abs) {
  const rel = relative(process.cwd(), abs);
  return (rel.startsWith('..') ? abs : rel).replace(/\\/g, '/');
}

function collect(p, out) {
  const st = statSync(p);
  if (st.isDirectory()) {
    for (const e of readdirSync(p, { withFileTypes: true })) {
      if (e.isSymbolicLink() || (e.isDirectory() && SKIP_DIRS.has(e.name))) continue;
      collect(join(p, e.name), out);
    }
  } else if (st.size <= 1024 * 1024 && STACKS[extname(p).toLowerCase()] && !/\.(?:g|freezed)\.dart$/.test(p)) out.add(p);
}

function scanFile(abs, stack) {
  const file = display(abs);
  const exempt = THEME_HINTS.some((h) => `/${file.toLowerCase()}`.includes(h));
  const rules = RULES.filter((r) => (r.stacks[0] === 'all' || r.stacks.includes(stack)) && !(r.themeExempt && exempt));
  const found = rules.map(() => []);
  readFileSync(abs, 'utf8').split(/\r?\n/).forEach((raw, i) => {
    const t = raw.trim();
    if (!t || t.includes('slop-ok') || t.startsWith('//') || t.startsWith('*')) return;
    rules.forEach((r, k) => {
      if (r.re.test(t)) found[k].push({ rule: r.id, tier: r.tier, file, line: i + 1, text: ascii(t.replace(/\s+/g, ' ').slice(0, 100)) });
    });
  });
  return rules.flatMap((r, k) => (found[k].length >= (r.min ?? 1) ? found[k] : []));
}

function selfTest() {
  try {
    const ids = new Set();
    for (const r of RULES) {
      assert.ok(!ids.has(r.id), `duplicate id ${r.id}`);
      ids.add(r.id);
      assert.ok(r.tier >= 1 && r.tier <= 3, `${r.id}: tier must be 1..3`);
      assert.ok(!r.re.global && !r.re.sticky, `${r.id}: regex must not be global or sticky`);
      assert.ok(r.re.test(r.yes), `${r.id}: yes sample must match`);
      assert.ok(!r.re.test(r.no), `${r.id}: no sample must not match`);
    }
    console.log(`self-test ok (${RULES.length} rules)`);
    return 0;
  } catch (e) {
    console.error(`self-test FAILED: ${e.message}`);
    return 1;
  }
}

function usage(msg) {
  console.error(`${msg}\n${USAGE}`);
  return 2;
}

function main(argv) {
  const paths = [];
  let json = false, strict = false, max = 5;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') { console.log(USAGE); return 0; }
    if (a === '--self-test') return selfTest();
    if (a === '--json') json = true;
    else if (a === '--strict') strict = true;
    else if (a === '--max') {
      max = Number(argv[++i]);
      if (!Number.isInteger(max) || max < 0) return usage('--max needs a whole number');
    } else if (a.startsWith('--')) return usage(`unknown option ${a}`);
    else paths.push(a);
  }
  if (!paths.length) return usage('no path given');

  const files = new Set();
  for (const p of paths) {
    if (!existsSync(p)) return usage(`path not found: ${p}`);
    collect(resolve(p), files);
  }
  const counts = { swift: 0, kotlin: 0, dart: 0, rn: 0, html: 0 };
  const hits = [];
  for (const f of [...files].sort()) {
    const stack = STACKS[extname(f).toLowerCase()];
    counts[stack]++;
    try { hits.push(...scanFile(f, stack)); } catch { /* unreadable file: skip */ }
  }

  const tierCount = (t) => hits.filter((h) => h.tier === t).length;
  if (json) {
    console.log(JSON.stringify(hits, null, 2));
  } else {
    console.log(`Scanned ${files.size} files (swift ${counts.swift}, kotlin ${counts.kotlin}, dart ${counts.dart}, rn ${counts.rn}, html ${counts.html})`);
    for (let tier = 1; tier <= 3; tier++) {
      const rules = RULES.filter((r) => r.tier === tier && hits.some((h) => h.rule === r.id));
      if (!rules.length) continue;
      console.log(`\n${TIERS[tier]}`);
      for (const r of rules) {
        const hs = hits.filter((h) => h.rule === r.id);
        console.log(`  [${r.id}] ${r.msg} - ${hs.length} hits`);
        for (const h of hs.slice(0, max)) console.log(`    ${h.file}:${h.line}: ${h.text}`);
      }
    }
    if (hits.length) {
      console.log(`\nSummary: tier1=${tierCount(1)} tier2=${tierCount(2)} tier3=${tierCount(3)}`);
      console.log('Each hit is a prompt to check intent, not a failure. Mark deliberate choices with a "slop-ok" comment on the line.');
    } else {
      console.log('No signatures found. A clean scan does not prove a good design: render the screens and look.');
    }
  }
  return strict && tierCount(1) > 0 ? 1 : 0;
}

process.exitCode = main(process.argv.slice(2));
