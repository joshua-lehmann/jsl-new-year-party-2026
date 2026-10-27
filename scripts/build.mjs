import { mkdir, rm, cp, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import sharp from "sharp";
import { event } from "../src/event.mjs";
import { escapeHtml, renderPage } from "../src/render.mjs";
const require = createRequire(import.meta.url);
const html = renderPage(event);
await rm("dist", { recursive: true, force: true });
await mkdir("dist/fonts", { recursive: true });
await cp("public", "dist", { recursive: true });
for (const [source, destination] of [
  [
    "@fontsource/bebas-neue/files/bebas-neue-latin-400-normal.woff2",
    "bebas-neue.woff2",
  ],
  ["@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff2", "dm-sans.woff2"],
  [
    "@fontsource/dm-sans/files/dm-sans-latin-700-normal.woff2",
    "dm-sans-bold.woff2",
  ],
  ["@fontsource/bebas-neue/LICENSE", "bebas-neue-LICENSE.txt"],
  ["@fontsource/dm-sans/LICENSE", "dm-sans-LICENSE.txt"],
])
  await cp(require.resolve(source), `dist/fonts/${destination}`);
await writeFile("dist/index.html", html);
const h = escapeHtml;
const date = new Intl.DateTimeFormat("de-CH", {
  timeZone: event.timeZone,
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date(event.eventDate));
const timeFormat = new Intl.DateTimeFormat("de-CH", {
  timeZone: event.timeZone,
  hour: "2-digit",
  minute: "2-digit",
});
const hours = `${timeFormat.format(new Date(event.eventDate))}–${timeFormat.format(new Date(event.eventEnd))}`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#232775"/><g font-family="DejaVu Sans,sans-serif" fill="#f7eed8"><text x="65" y="73" font-size="22" letter-spacing="6">${h(event.brand)} · 2026 → 2027</text><text x="55" y="245" font-size="142" font-weight="bold" letter-spacing="-8">NEW YEAR</text><text x="55" y="410" font-size="172" font-weight="bold" fill="#eda18c" letter-spacing="-8">PARTY</text><text x="65" y="495" font-size="32">${h(date)} · ${h(event.venue.short)}</text><text x="65" y="550" font-size="25">${h(hours)} Uhr · ${h(event.currency)} ${h(event.ticketPrice)} · ${h(event.copy.drink)}</text><path d="m1010 270 16 60 60 16-60 16-16 60-16-60-60-16 60-16z" fill="#f3bb54"/></g></svg>`;
await sharp(Buffer.from(svg)).png().toFile("dist/og.png");
if (event.siteUrl) {
  await writeFile(
    "dist/robots.txt",
    `User-agent: *\nAllow: /\nSitemap: ${new URL("sitemap.xml", event.siteUrl)}\n`,
  );
  await writeFile(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${h(event.siteUrl)}</loc></url></urlset>`,
  );
}
console.log("Built static site in dist/ (zero client-side JavaScript).");
