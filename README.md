# Wildblock: Hearth & Company — GitHub Pages Preview 2

A static, browser-based Survival sandbox with the supplied building, water,
model library, per-survivor inventories and trusted peer-to-peer co-op systems.
This is an incremental alpha release, not completion of the entire roadmap.

## Quick start
Extract the ZIP and open **index.html**. No Python, Node, JAR, install or build
step is needed. Choose a 128 world first on low-memory hardware.

## Publish the ready-to-upload ZIP on GitHub Pages
1. Extract **Wildblock-GitHub-Pages.zip** on your computer.
2. Put the extracted CONTENTS in your repository's root. `index.html` must sit
   directly in the root, beside `Mod_Creator.html`, `.nojekyll`, and `java-library/`.
   Do not upload the ZIP itself or wrap these files in another folder.
3. Commit/push the files to your publishing branch, usually `main`.
4. Open the repository Settings > Pages.
5. Choose Source: **Deploy from a branch**, branch: **main**, folder: **/(root)**.
6. Save and wait for GitHub's deployment to finish. Open the published HTTPS URL
   shown on the Pages settings screen.

The ready-to-upload ZIP includes only runtime files, notices and deployment
documentation. It includes the offline studio and embedded visual catalog, but
not thousands of redundant raw asset files or the separate editable PNG icons.
The optional Full Source ZIP retains those files as well. Either ZIP has an
actual root-level index.html. No GitHub Actions or build pipeline is required.

## Paths and hosting
Relative links support project URLs such as `https://USERNAME.github.io/REPO/`.
`.nojekyll` makes this a plain static publication. Keep file/folder letter case.
`Wildblock.html` is a small compatibility redirect to index.html, not another
full copy of the game. The game title, app manifest and documentation use index.
Co-op requires a supported browser with WebRTC and a secure context on hosting.
Do not assume a plain HTTP LAN IP provides the same secure APIs as HTTPS/localhost.

## Saves and upgrades
Export Save from the previous version before switching computers or hosting.
Use Import Save on the hosted version. Local files and hosted URLs do not share
browser storage. Hosting does NOT upload worlds to GitHub or provide cloud saves.
Hosted world-save keys are namespaced by repository path to reduce collisions
with other Wildblock projects on the same origin. Local-file keys stay unchanged.
Other preferences/mod storage may remain shared within the same browser origin.
Clearing site data, private browsing or changing origins can remove local saves.
Export backups regularly; browser storage quotas and import limits still apply.

## Co-op
Open Survivors / Co-op. Each person chooses a unique name. The host creates a
world and an invitation; guest accepts it and returns an answer; host accepts
that answer. Both people must run THIS build. Copy/paste exchanges signaling
text, not a shareable public-server join link. Choose one new invitation per guest.
The host browser simulates and stores the world. GitHub Pages serves static
files; it does not run a game server, signaling service or TURN relay.
Keep the host computer/tab awake and visible. Optional STUN helps discovery,
but restrictive networks can still prevent direct connections. Up to four guests.
Only play with trusted people. Names are not secure accounts; the client can
report personal state. This is NOT suitable for a public competitive server.
Share connection text only with intended peers. Read SURVIVAL-START-HERE.txt.

## What was completed in this release
- Root-level index.html and project-path-safe static packaging.
- Correct title, metadata, favicon, manifest and compatibility redirect.
- Full runtime library/mod creator/sample-mod links retained.
- Repository-path-scoped hosted world-save storage.
- Same-build co-op handshake, friendlier unsupported-context errors and
  validation of pasted offer/answer structures and size.
- Shared simulation timers keep advancing while a hosted player is dead,
  subject to normal browser scheduling/background throttling.
- Status text distinguishes Solo / Hosting / Guest rather than always Offline.
- Fresh HTTP/browser, local-file and multiplayer checks: see docs/PAGES-TESTS.json.

## Still alpha / not completed
The earlier twelve-update roadmap is not implemented by renaming the entry point.
Worlds remain bounded/in-memory. No dedicated server, public lobby, secure account
system, host migration, guaranteed internet connectivity, full Java behavior,
Nether/End, complete redstone or all roadmap systems are added here.
AI/spawn/water activation remain host-centered; guest-area simulation is partial.
Host disconnects end the room; automatic reconnect and transaction recovery need
further work. Menus in a hosted world do not pause shared simulation. Background
browser throttling can slow it. Full-state broadcasts can be bandwidth-heavy.
A dead host continues shared timers, but this does not add authoritative guest
combat/AI. Survival remains Survival-only in this supplied branch.

## Asset rights
User-supplied Minecraft visual assets remain subject to their owners' rights;
this packaging is not a license to redistribute them. Keep licenses/ notices
and review applicable EULA/Usage Guidelines before public publication.

## Tests and scope
See docs/PAGES-TESTS.json for actual results and RELEASE-NOTES.md for changes.
A localhost test at `/wildblock-test/` checks project-path behavior; it is NOT
an actual deployment to your GitHub account. Hardware FPS and internet-wide
WebRTC connectivity cannot be guaranteed by headless browser tests.
