# Phase 39 Notes

This phase is production-ready architecture, not a claim that the Digital Google account is already connected.

## Activation order
1. Finish Enrollment live audit/repair under `enrollment@espoparis.com`.
2. Verify post-repair audit and AIC identity integrity.
3. Switch the Drive connection to `digital@espoparis.com`.
4. Create/choose the Digital metadata spreadsheet.
5. Deploy `digital-platform.gs` as an Apps Script Web App.
6. Configure Script Properties: `DIGITAL_API_SECRET`, `DIGITAL_DATABASE_SPREADSHEET_ID`.
7. Run `provisionDigitalPlatform()` once.
8. Configure Vercel: `DIGITAL_API_URL`, `DIGITAL_API_SECRET`.
9. Verify library folder IDs and learning-root hierarchy.
10. Publish one test book metadata record and one test lesson metadata record before wider use.

## Safety
Metadata publication and binary asset delivery are deliberately separate. Google Drive links for student-only or paid materials are not exposed merely because metadata is published.
