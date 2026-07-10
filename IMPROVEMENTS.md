# Visitor Experience Improvements

This branch converts the Sprint 1 feature demo into a visitor-first experience.

## Included

- New image-led Home screen as the default entry point
- Quick access to the park map, tickets, restrooms, and accessibility services
- Sample daily highlights clearly labeled as prototype content
- Animal cards that deep-link to the selected habitat on the map
- Visitor-only bottom navigation
- Staff scanning removed from the guest navigation
- Weather failures now show an unavailable state instead of simulated current warnings
- Notification failures now return no alerts instead of a simulated lost-child alert
- Notification permission is requested only when a verified active alert exists

## Remaining production work

- Move staff scanning to an authenticated staff-only application or route
- Add database-backed, user-scoped tickets
- Add signed QR payloads and protected ticket-validation endpoints
- Connect real zoo hours and event schedules
- Replace illustrated route status with true route-line rendering and walking estimates
- Add automated type checking, linting, tests, and end-to-end CI
