# Sector Authority — DEVELOPMENT PROTOTYPE, NOT A FINISHED MULTIPLAYER UPDATE

This package preserves the supplied Shared Expeditions game unchanged and adds an isolated, tested sector-authority protocol laboratory. The playable game's index.html is NOT patched to allow independent windows or independent multiplayer dimensions. Existing room behavior remains Shared Expeditions. Do not replace a live game expecting those new capabilities.

## What is actually implemented
- 256x256-block dimension-qualified sector keys.
- Explicit single-owner grants, ownership epochs and monotonically increasing revisions.
- Owner-side furnace/inventory action proposals checked and committed by a session coordinator.
- Shared furnace placement, deposits/withdrawals, processing, breaking and dropped-item pickup.
- Ownership transfer when an owner leaves while another subscriber remains.
- Vacant-region freeze and exact state restoration for a later arrival.
- Separate Overworld/Nether records at the same coordinates.
- Persistent operation receipts and per-player sequences to reject stale/replayed operations.
- Atomic inventory + sector state persistence BEFORE a successful acknowledgement.
- Coordinator checkpoint/reload with previous ownership leases fenced off.
- Memory and IndexedDB storage adapters.
- A reproducible browser demonstration using three actual local WebRTC data-channel links, not mocked message transport.

## Run the prototype
Extract the package. Run `python -m http.server 8000` in the extracted directory. Open `http://localhost:8000/sector-authority/`.
Click "Start three local WebRTC peers", then "Run furnace / travel / handoff scenario". All three peers run on the SAME page. The controlled-clock scripted scenario is not three real computers and not a hardware/network benchmark. No public signaling, STUN/TURN or downloaded networking SDK is used by the lab.

The existing game remains available at `http://localhost:8000/`. Its README is preserved in docs/SHARED-EXPEDITIONS-README.md. Account IDs, saves, content, login/encryption wrappers, keyboard controls and generator formulas have not been altered.

## Crucial limits
This is a protocol implementation, not the finished independent-player Wildblock engine. Missing work includes independent authenticated player windows, actual world/terrain validation, chunk/ledger projection, replacing live input/container routing, general entity physics and cross-sector water/TNT/mob transactions, dimension-aware portal transfers, multiplayer pause/death handling and proximity peer-mesh transport. The prototype uses a coordinator star and only FILTERS visible player metadata; it does not implement the proposed direct proximity mesh.

The lab's A/B/C identities and movement are trusted test inputs. `attach(..., {verified:true})` is a contract for an upstream authenticated transport, not cryptographic authentication. This flag must NEVER replace the game's existing account challenge/proof path. No new accounts, alternative player IDs, name-only public login or weaker authentication is installed into the game.

The prototype's placement `baseBlock` is also a trusted test input; production must consult authoritative world generation and saved edits. Movement teleporting in the lab is deliberate and is not anti-cheat validation. The reducer currently covers regular furnaces, not every native block/machine.

Owner proposals are validated by replaying the small reducer at the coordinator. Therefore this prototype demonstrates correctness, not a measured reduction in coordinator CPU cost. Production chunk/entity simulation would need a carefully bounded validation policy.

Region-owner departure is handled, but live coordinator/host migration is NOT implemented. Its checkpoint can be reloaded; there is no always-on backend, automatic split-brain merge, or promise a session survives the coordinator browser closing. Durable receipts are retained rather than pruned: storage grows and quota failure is reported, not silently ignored.

## Safety and deployment
Do not clear site data. Export backups before any game deployment. This package is for development/testing; leave the working game's existing multiplayer guards intact until the missing integration is complete and tested. Original game index.html SHA-256:
de1454722966b29a8005b7df0e6f2d78adec3ba7295bf8493d4b43ec20f51314

See sector-authority/TEST-REPORT.json for actual test scope and sector-authority/INTEGRATION-BOUNDARY.md for required work. This is not presented as a complete solution to the original multi-window multiplayer request.
