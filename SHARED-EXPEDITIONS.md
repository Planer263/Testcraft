# Wildblock: Shared Expeditions & Keyboard Controls

Complete site update based on Wildblock-Room-Chat-Responsive-Edits.zip. This release enables authenticated shared-expedition co-op in finite Overworld worlds, streamed Overworld worlds and Nether-enabled saves. It is NOT independent per-player worlds/dimensions.

## Important multiplayer scope
The engine has one authoritative host simulation window. Guests explore that shared area; the host leads streaming. Origin/dimension transitions are versioned and guests reload the matching shared window, preserving their personal inventory. Players left outside the new active window regroup at the host. Portal travel moves the whole party to the same dimension. Guests may request travel while actually inside a valid portal; the host validates the request. Nether respawn returns the expedition to the Overworld. Players cannot remain independently in different dimensions, or simulate distant regions at the same time. Those capabilities still require a multi-window server refactor.

This is a deliberate safe shared-expedition mode, NOT simply removal of solo-only guards. Every action/pose/state/block patch is scoped to a world epoch, dimension and origin. Stale-coordinate actions are rejected through the existing sequenced inventory acknowledgement path. Host streaming/travel waits for pending actions and world-sync acknowledgements. Clients do not shift independently. The host retains saves, inventory sequence/replay metadata, inactive dimension snapshots and global stream ledgers. Room chat now works in the supported expedition world types.

## Keyboard controls
The focused gameplay/inventory/pause surface cancels delivered browser keyboard defaults, including Ctrl+D bookmarking and Ctrl+A page selection, without stopping the game's existing handlers. Movement modifiers, inventory controls, T/Enter chat, Escape, chat typing and text-field copy/paste/select-all remain usable. Input resets on blur/hidden tabs to prevent stuck movement. Text selection is disabled on the game surface, not editable fields.

Use the Fullscreen / keyboard capture button for optional stronger browser-supported keyboard locking. Browser permission/support varies. A web game CANNOT guarantee capture of all OS/browser-reserved combinations, security shortcuts or keys the browser never delivers. Escape/long-press Escape and browser fullscreen exit remain escape routes. No kiosk/OS-level capture is claimed.

## Install
Export account/world backups. Replace the SAME existing site's contents, keeping index.html/.nojekyll at root and the same URL/origin/path. Refresh ALL peers to this build. Do NOT clear site data. No npm build. Local testing: python -m http.server 8000 and open localhost, not file://. Account IDs/block IDs/content/generator formulas are retained.

## Validation
See docs/EXPEDITION-TESTS.json for actual tests and exclusions. Earlier test reports are historical, not reruns. No public signaling/TURN or hardware performance result is implied by local tests.

## Maintenance
shared-expeditions.js is reference only; its active copy is inline after the dimension/login wrappers and before deferred startup. Scoped changes to existing inline networking/restore/portal hooks are synchronized to companion files. Do not double-load them. Handshake: hearth-company-expedition-1. Outer save/account formats remain unchanged; roomSession is network-only metadata, and roomLocation augments player profiles without renumbering identities.
