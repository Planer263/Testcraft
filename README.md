# Wildblock — GitHub Pages Preview 1

UPLOAD-READY STATIC SITE. Root index.html is the playable Wildblock game. Its inline gameplay/authentication/networking scripts and account/save formats are unchanged from Shared Expeditions in the supplied Prototype2 archive. New root controls open Hosting checks and the explicitly experimental sector preview.

IMPORTANT: This does NOT finish native independent-player sector multiplayer. The native game still uses Shared Expeditions: one shared authoritative window and coordinated party dimension travel. The sector preview is a separate furnace-protocol UI with lab identities/inventories. Do not confuse it with native 3D gameplay.

## Publish
See DEPLOY-TO-GITHUB-PAGES.txt. Extract and upload the CONTENTS of this ZIP into the repository's publishing root. Keep index.html and .nojekyll at that root; do not upload the ZIP itself as the website and do not nest everything under another folder. In Settings > Pages choose Deploy from a branch, main (or your publishing branch), /(root), Save. There is no npm/build/server step.

Keep the SAME existing origin/domain/repository path if this is an update. Back up accounts and worlds first. Do NOT clear browser site data. Preserve an existing custom-domain CNAME file and your repository settings; no guessed CNAME or credentials are included.

## Pages readiness work
- Relative URLs tested both at site root and under /wildblock/, representing a project-site path.
- Hosting checks page probes browser capabilities and same-site assets without reading account/save data or contacting external test services.
- Native game inline scripts compared byte-for-byte with the input release; navigation markup only was changed.
- Sector requests use a same-tab sessionStorage outbox BEFORE transmission. Lost ACKs or retryable storage errors survive same-tab reload and are resolved by retrying the identical packet against durable server receipts.
- Single-flight mutation guard prevents a second queued action from slipping past an uncertain request.
- Sender failures clear pending timers/maps. Local coordinator locking/persistence fencing from v2 is retained.
- Checksums, deployment instructions, native integration acceptance checklist, current test report and release metadata are included.

## Play and diagnose
Open your normal site URL to play. Hosting checks opens site-check.html. The isolated sector preview opens sector-authority/multi-window.html. Its coordinator requires HTTPS/localhost, Web Locks and available local storage. Same-profile automatic connections or manual offer/answer are available; no public signaling or TURN was added to the preview. The normal game retains its existing on-demand PeerJS configuration.

GitHub Pages serves files; it is NOT a persistent world server, signaling service, TURN relay or coordinator host. A browser must remain open as coordinator. Closing/reloading it requires manual reopen/reconnect from its saved lab state; no live migration is implemented. Remote peer/NAT connectivity was not tested or guaranteed.

## Sector preview scope
Independent lab locations/dimensions, shared furnace operations, authority handoff, freezing/restoring vacant sectors, persistent receipts and coordinator recovery are implemented. The lab's session key is NOT a Wildblock account identity. Native terrain validation, 3D window ownership, full carried/equipment/crafting inventory routing, real portal travel, mobs/water/TNT and proximity mesh remain blockers for full native sector play.

The request outbox and private lab key survive a same-tab reload in sessionStorage, not guaranteed tab closure, browser eviction or clearing site data. Server receipt history remains in the coordinator's lab database. New native integration must use the existing authenticated game-account system, not silently copy lab identity handling.

## Verification
Current results: sector-authority/PAGES-PREVIEW-TESTS.json. Prior reports are retained as historical records. Current testing uses localhost (root and simulated project path), independent Chromium contexts and actual local WebRTC. No actual GitHub repository deployment/HTTPS origin, physical remote devices, public signaling/TURN or hardware FPS benchmark is claimed.

## Source
Root entrypoint stays index.html. sector-authority/ scripts are isolated from the native game. No external script load or duplicate native wrapper was added. All supplied license notices are retained. No passwords, private keys, accounts or player world backups are included.
