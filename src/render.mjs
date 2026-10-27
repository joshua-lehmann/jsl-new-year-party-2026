export function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
}
export function httpsUrl(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
const icons = {
  record:
    '<circle cx="32" cy="32" r="26"/><circle cx="32" cy="32" r="17"/><circle cx="32" cy="32" r="5"/><path d="M45 7l9 9M10 48l9 9"/>',
  glass:
    '<path d="M14 8h36l-5 21a14 14 0 0 1-26 0L14 8zm5 17h26M32 39v17M22 56h20"/><path d="M8 5l-3-3M57 5l3-3"/>',
  camera:
    '<rect x="6" y="17" width="52" height="37" rx="5"/><path d="M20 17l4-8h16l4 8"/><circle cx="32" cy="35" r="11"/><path d="M48 25h3"/>',
  cups: '<path d="M7 29h20l-4 27H11L7 29zm30 0h20l-4 27H41l-4-27zM22 6h20l-3 18H25L22 6zM9 37h16m14 0h16M24 13h16"/>',
  star: '<path d="M32 2l7 21 23 9-23 8-7 22-8-22L2 32l22-9z"/>',
};
const icon = (name) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
function external(url, label, c, className = "button") {
  return `<a class="${className}" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)} <span aria-hidden="true">↗</span><span class="sr-only"> (${escapeHtml(c.newTab)})</span></a>`;
}
function interpolate(text, e) {
  return text
    .replaceAll("{votes}", e.votesPerGuest)
    .replaceAll("{platform}", e.songVotingPlatform);
}
export function renderVoting(e) {
  const c = e.copy;
  const url = httpsUrl(e.songVotingUrl);
  return url
    ? external(url, c.songCta, c, "button button-dark")
    : `<p class="pending"><span aria-hidden="true"></span>${escapeHtml(interpolate(c.songPending, e))}</p>`;
}
export function renderPage(e) {
  const c = e.copy;
  const h = escapeHtml;
  const ticket = httpsUrl(e.ticketUrl),
    photo = httpsUrl(e.photoUploadUrl),
    maps = httpsUrl(e.venue.mapsUrl);
  if (!ticket || !photo || !maps)
    throw new Error("Ticket, photo and map URLs must be valid HTTPS URLs.");
  const start = new Date(e.eventDate),
    end = new Date(e.eventEnd);
  if (!Number.isFinite(+start) || !(end > start))
    throw new Error("Invalid event dates.");
  const fmt = (options) =>
    new Intl.DateTimeFormat("de-CH", { timeZone: e.timeZone, ...options });
  const date = fmt({ day: "numeric", month: "long" }).format(start);
  const fullDate = fmt({
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(start);
  const hours = `${fmt({ hour: "2-digit", minute: "2-digit" }).format(start)}–${fmt({ hour: "2-digit", minute: "2-digit" }).format(end)} Uhr`;
  const years = `${fmt({ year: "numeric" }).format(start)} → ${fmt({ year: "numeric" }).format(end)}`;
  const price = `${e.currency} ${e.ticketPrice}`;
  const line = (text) => h(text).replaceAll("\n", "<br>");
  const canonical = httpsUrl(e.siteUrl);
  const metadata = canonical
    ? `<link rel="canonical" href="${h(canonical)}"><meta property="og:url" content="${h(canonical)}"><meta property="og:image" content="${h(new URL("og.png", canonical).href)}">`
    : "";
  return `<!doctype html>
<html lang="de-CH"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${h(e.name)}</title><meta name="description" content="${h(e.description)}"><meta name="theme-color" content="#232775"><meta property="og:type" content="website"><meta property="og:locale" content="de_CH"><meta property="og:title" content="${h(e.name)}"><meta property="og:description" content="${h(e.description)}">${metadata}<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${h(e.name)} · ${h(date)} · ${h(hours)}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="./favicon.svg" type="image/svg+xml"><link rel="preload" href="./fonts/bebas-neue.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="./style.css"></head>
<body id="top"><a class="skip" href="#main">${h(c.skip)}</a>
<header class="header wrap"><a class="brand" href="#top" aria-label="${h(e.brand)}">JSL<span>EVENTS</span><span class="brand-star" aria-hidden="true">✳</span></a><nav aria-label="Hauptnavigation"><a href="#nacht">${h(c.nav[0])}</a><a href="#mitmachen">${h(c.nav[1])}</a><a href="#ort">${h(c.nav[2])}</a>${external(ticket, c.navTicket, c, "nav-ticket")}</nav></header>
<main id="main"><section class="hero wrap" aria-labelledby="hero-title"><div class="hero-top"><p class="eyebrow">${h(c.eyebrow)}</p><span class="edition">${h(years)}</span></div>
<div class="poster"><div class="spark spark-one" aria-hidden="true">${icon("star")}</div><h1 id="hero-title"><span>${h(c.hero[0])}</span><span class="party">${h(c.hero[1])}<span class="party-star" aria-hidden="true">✳</span></span></h1><div class="drink-badge" role="img" aria-label="${h(c.drink)}">${icon("glass")}<span>${c.drinkBadge.map(h).join("<br>")}</span></div><span class="spark spark-two" aria-hidden="true">✦</span></div>
<div class="hero-bottom"><div><p class="hero-date">${h(date)} <span>·</span> ${h(e.venue.short)}</p><p class="hero-time">${h(hours)}</p><p class="hero-intro">${h(c.intro)}</p></div><div class="hero-action">${external(ticket, `${c.ticketCta} – ${price}`, c)}<span>${h(c.drink)}</span></div></div>
<dl class="quick-info"><div><dt>${h(c.dateLabel)}</dt><dd><time datetime="${h(e.eventDate)}">${h(fullDate)}</time></dd></div><div><dt>${h(c.timeLabel)}</dt><dd>${h(hours)}</dd></div><div><dt>${h(c.venueLabel)}</dt><dd>${h(e.venue.short)}<small>${h(e.venue.street)}</small></dd></div><div><dt>${h(c.priceLabel)}</dt><dd>${h(price)}<small>${h(c.drink)}</small></dd></div></dl></section>
<section class="night wrap section" id="nacht"><div class="section-heading"><div><p class="eyebrow">${h(c.nightLabel)}</p><h2>${line(c.nightTitle)}</h2></div><p class="section-intro">${h(c.nightIntro)}</p></div><div class="highlights">${c.highlights.map((item, i) => `<article class="highlight"><div class="highlight-top">${icon(item.icon)}<span>0${i + 1}</span></div><p class="eyebrow">${h(item.label)}</p><h3>${h(item.title)}</h3><p>${h(item.body)}</p></article>`).join("")}</div></section>
<section class="join section" id="mitmachen"><div class="wrap"><p class="eyebrow">${h(c.joinLabel)}</p><h2>${line(c.joinTitle)}</h2><div class="join-grid"><article class="join-card song-card"><div class="card-art vinyl" aria-hidden="true"><div class="record"><span>JSL<br>2027</span></div><span class="music-note">♫</span><span class="small-star">✦</span></div><p class="eyebrow">${h(c.songLabel)}</p><h3>${h(c.songTitle)}</h3><p>${h(interpolate(c.songIntro, e))}</p><p class="detail">${h(c.songDetail)}</p><div class="card-action">${renderVoting(e)}</div></article>
<article class="join-card photo-card"><div class="card-art photos" aria-hidden="true"><div class="photo-frame photo-back"><span>✷</span><small>2026</small></div><div class="photo-frame photo-front"><span>♡</span><small>GOOD TIMES.</small></div></div><p class="eyebrow">${h(c.photoLabel)}</p><h3>${h(c.photoTitle)}</h3><p>${h(c.photoIntro)}</p><p class="detail">${h(c.photoDetail)}</p><div class="card-action">${external(photo, c.photoCta, c, "button button-dark")}<span class="provider">${h(c.photoProvider)}</span></div><p class="consent">${h(c.photoConsent)}</p></article></div></div></section>
<section class="tickets-section wrap section" id="tickets"><div class="ticket"><div class="ticket-main"><p class="eyebrow">${h(c.ticketLabel)}</p><h2>${h(c.ticketTitle)}</h2><p>${h(c.ticketBody)}</p><p class="ticket-included">✦ ${h(c.drink)}</p></div><div class="ticket-stub"><span class="ticket-price">${h(price)}</span><span>${h(c.perPerson)}</span>${external(ticket, c.externalTicket, c, "button button-dark")}<p>${h(c.limited)}</p><div class="barcode" aria-hidden="true"></div></div></div></section>
<section class="location wrap section" id="ort"><div><p class="eyebrow">${h(c.locationLabel)}</p><h2>${line(c.locationTitle)}</h2><div class="venue"><span aria-hidden="true">↗</span><div><h3>${h(e.venue.name)}</h3><p>${h(e.venue.street)}<br>${h(e.venue.city)}</p>${external(maps, c.route, c, "text-link")}<small class="provider">${h(c.routeProvider)}</small></div></div></div><div class="practical">${c.practical.map((p) => `<article><h3>${h(p.title)}</h3><p>${h(p.body)}</p></article>`).join("")}</div></section></main>
<footer class="wrap"><div><a class="brand" href="#top">JSL<span>EVENTS</span></a><p>${h(c.footer)}</p></div><p class="footer-note">${h(c.footerNote)}</p>${external(ticket, c.navTicket, c, "text-link")}<a class="back-top" href="#top" aria-label="${h(c.backTop)}">↑</a></footer></body></html>`;
}
