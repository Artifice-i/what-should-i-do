# What Should I Do? — V1
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
Use git log --oneline to view checkpoints. There is no remote repository.

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
2. Choose the Pages Get started / Drag and drop your files option.
3. Choose a project name such as what-should-i-do.
4. Upload cloudflare-upload.zip from this project folder.
5. Select Deploy site / Save and Deploy.
6. Open the assigned HTTPS pages.dev URL and check recommendations, rejection, confetti, and the sound toggle on a phone.
7. Record the actual production URL here after deployment.

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


### Public verification — 2026-09-13
Two browser attempts to https://wht2doo.pages.dev/ returned Cloudflare HTTP 522 (connection timed out). Public interaction and phone-layout testing could not begin. Confirm the Pages production deployment shows Success and check its deployment-specific URL; retry testing once the site serves the app.


### Public verification completed — 2026-09-13
The earlier 522 timeout cleared. Both https://wht2doo.pages.dev/ and https://44c75829.wht2doo.pages.dev/ loaded successfully. Verified three recommendations with explanations, approval and visible confetti, rejection replacement, sound-toggle state, and a sick/low-energy/high-mental-stimulation scenario. Checked a 390px phone-sized browser layout with no horizontal overflow. No browser warning/error logs were reported. Actual phone hardware and audible speaker output were not verified. Share the stable main URL above; the deployment-specific URL identifies this version.

