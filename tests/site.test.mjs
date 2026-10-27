import test from "node:test";
import assert from "node:assert/strict";
import { event } from "../src/event.mjs";
import { renderPage, renderVoting, httpsUrl } from "../src/render.mjs";

test("missing and unsafe voting links are pending with no fake action", () => {
  for (const value of [
    undefined,
    null,
    "",
    "   ",
    "not a url",
    "javascript:alert(1)",
    "data:text/html,hello",
    "http://example.com",
    "https://user:pass@example.com",
  ]) {
    const html = renderVoting({ ...event, songVotingUrl: value });
    assert.match(html, /Spinlist – Link folgt bald/);
    assert.doesNotMatch(html, /<a\b|<button\b/);
  }
});
test("a configured HTTPS voting link becomes the real external CTA", () => {
  const html = renderVoting({
    ...event,
    songVotingUrl: " https://example.com/voting?event=2027&lang=de ",
  });
  assert.match(
    html,
    /href="https:\/\/example.com\/voting\?event=2027&amp;lang=de"/,
  );
  assert.match(html, /Songs wählen &amp; abstimmen/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.doesNotMatch(html, /Link folgt bald/);
});
test("event facts and external providers survive static rendering without scripts", () => {
  const html = renderPage(event);
  for (const text of [
    'lang="de-CH"',
    "Donnerstag, 31. Dezember 2026",
    "21:30–03:30 Uhr",
    "CHF 25",
    "2–3 Stimmen auf Spinlist",
    "3–5 Lieblingsfotos",
    "Kramgasse 6",
    "3011 Bern",
    "DJ SNC",
  ])
    assert.ok(html.includes(text), text);
  assert.ok(html.includes(event.ticketUrl));
  assert.ok(html.includes(event.photoUploadUrl));
  assert.doesNotMatch(html, /<script|<form|03:00|ß/);
});
test("required destinations and dates fail fast rather than publish broken links", () => {
  for (const field of ["ticketUrl", "photoUploadUrl"])
    assert.throws(() => renderPage({ ...event, [field]: "" }), /HTTPS/);
  assert.throws(
    () => renderPage({ ...event, eventEnd: event.eventDate }),
    /dates/,
  );
  assert.equal(httpsUrl("//example.com"), null);
});
test("content is escaped and sharing metadata uses the configured live origin", () => {
  const html = renderPage({
    ...event,
    name: "<script>bad</script>",
    siteUrl: "https://example.com/",
  });
  assert.match(html, /&lt;script&gt;bad&lt;\/script&gt;/);
  assert.match(
    html,
    /property="og:image" content="https:\/\/example.com\/og.png"/,
  );
  assert.match(html, /rel="canonical" href="https:\/\/example.com\/"/);
});
