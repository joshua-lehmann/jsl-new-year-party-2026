# Verification

- Node regression suite: missing/null/blank/invalid/non-HTTPS voting URLs, configured voting destination, escaped text, required URLs, event dates, provider links, votes per guest, and sharing metadata.
- Browser: 360, 390, 430, 768 and 1440px layouts; no horizontal document overflow. Mobile and desktop screenshots reviewed. Self-hosted fonts loaded successfully.
- Reduced motion: emulated preference disables the sparkle animation; navigation remains available.
- Accessibility: axe reported no violations. Its manual-review items for the textured background were checked visually; text uses high-contrast blue/cream or blue/coral combinations. The drink illustration has an explicit image role and accessible name.
- Eventfrog opened the correct event with 21:30–03:30 and the listed highlights. Its embedded ticket widget could not be fully verified in the automated session; no purchase was attempted.
- Dropbox opened the correct JSL file request and displayed Add files without authentication. No files were submitted.
- No external script, photo embed, analytics, guest data collection or application runtime request is made by the static page.
- Fallow 3.37.0 reads the generated Istanbul coverage correctly. No dead code, duplicate code, circular dependency or code-complexity finding. Styling advisories concern scoped responsive selectors, accessibility/reduced-motion overrides and a dynamically emitted `text-link` class; these are intentional, live CSS, retained after browser inspection.

Initial release has no pull request or configured SonarQube project. There are consequently no PR review threads or Sonar PR gate to resolve. GitHub Actions is the deployment gate.
