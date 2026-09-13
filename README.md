# What Should I Do?
**[Try the live app](https://wht2doo.pages.dev/)**

My first complete, publicly usable app, built collaboratively with OpenAI Codex. I shaped the idea, experience, and constraints; Codex helped implement, debug, and test it.

## Features
- One primary activity and two alternatives, with explanations.
- 44 activities ranked against mood, energy, time, budget, health, company, and stimulation preferences.
- Session feedback, button-centered confetti, and an optional offline fanfare.
- Plain HTML, CSS, and JavaScript with a tiny Node.js local server; no dependencies or API keys.

A dependency-free activity recommender. Inputs and feedback are processed in the browser and are not submitted by the app. When hosted publicly, Cloudflare serves the files and receives normal website requests.

## Launch
Double-click Launch.cmd. Keep its terminal window open while using the app.
Alternatively, open a terminal in this folder, run npm start, and visit http://127.0.0.1:4173.
Node.js 18 or newer is required. No npm install is needed.
Close the terminal (or press Ctrl+C) to stop the server.
If the port is occupied by this app, use the already-open app. Otherwise stop the conflicting process; this app will not stop other programs.

## Use
Adjust only the fields that matter. Fine-tune the vibe contains optional mental and physical preferences.
Find my next thing returns one primary and up to two alternatives.
Not feeling it replaces that card and excludes it until page refresh or Clear session rejections.
Sounds good acknowledges your choice. It does not book, message, launch, or purchase anything.

## Edit the library
Edit dist/activities.js. Each row is documented above the data. Keep IDs unique and stable.
Refresh the browser after editing. No compilation step.
Activity costs assume existing equipment/access and are estimates, not live prices.

## Scoring
dist/engine.js is independent of the interface.
Hard filters: time, budget, chosen location/company, rejected IDs, and energy required no more than two points above current energy.
When unwell, only restful indoor activities with minimal movement qualify; sick mode caps required energy at four.
Ranking: base 50; minus 4 per energy difference; minus 12 per mental/physical level difference when specified; plus 15 for mood, 22 for an interest, and up to 6 for using available time.
Alternative selection applies a 9-point penalty per already-selected category to encourage variety.
Limits never relax silently. Restrictive combinations can produce fewer than three matches.
Recommendations are deterministic and do not learn from approvals.

## Test and recovery
Run npm test for built-in Node tests. No test dependencies.
The Git repository contains the initial implementation checkpoint. Later Git commits were blocked by the sandbox; ZIP recovery copies are in checkpoints/.
Use git log --oneline to view checkpoints. A public GitHub repository now exists (see GitHub status below); the local Git remote has not yet been connected.

## Scope
44 curated activities. No location, weather, calendar, model, account, database, or app analytics integrations. The hosted version downloads its static files from Cloudflare.
Feedback lives in page memory and resets on refresh. Availability, equipment, friends, transport, and opening hours are not checked.
This is an activity picker, not medical guidance.
Optional browser-agent support uses the current visible form when the browser provides WebMCP; it is inert otherwise.

## Possible V2 improvements
- Personal activity editor and equipment/access preferences.
- Optional local favorites/history and learning from feedback.
- Better duration variants and more activities for restrictive combinations.

## Celebration update
Sounds good triggers a button-centered confetti burst and a short locally synthesized fanfare. Sound on/off is above the recommendation cards and resets to on when the page reloads. Reduced-motion preferences suppress confetti. No new dependencies.


## Cloudflare Pages hosting
Status: live; browser verification passed. Public URL: https://wht2doo.pages.dev/
The public version runs without this PC being on. Visitors need no account.
The same dist/ files run locally and on Cloudflare Pages.

### First deployment (Direct Upload)
1. In Cloudflare, open Workers & Pages, then Create application.
2. If shown the newer app creation screen, select Continue to Pages at the bottom, then choose the Pages drag-and-drop upload option.
3. The existing project is named wht2doo; use it for future deployments rather than creating a duplicate.
4. Upload cloudflare-upload.zip from this project folder.
5. Select Deploy site / Save and Deploy.
6. Open the assigned HTTPS pages.dev URL and check recommendations, rejection, confetti, and the sound toggle on a phone.
7. The verified production URL is https://wht2doo.pages.dev/.

Upload only the supplied ZIP or dist folder, not the entire project.
The ZIP has index.html, style.css, app.js, engine.js, and activities.js at its root.
It excludes Git metadata, the local server, tests, README, and checkpoints.

### Publish future changes
Edit dist/, run npm test, then recreate the ZIP in PowerShell from this project:
Compress-Archive -Path dist/* -DestinationPath cloudflare-upload.zip -Force
In the existing Cloudflare Pages project, choose Create a new deployment, Production, and upload the new ZIP.
Changes on this PC do not automatically update the public website.
Direct Upload does not require GitHub; switching to Git-integrated automatic deployments requires a new Pages project.
The standard pages.dev address avoids buying a domain. Stay on the free plan; no paid services are required by this app.
Free-plan terms and limits can change.

Official instructions: https://developers.cloudflare.com/pages/get-started/direct-upload/
Official limits: https://developers.cloudflare.com/pages/platform/limits/


### Public verification completed — 2026-09-13
The earlier 522 timeout cleared. Both https://wht2doo.pages.dev/ and https://44c75829.wht2doo.pages.dev/ loaded successfully. Verified three recommendations with explanations, approval and visible confetti, rejection replacement, sound-toggle state, and a sick/low-energy/high-mental-stimulation scenario. Checked a 390px phone-sized browser layout with no horizontal overflow. No browser warning/error logs were reported. Actual phone hardware and audible speaker output were not verified. Share the stable main URL above; the deployment-specific URL identifies this version.



## GitHub status — 2026-09-13
Public repository: https://github.com/Artifice-i/what-should-i-do
Completed through the GitHub browser interface:
- Created the public repository and committed a basic README with the live demo link.
- Committed package.json, server.js, and Launch.cmd.
- Committed all five dist/ application files and tests/engine.test.js.
- Verified the remote folder structure and application filenames.
The Cloudflare site remains independent and unchanged by these uploads.
Pending: finish the GitHub README, add appropriate .gitignore exclusions, and reconcile local/remote documentation. The local Git repository has not been connected or synchronized with GitHub; browser uploads did not push local Git history.

## Standing project working agreement
Keep this local README current after each completed project milestone, without requiring reminders. Record completed changes and remaining work so interrupted sessions can resume in small bites.
Confine all local file/folder creations, edits, additions, and updates for this project to C:\Users\danie\Desktop\What Should I Do and its subfolders. Ask before any work requiring changes outside that boundary. Continue to honor the original PC guardrails and explicit chat-only pauses.
GitHub and Cloudflare actions remain limited to the project actions authorized in this conversation. Keep local recovery ZIPs, personal notes, and credentials out of public uploads.

## Proposed next expansion: Sunny SOCAL (not implemented)
Vision: add a title screen offering Version 1 or Sunny SOCAL Expansion!, with a bright Southern California visual style and a way to return to the title screen. Preserve Version 1 behavior and the existing celebration, sound toggle, and reduced-motion support.
The expansion would retain the current check-in and add optional Los Angeles area/neighborhood, day-of-week, and weather inputs. Start with Los Angeles, CA for testing and manual weather choices (including Not sure), not a live weather integration.
Combine the original activity library with curated local destinations and recurring activities. Area, day, and weather should influence recommendations while preserving health, energy, budget, and time limits. Keep one primary recommendation and two alternatives with explanations. Allow rough travel time within the available-time budget; do not claim live routing.
Before including named places, hours, or recurring activities, verify them using public official sources and record sources and verification dates. Do not invent current events, weather, opening hours, or availability.
This is visioning only: no expansion code has been started. The next implementation request should explicitly start the work. Develop and test locally first, with a recovery checkpoint before edits. GitHub synchronization and Cloudflare redeployment require a separate decision; the expansion must not automatically change the public app.

## Resume notes
- Working V1 and celebration update are saved locally and available on Cloudflare.
- GitHub contains the source, launcher/server, tests, and only a basic README. Repository documentation and .gitignore work remain unfinished.
- Local and GitHub Git histories are separate; do not assume a configured remote or matching commits. Inspect before any future synchronization.
- Existing tests: seven passing tests, including 324 combinations of hard limits. Run relevant checks again after implementation changes.
- Keep scope to the next requested bite and update this README with its actual outcome. Do not redo completed hosting or repository setup.

## Sunny SOCAL milestone 1 — 2026-09-13
Completed title screen, edition navigation, bright expansion theme, and optional starting area, day (browser-local today), and manual weather controls. Existing check-in and celebration code retained; rejection/approval sets separated by edition. Recovery: checkpoints/before-sunny-socal-2026-09-13.zip contains pre-edit source, tests, documentation, and notes; extract into this project to restore. Baseline: all seven existing tests passed. Next: verified LA library, separate expansion scoring, then scenario and browser checks. Local work only; no upload archive rebuilt or remote actions performed.

## Sunny SOCAL milestone 2 — 2026-09-13
Added eight editorial activities across six official destinations, combined with all 44 originals. Edit dist/socal-activities.js for local activities; dist/socal-sources.js records official links, verified facts and dates independently. No live services. Weekly Santa Monica market eligibility uses Wednesday/Saturday; Griffith excludes its usual Monday closure. No date, holiday, time-of-day or ticket availability is inferred.
Expansion scoring lives in dist/socal-engine.js. Original engine/library are unchanged. Original hard limits remain; all outings include travel. Editorial round-trip allowances: nearby generic outing 20 min, same area 30, other area 90, unknown start 120. Local outings also reserve $10 for transport/parking, included in budget filtering and display; actual travel may cost/take more. Free-budget users retain original free activities. Local bonus +6, same-area +14, matching weekly day +10; mild-weather outdoors +8, hot/rainy indoors +10. Rain/very hot excludes outdoor/mixed options. Not sure makes no weather assumption. Category diversity remains 9 points. Next: contrasting-scenario tests, local browser verification, evaluate UI and fix findings.
