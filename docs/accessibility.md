# Accessibility review — 2026-10-22

Target: WCAG 2.2 AA. This is an implementation review, not a certification.

## Verification

- Rendered Chrome checks with axe-core 4.10.3: WCAG A/AA and best-practice rules.
- French and English, light and dark themes, desktop and 320 CSS-pixel reflow.
- Keyboard focus, skip links, local navigation and external-link announcements.
- Reduced-motion and Windows forced-colour emulation.
- Text enlargement and visible focus indicators.

External HTTP(S) links open a new tab with noopener/noreferrer. A localized
description announces that behaviour without replacing the link's name.
Internal navigation and phone/email links keep their normal behaviour.

Automated checks do not establish full accessibility. A hands-on review with
NVDA/Firefox or VoiceOver/Safari, including pronunciation and reading order,
remains useful. Real email delivery is separate from browser form tests.

## Homepage-specific coverage

The calendar has a summary and individually named days. It takes one Tab stop;
arrows explore days/weeks, Home/End reach the limits. Project metrics are text,
with the reporting window and download scope visible.

Form tests simulated offline failure, localized server errors and success.
Failed sends retain editable values; successful sends lock and retain values
and focus the confirmation. No real test email was sent. Doubled text was checked.
