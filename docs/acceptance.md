# Acceptance checklist

- Event identity: JSL Events, ONO Bern, 31 December 2026 to 1 January 2027, Europe/Zurich, 21:30–03:30, CHF 25, included shot or Cüpli.
- All public prose, event fields and destinations live in src/event.mjs. No private source documents, capacity, contracts or personal contacts are published.
- Missing, null, whitespace, malformed and non-HTTPS voting destinations render an honest pending state without a link. A valid HTTPS destination renders exactly one voting CTA. Vote count is informational; Spinlist enforces it.
- Ticket and photo URLs must validate at build time. No checkout, account, upload, mutation, storage, pagination, retry or concurrency logic exists on this site; external providers own these operations.
- Build is deterministic and safely replaces only generated dist. Content is escaped. Navigation, keyboard focus, reduced motion, mobile 360–430px and desktop are checked.
- Fonts are local with licences. Sharing image, favicon, canonical URL and metadata are included. No tracking or embedded third-party content.
- Verify live page anonymously, external destinations, build/tests and Fallow. Never overwrite an existing repository or hosting project.
