// Генератор демонстрационных иллюстраций для сайта ElFoxo (SVG).
// Это не фотографии товаров бренда — только визуальные материалы для демо.
// Запуск: node scripts/generate-images.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { products } from '../public/assets/js/products.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets', 'img');
mkdirSync(join(ROOT, 'products'), { recursive: true });

/* ---------- цвета ---------- */
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (a) => '#' + a.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => { const A = rgb(a), B = rgb(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); };
const dark = (c, t) => mix(c, '#1d1510', t);
const light = (c, t) => mix(c, '#ffffff', t);
const key = (c) => c.slice(1);

/* ---------- детерминированный рандом ---------- */
function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/* зеркальное отражение абсолютного пути по оси X (M/L/C/Q) */
const mirror = (d, cx = 400) => {
  let i = 0;
  return d.replace(/-?\d+(\.\d+)?/g, (n) => (i++ % 2 === 0 ? String(2 * cx - Number(n)) : n));
};

/* ---------- холст ---------- */
class Art {
  constructor(w, h) { this.w = w; this.h = h; this.defs = new Map(); this.body = []; this.n = 0; }
  def(id, s) { if (!this.defs.has(id)) this.defs.set(id, s); return id; }
  uid(p) { return `${p}${++this.n}`; }
  add(...s) { this.body.push(...s); return this; }
  toString() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.w} ${this.h}" width="${this.w}" height="${this.h}">` +
      `<defs>${[...this.defs.values()].join('')}</defs>${this.body.join('')}</svg>`;
  }
}

/* ---------- общие определения ---------- */
function shading(art) {
  art.def('shH', `<linearGradient id="shH" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".26"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/><stop offset=".68" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".24"/></linearGradient>`);
  art.def('shV', `<linearGradient id="shV" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>`);
  art.def('blur', `<filter id="blur" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="16"/></filter>`);
  art.def('grain', `<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="11" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .07 0"/></filter>`);
}

function pattern(art, type, c, alt) {
  const d1 = dark(c, 0.28), l1 = light(c, 0.3);
  const id = `p-${type}-${key(c)}${alt ? '-' + key(alt) : ''}`;
  if (art.defs.has(id)) return id;
  let s = '';
  if (type === 'stock') {
    s = `<pattern id="${id}" width="20" height="17" patternUnits="userSpaceOnUse">` +
      `<path d="M2 0 Q3.5 11 10 16.5 M18 0 Q16.5 11 10 16.5" fill="none" stroke="${d1}" stroke-width="2.4" stroke-opacity=".55" stroke-linecap="round"/>` +
      `<path d="M4.2 1 Q5.4 9 10 13.5 M15.8 1 Q14.6 9 10 13.5" fill="none" stroke="${l1}" stroke-width="1.2" stroke-opacity=".55" stroke-linecap="round"/></pattern>`;
  } else if (type === 'rib') {
    s = `<pattern id="${id}" width="18" height="14" patternUnits="userSpaceOnUse">` +
      `<rect x="9" width="9" height="14" fill="${d1}" opacity=".42"/>` +
      `<path d="M1.5 0 Q2.5 8 4.5 13 M7.5 0 Q6.5 8 4.5 13" fill="none" stroke="${l1}" stroke-width="1.3" stroke-opacity=".6"/>` +
      `<path d="M13.5 2 v10" stroke="${dark(c, 0.45)}" stroke-width="1" stroke-opacity=".35"/></pattern>`;
  } else if (type === 'cable') {
    s = `<pattern id="${id}" width="70" height="84" patternUnits="userSpaceOnUse">` +
      `<rect width="70" height="84" fill="${dark(c, 0.08)}" opacity=".5"/>` +
      `<path d="M18 0 C18 21 52 21 52 42 C52 63 18 63 18 84" fill="none" stroke="${d1}" stroke-width="15" stroke-opacity=".5"/>` +
      `<path d="M52 0 C52 21 18 21 18 42 C18 63 52 63 52 84" fill="none" stroke="${d1}" stroke-width="15" stroke-opacity=".5"/>` +
      `<path d="M18 0 C18 21 52 21 52 42" fill="none" stroke="${l1}" stroke-width="9" stroke-opacity=".8"/>` +
      `<path d="M52 42 C52 63 18 63 18 84" fill="none" stroke="${l1}" stroke-width="9" stroke-opacity=".8"/>` +
      `<path d="M52 0 C52 21 18 21 18 42 M18 42 C18 63 52 63 52 84" fill="none" stroke="${c}" stroke-width="9" stroke-opacity=".25"/>` +
      `<path d="M2 0 V84 M68 0 V84" stroke="${d1}" stroke-width="3" stroke-opacity=".35"/></pattern>`;
  } else if (type === 'twill') {
    s = `<pattern id="${id}" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">` +
      `<path d="M0 4.5 H9" stroke="${d1}" stroke-width="1.4" stroke-opacity=".22"/><path d="M0 1 H9" stroke="${l1}" stroke-width="1" stroke-opacity=".3"/></pattern>`;
  } else if (type === 'dots') {
    s = `<pattern id="${id}" width="52" height="52" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">` +
      `<path d="M0 26 H52" stroke="${d1}" stroke-width="1" stroke-opacity=".12"/>` +
      `<circle cx="13" cy="13" r="7" fill="${alt}"/><circle cx="39" cy="39" r="7" fill="${alt}"/></pattern>`;
  } else if (type === 'stripes') {
    s = `<pattern id="${id}" width="20" height="64" patternUnits="userSpaceOnUse">` +
      `<rect y="0" width="20" height="18" fill="${alt}"/></pattern>`;
  }
  art.def(id, s);
  return id;
}

/* деталь изделия: заливка + фактура + объём + контур */
function piece(art, d, c, { pat = 'stock', alt, rule = 'nonzero', outline = true, extra = '' } = {}) {
  const pid = pat ? pattern(art, pat, c, alt) : null;
  const fr = `fill-rule="${rule}"`;
  return `<g>` +
    `<path d="${d}" ${fr} fill="${c}"/>` +
    (pat === 'stripes' || pat === 'dots' ? `<path d="${d}" ${fr} fill="url(#${pid})"/>` + `<path d="${d}" ${fr} fill="url(#${pattern(art, 'twill', c)})"/>` : '') +
    (pid && pat !== 'stripes' && pat !== 'dots' ? `<path d="${d}" ${fr} fill="url(#${pid})"/>` : '') +
    extra +
    `<path d="${d}" ${fr} fill="url(#shH)"/><path d="${d}" ${fr} fill="url(#shV)"/>` +
    (outline ? `<path d="${d}" ${fr} fill="none" stroke="${dark(c, 0.3)}" stroke-width="2" stroke-opacity=".45"/>` : '') +
    `</g>`;
}

function shadow(cx, cy, rx, ry, o = 0.18) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#2a1d12" opacity="${o}" filter="url(#blur)"/>`;
}

function pompom(art, cx, cy, r, c, seed = 3) {
  const fid = `fl${Math.round(r)}`;
  art.def(fid, `<filter id="${fid}" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".055" numOctaves="3" seed="5"/><feDisplacementMap in="SourceGraphic" scale="${Math.round(r * 0.32)}" xChannelSelector="R" yChannelSelector="G"/></filter>`);
  const gid = `pg-${key(c)}`;
  art.def(gid, `<radialGradient id="${gid}" cx=".38" cy=".34" r=".75"><stop offset="0" stop-color="${light(c, 0.32)}"/><stop offset=".6" stop-color="${c}"/><stop offset="1" stop-color="${dark(c, 0.3)}"/></radialGradient>`);
  const R = rng(seed);
  let strands = '';
  for (let i = 0; i < Math.round(r * 1.6); i++) {
    const a = R() * Math.PI * 2, rr = Math.sqrt(R()) * r * 0.92;
    const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
    const len = 6 + R() * r * 0.16, b = a + (R() - 0.5) * 1.4;
    const col = R() > 0.5 ? light(c, 0.4) : dark(c, 0.25);
    strands += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} l${(Math.cos(b) * len).toFixed(1)} ${(Math.sin(b) * len).toFixed(1)}" stroke="${col}" stroke-width="2" stroke-linecap="round" opacity=".5"/>`;
  }
  return `<g filter="url(#${fid})"><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${gid})"/>${strands}</g>`;
}

function background(art, bg, { arch = true } = {}) {
  const id = `bg-${key(bg)}`;
  art.def(id, `<radialGradient id="${id}" cx=".5" cy=".38" r=".8"><stop offset="0" stop-color="${light(bg, 0.45)}"/><stop offset="1" stop-color="${bg}"/></radialGradient>`);
  const { w, h } = art;
  let s = `<rect width="${w}" height="${h}" fill="url(#${id})"/>`;
  if (arch) {
    const aw = w * 0.62, ax = (w - aw) / 2, top = h * 0.12, bottom = h * 0.8;
    s += `<path d="M${ax} ${bottom} V${top + aw / 2} A${aw / 2} ${aw / 2} 0 0 1 ${ax + aw} ${top + aw / 2} V${bottom} Z" fill="${light(bg, 0.55)}" opacity=".55"/>`;
  }
  s += `<rect y="${h * 0.8}" width="${w}" height="${h * 0.2}" fill="${dark(bg, 0.05)}" opacity=".6"/>`;
  return s;
}

/* ---------- изделия (локальные координаты 800×1000, центр x=400) ---------- */
const P = {
  dome: 'M200 600 C195 390 285 282 400 282 C515 282 605 390 600 600 Z',
  domeLow: 'M212 600 C206 435 292 335 400 335 C508 335 594 435 588 600 Z',
  domeTall: 'M204 600 C196 400 300 245 400 228 C500 245 604 400 596 600 Z',
  cuff: 'M186 570 Q400 540 614 570 Q634 574 634 600 L630 668 Q628 692 604 694 Q400 714 196 694 Q172 692 170 668 L166 600 Q166 574 186 570 Z',
  earL: 'M246 392 C222 306 224 222 240 172 C288 196 334 246 360 304 Z',
  earInL: 'M262 356 C248 300 250 246 258 214 C287 236 312 268 326 304 Z',
};

function beanie(art, o) {
  const { color: c, style = 'pompom', pom } = o;
  let s = shadow(400, 712, 250, 24);
  if (style === 'fox') {
    s += piece(art, P.earL, c) + piece(art, mirror(P.earL), c);
    s += piece(art, P.earInL, light(c, 0.55), { pat: 'twill', outline: false }) + piece(art, mirror(P.earInL), light(c, 0.55), { pat: 'twill', outline: false });
  }
  const dome = style === 'rib' ? P.domeLow : style === 'tall' ? P.domeTall : P.dome;
  s += piece(art, dome, c, { pat: style === 'rib' ? 'rib' : 'stock' });
  if (style === 'tall') s += `<path d="M380 236 C370 196 392 170 414 178 C432 186 426 214 404 226" fill="none" stroke="${dark(c, 0.12)}" stroke-width="16" stroke-linecap="round"/>`;
  s += `<path d="M190 576 Q400 548 610 576" fill="none" stroke="${dark(c, 0.45)}" stroke-width="10" stroke-opacity=".35" filter="url(#blur)"/>`;
  s += piece(art, P.cuff, c, { pat: 'rib' });
  if (style === 'fox') {
    // маленькая нашивка-лисичка на отвороте
    s += `<g transform="translate(400 628)"><path d="M-26 -16 L-10 -4 L10 -4 L26 -16 L24 6 L0 24 L-24 6 Z" fill="${light(c, 0.75)}" stroke="${dark(c, 0.2)}" stroke-width="2"/><circle cx="-8" cy="4" r="2.6" fill="${dark(c, 0.6)}"/><circle cx="8" cy="4" r="2.6" fill="${dark(c, 0.6)}"/><path d="M-4 14 L4 14 L0 19Z" fill="${dark(c, 0.6)}"/></g>`;
  } else {
    s += `<rect x="520" y="604" width="46" height="60" rx="6" fill="${light(c, 0.7)}" stroke="${dark(c, 0.25)}" stroke-width="2" opacity=".9"/><path d="M528 618 h30 M528 628 h22" stroke="${dark(c, 0.35)}" stroke-width="3" stroke-linecap="round" opacity=".5"/>`;
  }
  if (style === 'pompom') s += pompom(art, 400, 262, 92, pom || c, 7);
  return s;
}

function helmet(art, o) {
  const { color: c, ears } = o;
  const outer = 'M215 590 C200 340 290 235 400 235 C510 235 600 340 585 590 C585 650 625 702 662 772 Q400 806 138 772 C175 702 215 650 215 590 Z';
  let s = shadow(400, 790, 290, 26);
  if (ears) {
    s += piece(art, 'M262 360 C238 286 240 214 256 170 C298 196 338 238 362 290 Z', c) + piece(art, mirror('M262 360 C238 286 240 214 256 170 C298 196 338 238 362 290 Z'), c);
    s += piece(art, 'M276 332 C264 284 266 236 274 210 C300 232 322 258 334 290 Z', light(c, 0.55), { pat: 'twill', outline: false }) + piece(art, mirror('M276 332 C264 284 266 236 274 210 C300 232 322 258 334 290 Z'), light(c, 0.55), { pat: 'twill', outline: false });
  }
  s += piece(art, outer, c);
  const ig = `in-${key(c)}`;
  art.def(ig, `<radialGradient id="${ig}" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="${dark(c, 0.25)}"/><stop offset="1" stop-color="${dark(c, 0.55)}"/></radialGradient>`);
  s += `<ellipse cx="400" cy="512" rx="116" ry="136" fill="url(#${ig})"/>`;
  s += `<path d="M300 470 Q400 410 500 470" fill="none" stroke="${dark(c, 0.6)}" stroke-width="18" opacity=".25" filter="url(#blur)"/>`;
  const rimP = pattern(art, 'rib', c);
  s += `<ellipse cx="400" cy="512" rx="130" ry="150" fill="none" stroke="${c}" stroke-width="30"/>` +
    `<ellipse cx="400" cy="512" rx="130" ry="150" fill="none" stroke="url(#${rimP})" stroke-width="30"/>` +
    `<ellipse cx="400" cy="512" rx="130" ry="150" fill="none" stroke="url(#shH)" stroke-width="30"/>` +
    `<ellipse cx="400" cy="512" rx="145" ry="165" fill="none" stroke="${dark(c, 0.3)}" stroke-width="2" opacity=".4"/>`;
  s += piece(art, 'M176 716 Q400 750 624 716 L662 772 Q400 806 138 772 Z', c, { pat: 'rib' });
  return s;
}

function panama(art, o) {
  const { color: c, pat = 'twill', alt } = o;
  const brim = 'M118 612 C118 560 250 548 400 548 C550 548 682 560 682 612 C682 670 560 702 400 702 C240 702 118 670 118 612 Z';
  const crown = 'M262 440 C262 350 318 304 400 304 C482 304 538 350 538 440 L552 574 Q400 594 248 574 Z';
  let s = shadow(400, 712, 300, 30);
  s += piece(art, brim, c, { pat, alt });
  s += `<path d="M150 614 C150 574 270 564 400 564 C530 564 650 574 650 614 C650 660 545 686 400 686 C255 686 150 660 150 614 Z" fill="none" stroke="${dark(c, 0.35)}" stroke-width="2.4" stroke-dasharray="9 8" opacity=".55"/>`;
  s += `<ellipse cx="400" cy="584" rx="170" ry="26" fill="#000" opacity=".22" filter="url(#blur)"/>`;
  s += piece(art, crown, c, { pat, alt });
  s += `<path d="M262 440 Q400 420 538 440" fill="none" stroke="${dark(c, 0.35)}" stroke-width="2.4" stroke-dasharray="9 8" opacity=".55"/>`;
  s += `<path d="M400 306 V586" fill="none" stroke="${dark(c, 0.35)}" stroke-width="2" stroke-dasharray="9 8" opacity=".35"/>`;
  s += `<path d="M252 532 Q400 552 548 532 L552 574 Q400 594 248 574 Z" fill="${dark(c, 0.18)}" opacity=".55"/>`;
  return s;
}

function snood(art, o) {
  const { color: c, pat = 'cable' } = o;
  const body = 'M170 420 A230 70 0 0 1 630 420 L642 640 C642 702 530 732 400 732 C270 732 158 702 158 640 Z';
  let s = shadow(400, 742, 280, 26);
  s += piece(art, body, c, { pat });
  s += piece(art, 'M160 664 C200 710 290 732 400 732 C510 732 600 710 640 664 L642 640 C642 702 530 732 400 732 C270 732 158 702 158 640 Z', c, { pat: 'rib', outline: false });
  const ig = `sn-${key(c)}`;
  art.def(ig, `<linearGradient id="${ig}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${dark(c, 0.6)}"/><stop offset="1" stop-color="${dark(c, 0.3)}"/></linearGradient>`);
  s += `<ellipse cx="400" cy="424" rx="200" ry="52" fill="url(#${ig})"/>`;
  const rimP = pattern(art, 'rib', c);
  s += `<ellipse cx="400" cy="422" rx="216" ry="62" fill="none" stroke="${c}" stroke-width="28"/><ellipse cx="400" cy="422" rx="216" ry="62" fill="none" stroke="url(#${rimP})" stroke-width="28"/><ellipse cx="400" cy="422" rx="216" ry="62" fill="none" stroke="url(#shH)" stroke-width="28"/>`;
  for (const x of [270, 400, 530]) s += `<path d="M${x} 500 C${x - 8} 560 ${x + 6} 640 ${x} 712" stroke="#000" stroke-width="22" opacity=".06" filter="url(#blur)" fill="none"/>`;
  return s;
}

function scarf(art, o) {
  const { color: c, alt } = o;
  const pat = alt ? 'stripes' : 'rib';
  const a2 = alt && dark(alt, 0.12);
  let s = shadow(410, 840, 230, 22);
  // петля вокруг шеи
  s += piece(art, 'M190 360 C190 300 290 262 400 262 C510 262 610 300 610 360 C610 420 510 458 400 458 C290 458 190 420 190 360 Z M246 350 C246 316 316 296 400 296 C484 296 554 316 554 350 C554 384 484 404 400 404 C316 404 246 384 246 350 Z', c, { pat, alt, rule: 'evenodd' });
  s += `<path d="M246 350 C246 316 316 296 400 296 C484 296 554 316 554 350" fill="none" stroke="#000" stroke-width="16" opacity=".14" filter="url(#blur)"/>`;
  // концы
  s += piece(art, 'M318 430 C302 550 296 670 300 810 L402 810 C398 670 404 550 420 450 Z', dark(c, 0.1), { pat, alt: a2 });
  s += piece(art, 'M380 440 C388 560 406 670 436 792 L536 770 C506 660 488 550 484 430 Z', c, { pat, alt });
  s += piece(art, 'M326 412 C356 390 450 390 482 412 L490 476 C452 500 360 500 320 476 Z', c, { pat: 'rib' });
  let fr = '';
  for (let i = 0; i < 9; i++) { const x = 308 + i * 11; fr += `<path d="M${x} 808 q2 22 -2 40" stroke="${dark(c, 0.1)}" stroke-width="6" stroke-linecap="round" fill="none"/>`; }
  for (let i = 0; i < 9; i++) { const x = 442 + i * 11, y = 790 - i * 2.4; fr += `<path d="M${x} ${y} q4 22 2 40" stroke="${c}" stroke-width="6" stroke-linecap="round" fill="none"/>`; }
  return s + fr;
}

function mitten(art, c, pom) {
  const body = 'M-80 -30 C-90 -150 -45 -205 10 -205 C75 -205 100 -150 95 -40 L92 70 L-78 70 Z';
  const thumb = 'M-74 -6 C-124 -18 -150 -76 -130 -112 C-114 -138 -84 -126 -76 -96 Z';
  return piece(art, thumb, c) + piece(art, body, c) + piece(art, 'M-86 58 Q6 46 100 58 L104 150 Q8 164 -90 150 Z', c, { pat: 'rib' }) +
    (pom ? pompom(art, 6, 186, 26, pom, 4) : '');
}

function mittens(art, o) {
  const { color: c } = o;
  let s = shadow(400, 790, 290, 24);
  s += `<path d="M295 640 C300 820 500 820 505 650" fill="none" stroke="${dark(c, 0.15)}" stroke-width="7" stroke-linecap="round"/>`;
  s += `<g transform="translate(290 520) rotate(-9)">${mitten(art, c)}</g>`;
  s += `<g transform="translate(512 540) rotate(9) scale(-1 1)">${mitten(art, c)}</g>`;
  return s;
}

function headband(art, o) {
  const { color: c } = o;
  const band = 'M140 480 C140 380 260 320 400 320 C540 320 660 380 660 480 C660 580 540 640 400 640 C260 640 140 580 140 480 Z M204 472 C204 410 296 376 400 376 C504 376 596 410 596 472 C596 534 504 570 400 570 C296 570 204 534 204 472 Z';
  let s = shadow(400, 690, 270, 24);
  s += piece(art, band, c, { pat: 'rib', rule: 'evenodd' });
  s += `<ellipse cx="400" cy="470" rx="210" ry="110" fill="none" stroke="#000" stroke-width="14" opacity=".12" filter="url(#blur)"/>`;
  s += piece(art, 'M332 538 C352 512 448 512 468 538 C484 584 484 632 468 678 C448 704 352 704 332 678 C316 632 316 584 332 538 Z', c, { pat: 'rib' });
  s += `<path d="M360 522 C348 590 348 630 360 696 M440 522 C452 590 452 630 440 696 M400 516 C396 590 396 630 400 700" fill="none" stroke="${dark(c, 0.4)}" stroke-width="4" stroke-linecap="round" opacity=".45"/>`;
  return s;
}

function bonnet(art, o) {
  const { color: c } = o;
  let s = shadow(400, 860, 230, 22);
  s += `<path d="M236 636 C226 720 250 790 236 852 M564 636 C574 720 550 790 564 852" fill="none" stroke="${dark(c, 0.06)}" stroke-width="22" stroke-linecap="round"/>`;
  s += `<path d="M236 636 C226 720 250 790 236 852 M564 636 C574 720 550 790 564 852" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".2"/>`;
  s += piece(art, 'M214 642 C198 400 290 284 400 284 C510 284 602 400 586 642 Q400 684 214 642 Z', c, { pat: 'stock' });
  s += piece(art, 'M266 630 C258 446 320 352 400 352 C480 352 542 446 534 630 Q400 656 266 630 Z', light(c, 0.5), { pat: 'twill', outline: false });
  s += `<path d="M266 630 C258 446 320 352 400 352 C480 352 542 446 534 630" fill="none" stroke="${light(c, 0.7)}" stroke-width="18" stroke-linecap="round" stroke-dasharray="0 21"/>`;
  s += `<path d="M300 610 C296 480 340 400 400 400 C460 400 504 480 500 610" fill="none" stroke="#000" stroke-width="30" opacity=".08" filter="url(#blur)"/>`;
  return s;
}

function yarn(art, cx, cy, r, c, seed = 1) {
  const R = rng(seed);
  const gid = `yg-${key(c)}`;
  art.def(gid, `<radialGradient id="${gid}" cx=".36" cy=".32" r=".8"><stop offset="0" stop-color="${light(c, 0.3)}"/><stop offset="1" stop-color="${dark(c, 0.3)}"/></radialGradient>`);
  let s = shadow(cx, cy + r * 0.95, r * 1.05, r * 0.12, 0.2) + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${gid})"/>`;
  for (let i = 0; i < 26; i++) {
    const a = R() * Math.PI, k = 0.35 + R() * 0.6;
    const x1 = cx + Math.cos(a) * r * 0.98, y1 = cy + Math.sin(a) * r * 0.98;
    const x2 = cx - Math.cos(a) * r * 0.98, y2 = cy - Math.sin(a) * r * 0.98;
    const mx = cx + Math.cos(a + Math.PI / 2) * r * k, my = cy + Math.sin(a + Math.PI / 2) * r * k;
    s += `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${R() > 0.5 ? light(c, 0.35) : dark(c, 0.3)}" stroke-width="3" opacity=".55"/>`;
  }
  return s + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#shH)"/>`;
}

const SHAPES = { beanie, helmet, panama, snood, scarf, mittens, headband, bonnet };

function item(art, shape, o) {
  if (shape === 'set-snood') {
    return `<g transform="translate(60 -20) scale(.7)">${beanie(art, { ...o, style: 'pompom' })}</g>` +
      `<g transform="translate(470 640) scale(.72) translate(-400 -530)">${snood(art, o)}</g>`;
  }
  if (shape === 'set-mittens') {
    return `<g transform="translate(40 -60) scale(.72)">${beanie(art, { ...o, style: 'fox' })}</g>` +
      `<g transform="translate(330 330) scale(.58)">${mittens(art, o)}</g>`;
  }
  return SHAPES[shape](art, o);
}

/* ---------- товары ---------- */
let count = 0;
for (const p of products) {
  for (const v of p.colors) {
    const art = new Art(800, 1000);
    shading(art);
    art.add(background(art, v.bg));
    art.add(`<g transform="translate(0 40)">${item(art, p.shape, { ...p.art, color: v.hex, alt: v.alt, pom: v.pom })}</g>`);
    art.add(`<rect width="800" height="1000" filter="url(#grain)"/>`);
    writeFileSync(join(ROOT, 'products', `${p.id}-${v.key}.svg`), art.toString());
    count++;
  }
}

/* ---------- композиции ---------- */
function scene(w, h, bg, parts, file, arch = true) {
  const art = new Art(w, h);
  shading(art);
  art.add(background(art, bg, { arch }));
  for (const fn of parts) art.add(fn(art));
  art.add(`<rect width="${w}" height="${h}" filter="url(#grain)"/>`);
  writeFileSync(join(ROOT, file), art.toString());
  count++;
}

const leaf = (x, y, r, s, c) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M0 0 C30 -40 90 -40 120 0 C90 40 30 40 0 0 Z" fill="${c}"/><path d="M0 0 L120 0" stroke="${dark(c, 0.3)}" stroke-width="3"/><path d="M30 0 l20 -16 M60 0 l20 -16 M30 0 l20 16 M60 0 l20 16" stroke="${dark(c, 0.3)}" stroke-width="2" opacity=".6"/></g>`;

// Главный баннер
scene(1200, 1400, '#EADCC8', [
  (a) => `<g transform="translate(250 120) scale(1)">${helmet(a, { color: '#E9DDCB', ears: true })}</g>`,
  (a) => `<g transform="translate(-40 560) scale(.78)">${beanie(a, { color: '#C8693A', style: 'fox' })}</g>`,
  (a) => `<g transform="translate(640 700) scale(.62)">${mittens(a, { color: '#A9B59A' })}</g>`,
  (a) => yarn(a, 1010, 1180, 70, '#D4A94F', 4),
  (a) => yarn(a, 160, 1240, 52, '#B9B0CC', 9),
], 'hero.svg');

// Новая коллекция
scene(1400, 1100, '#D9B08F', [
  (a) => leaf(120, 160, -20, 1.1, '#C8693A') + leaf(1180, 120, 160, 0.9, '#D4A94F') + leaf(1210, 900, 200, 1.2, '#9EA27E') + leaf(60, 880, 30, 0.8, '#B8704B'),
  (a) => `<g transform="translate(-10 230) scale(.85)">${snood(a, { color: '#D4A94F' })}</g>`,
  (a) => `<g transform="translate(330 40) scale(1)">${beanie(a, { color: '#8A6A55', style: 'pompom', pom: '#EADFCB' })}</g>`,
  (a) => `<g transform="translate(720 230) scale(.85)">${helmet(a, { color: '#9EA27E' })}</g>`,
], 'collection.svg', false);

// О бренде
scene(1000, 1250, '#E4E2D6', [
  (a) => `<g transform="translate(130 60) scale(.92)">${bonnet(a, { color: '#EFE6D8' })}</g>`,
  (a) => `<path d="M560 1080 L860 640 M610 1100 L900 700" stroke="#8A6A55" stroke-width="10" stroke-linecap="round"/><circle cx="860" cy="640" r="16" fill="#C8693A"/><circle cx="900" cy="700" r="16" fill="#C8693A"/>`,
  (a) => yarn(a, 230, 1030, 120, '#C99A6B', 2) + yarn(a, 470, 1080, 90, '#A9B59A', 5) + yarn(a, 760, 1060, 100, '#D8B1A7', 8),
], 'about.svg');

console.log(`Готово: ${count} SVG-иллюстраций`);
