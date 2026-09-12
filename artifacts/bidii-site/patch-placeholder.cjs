// One-shot patch — replaces ScreenshotPlaceholder with a version that has
// a finance-specific mockup for the Finance card.
const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, 'src/App.tsx');
let c = fs.readFileSync(file, 'utf8');

const hasCRLF = c.includes('\r\n');
if (hasCRLF) c = c.replace(/\r\n/g, '\n');

const oldFn = `function ScreenshotPlaceholder({ label, title, detail, dark = false, image }: { label: string; title: string; detail: string; dark?: boolean; image?: string }) {
  return (
    <div className={\`module-shot \${dark ? 'module-shot-dark' : ''}\`} data-testid={\`screenshot-placeholder-\${label.toLowerCase().replaceAll(' ', '-')}\`}>
      <div className="module-shot-bar">
        <span className="mono">Product view \xb7 screenshot space</span>
        <span className="shot-dots"><i /><i /><i /></span>
      </div>
      {image ? (
        <div className="module-shot-image-wrap">
          <img className="module-shot-image" src={image} alt={\`\${label} Bidii school management product screen\`} width="640" height="360" loading="lazy" />
          <div className="module-shot-caption">{detail}</div>
        </div>
      ) : (
        <div className="module-shot-content">
          <div className="shot-mini-label">{label}</div>
          <strong>{title}</strong>
          <div className="shot-chart">
            <span /><span /><span /><span /><span /><span />
          </div>
          <small>{detail}</small>
        </div>
      )}
    </div>
  );
}`;

const newFn = `function FinanceMock({ detail }: { detail: string }) {
  const rows = [
    { name: 'Form 1 North', paid: 92, amount: 'KES 28,440' },
    { name: 'Form 2 South', paid: 78, amount: 'KES 22,620' },
    { name: 'Form 3 East', paid: 55, amount: 'KES 18,700' },
  ];
  return (
    <div className="module-shot-content finance-mock">
      <div className="shot-mini-label">Finance</div>
      <strong>Terms &amp; billing</strong>
      <div className="finance-rows">
        {rows.map(row => (
          <div className="finance-row" key={row.name}>
            <span className="finance-row-name">{row.name}</span>
            <div className="finance-bar-wrap">
              <div className="finance-bar" style={{ width: row.paid + '%' }} />
            </div>
            <span className="finance-row-amount">{row.amount}</span>
          </div>
        ))}
      </div>
      <small>{detail}</small>
    </div>
  );
}

function ScreenshotPlaceholder({ label, title, detail, dark = false }: { label: string; title: string; detail: string; dark?: boolean }) {
  return (
    <div className={\`module-shot \${dark ? 'module-shot-dark' : ''}\`} data-testid={\`screenshot-placeholder-\${label.toLowerCase().replaceAll(' ', '-')}\`}>
      <div className="module-shot-bar">
        <span className="mono">Product view \xb7 screenshot space</span>
        <span className="shot-dots"><i /><i /><i /></span>
      </div>
      {label === 'Finance' ? (
        <FinanceMock detail={detail} />
      ) : (
        <div className="module-shot-content">
          <div className="shot-mini-label">{label}</div>
          <strong>{title}</strong>
          <div className="shot-chart">
            <span /><span /><span /><span /><span /><span />
          </div>
          <small>{detail}</small>
        </div>
      )}
    </div>
  );
}`;

if (c.includes(oldFn)) {
  c = c.replace(oldFn, newFn);
  console.log('Replaced ScreenshotPlaceholder');
} else {
  console.log('OLD FUNCTION NOT FOUND — checking excerpt...');
  const idx = c.indexOf('function ScreenshotPlaceholder');
  console.log('Found at index:', idx);
  if (idx >= 0) console.log(c.substring(idx, idx + 200));
  process.exit(1);
}

if (hasCRLF) c = c.replace(/\n/g, '\r\n');
fs.writeFileSync(file, c, 'utf8');
console.log('Done. Size:', c.length);
