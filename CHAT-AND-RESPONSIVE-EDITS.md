# Wildblock: Room Chat & Responsive Edits

Complete patched site based on the supplied Nether Gates / Green Grass & Smooth Streaming game. All blocks/items, world generators, account IDs, save formats, Nether portals and existing streaming behavior are retained.

## Install
Export account and world backups. Replace the SAME existing site's contents with this ZIP, keeping index.html and .nojekyll at root. Refresh every participating browser; all players must use this build. Keep URL/origin/path. Do NOT clear site data. No build step. Local test: python -m http.server 8000 and open localhost (not file://).

## Room chat
In an active finite co-op world, press T or Enter to open chat. Enter sends, Esc closes. A Room Chat button is also in the co-op panel. Chat input suppresses movement, mining and inventory shortcuts without pausing the shared simulation. Messages show verified account names, render as plain text, and relay through the host. No typed name can impersonate another account. Up to256 characters/message, five messages per ten seconds/account. The local session log holds at most100 messages; recent HUD lines fade after12 seconds. History clears on leave/world-room change and is not saved or sent as join history. No slash commands, private messages, voice, server backend or moderation service are added. The host can read room messages; this is not end-to-end encryption against the host.

Chat works in the multiplayer mode already supported by this game: classic finite co-op. Streamed worlds and dimension-enabled worlds remain solo-only. This update does not silently enable unsafe multiplayer dimensions/streamed origins.

## Ghost-block / delayed disappearance fix
Previously edited chunks waited in the same FIFO dirty queue as lighting/terrain refreshes. Cooperative meshing could also publish a job started before a block edit, restoring stale-looking geometry. Finite worlds additionally drained full lighting work synchronously. This patch gives edited geometry and affected boundary neighbors priority before background lighting/meshing, uses existing lighting for the quick geometry pass, and rejects obsolete cooperative mesh jobs by epoch and per-chunk edit version. Background relighting refines the already-correct geometry afterward. The synchronous urgent pass is bounded to at most4 chunks per rendered update and stops after its current chunk once8ms has elapsed; one dense chunk can exceed that budget. No universal FPS/zero-stall promise.

Multiplayer now sends small host-validated block patches immediately after in-memory action commit, before waiting for the durable snapshot/inventory acknowledgement. Inventory sequencing, replay protection and durable acknowledgements remain. A block revision on snapshots prevents an older full state packet from visually resurrecting a removed block. Clients do NOT optimistically grant drops or mutate shared blocks before host approval. Network latency/host stalls can still delay an authoritative response. A host crash before durability can still require recovery from its latest persisted snapshot.

## Validation and maintenance
See docs/CHAT-EDITS-TESTS.json for actual tests and exclusions. Prior reports remain historical, not reruns. Main runtime remains embedded in index.html. chat-responsive-edits.js/smooth-streaming.js/unbound-multiplayer.js are synchronized reference companions; do not add duplicate script-src loads. See docs/CHAT-EDITS-HANDOFF.md for integration contracts. Save and account schemas are unchanged. New handshake build is hearth-company-chat-edits-1.
