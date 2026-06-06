// Fail the build if any Meta-ad risk word appears in the exported homepage HTML.
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('out');
const TARGETS = ['index.html'];
const RISK = /психолог|психотерап|терапия|гипно|леч[еи]|диагноз|диагност|депресс|тревог|травм|расстрой|зависим|созавис|исцел|верн.{0,5}муж|гарант/iu;

let failed = false;
for (const t of TARGETS) {
  const p = path.join(OUT, t);
  if (!fs.existsSync(p)) {
    console.log(`[risk-grep] skip (missing): ${t}`);
    continue;
  }
  const html = fs.readFileSync(p, 'utf8');
  const m = html.match(RISK);
  if (m) {
    console.error(`[risk-grep] FAIL in ${t}: matched "${m[0]}"`);
    failed = true;
  } else {
    console.log(`[risk-grep] OK: ${t}`);
  }
}
process.exit(failed ? 1 : 0);
