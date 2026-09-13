# RC2 maintenance map

## Ownership boundaries

| Area | Entry points | Storage / authority |
|---|---|---|
| Public layout and typography | app/globals.css, lib/fonts.ts, components/layout | Source repository |
| Fixed public copy | messages/{en,fr,ar,fa}.json | Source; not a general-purpose page builder |
| CMS editor | features/admin/components/cms-live-workspace.tsx | Server Actions under app/[locale]/admin/content/actions.ts |
| Activities display | features/activities/components/activity-article.tsx, activities-shell.tsx | Published CMS snapshot |
| Home news and daily text | home-news-section.tsx, home-daily-reflection.tsx | Published snapshot, schedule/approval selection |
| Faculty editing | admin/content/profiles, faculty-profile-editor.tsx | CMS Faculty, approved per-locale overrides |
| Faculty fallback | features/marketing/about-content.ts, faculty-images.ts | Original message data and public portraits |
| Reusable file input | features/admin/components/media-field.tsx | Local image preparation; server upload action |
| Upload authorization | features/admin/media-actions.ts, server/media/files.ts | Existing CMS/library policies; bounded MIME/signature validation |
| CMS image delivery | app/api/content-media/[id]/route.ts | CMS bridge checks published references or editor authorization; private no-store |
| Library authoring | digital-authoring-forms.tsx, admin/library/actions.ts | Existing catalog workflow and digital bridge |
| Private book/lesson delivery | server/digital, app/api/digital/assets | Existing entitlement and Drive transport; no auth redesign |
| Google bridges | integrations/google-apps-script/cms.gs and digital-platform.gs | Separate Apps Script projects; signed requests |
| Request signatures | server/integrations/apps-script-client.ts | HMAC over the JSON-normalized transmitted payload |
| Operator guide | admin/help, ADMIN-USER-GUIDE-AR.md | In-app translated quick guide + Arabic detailed guide |

## Additive schema / bridge updates

CMS Content and CMS Reflections retain their existing columns. Wisdom is an
additional ReflectionKind. CMS Faculty is a new two-column sheet, created on
first use through the existing schema helper. Profile records hold id, locale,
name, role, bio, languages, works, image and approved.

CMS image uploads use CMS_MEDIA_FOLDER_ID, created once by provisionCmsMedia().
No Drive sharing permissions are broadened. Uploaded files remain private.
Removing references/archiving does not trash source media. Media can be cleaned
up separately after confirming no published or draft record still needs it.

The digital upload action writes only to the existing verified books/covers
folder constants. Digital schema, entitlement checks and academic data are
unchanged. The existing read-only Drive delivery credential stays read-only;
upload uses the Apps Script owner's authorized Drive service.

## Release boundaries

Only design-refinement-2026. No main merge. Update BOTH bridge deployments and
Vercel application together after reviewing the activation guide. Reusing an
old bridge will leave upload/profile actions unavailable. provisionCmsWorkspace()
now reuses CMS_SPREADSHEET_ID if already configured rather than creating a second
CMS database.

No credentials, verified live storage configuration or staff allowlists are
created by this source package. Keep them in their existing restricted settings.
Do not add a second backend, change OAuth providers or upgrade Next.js as part
of activation. Tested baseline remains Next.js 15.5.25.

## Verification

npm run verify covers domain and bridge-unit tests. Apps Script tests execute
its real source inside a VM with mocked Google services: they are not live Drive
transactions. scripts/check-release-routes.py checks the built public routes.
Authenticated editor/upload actions still need a configured preview account.
