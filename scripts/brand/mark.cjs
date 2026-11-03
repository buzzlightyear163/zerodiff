// ZERO DIFF – logotyp som SVG. "[Ø]": hakparenteser runt en randig, snedstreckad nolla.
// simple=true ger en förenklad variant för små storlekar (favicon).

function mark({ fg = '#d9d9d9', bg = 'none', simple = false } = {}) {
  const sw = simple ? 5.5 : 3;
  const brackets = `
    <path d="M32 19 H23 V81 H32" stroke="${fg}" stroke-width="${sw}" fill="none" stroke-linecap="square"/>
    <path d="M68 19 H77 V81 H68" stroke="${fg}" stroke-width="${sw}" fill="none" stroke-linecap="square"/>`;
  const rx = simple ? 12.5 : 11.8;
  const ry = simple ? 22.5 : 23;
  let zero;
  if (simple) {
    zero = `
    <ellipse cx="50" cy="50" rx="${rx}" ry="${ry}" stroke="${fg}" stroke-width="5.5" fill="none"/>
    <line x1="40" y1="69" x2="60" y2="31" stroke="${fg}" stroke-width="5.5" stroke-linecap="square"/>`;
  } else {
    let stripes = '';
    for (let y = 28.6; y <= 72; y += 3.1) stripes += `<line x1="30" y1="${y.toFixed(2)}" x2="70" y2="${y.toFixed(2)}"/>`;
    // Snedstrecket skärs ut med en mask (transparent), så loggan fungerar på alla bakgrunder.
    zero = `
    <defs>
      <clipPath id="zc"><ellipse cx="50" cy="50" rx="${rx - 1.2}" ry="${ry - 1.2}"/></clipPath>
      <mask id="zm" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
        <rect width="100" height="100" fill="#fff"/>
        <line x1="35" y1="76" x2="65" y2="24" stroke="#000" stroke-width="5.4"/>
      </mask>
    </defs>
    <g mask="url(#zm)">
      <g clip-path="url(#zc)" stroke="${fg}" stroke-width="1.35">${stripes}</g>
      <ellipse cx="50" cy="50" rx="${rx}" ry="${ry}" stroke="${fg}" stroke-width="2.2" fill="none"/>
    </g>
    <line x1="37.2" y1="72.2" x2="62.8" y2="27.8" stroke="${fg}" stroke-width="1.7"/>`;
  }
  const bgRect = bg === 'none' ? '' : `<rect width="100" height="100" fill="${bg}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">${bgRect}${brackets}${zero}</svg>`;
}

module.exports = { mark };
