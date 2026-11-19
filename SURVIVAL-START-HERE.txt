# Wildblock — eight-character PeerJS rooms

## Play / GitHub Pages
Extract this ZIP and upload its CONTENTS to your repository publishing root.
The game entry is index.html. Keep peer-config.js and the folders alongside it.
Settings > Pages > Deploy from a branch > your branch > /(root). No build step.
The existing .nojekyll and relative model-library/editor links are retained.
You can also open index.html locally for single-player.

## Host
1. Open a Survival world; choose a unique survivor name in Survivors / Co-op.
2. Leave Custom room code blank for a random code, or enter eight letters/digits.
3. Click Host room. Wait until the room is open; copy the eight-character code.
4. Send that code to up to four guests. Keep the host tab/computer awake.

## Join
1. Use this exact build and choose a different survivor name.
2. Enter the host's eight-character code and click Join room.
3. Wait for the host world, close the panel and click Enter shared Survival world.
No pasted SDP offers, answers, or manual approval step is required.
The eight characters are case-insensitive; the UI normalizes them to uppercase.
Random codes exclude easily confused I/O/0/1. Custom codes permit all A-Z/0-9.

## How it works
Host creates new Peer('wildblock-hc3-' + CODE, options).
Guest creates a separate prefixed unique peer ID, then peer.connects to the
prefixed host ID. Users see only CODE. Survivor names remain separate from
broker IDs. PeerJS exchanges connection metadata automatically.
Random room-code collisions retry up to five registrations. A custom-code
collision gives an error rather than silently choosing or joining another room.
Ending the room destroys the PeerJS peer and releases its registration.
A room address is NOT a password or authentication system. Trusted friends only.

## Online services / dependencies
Single-player does not load PeerJS or contact a signaling service.
Host/Join loads PeerJS 1.5.5 from the pinned cdnjs URL in peer-config.js.
The SDK is NOT bundled in this ZIP. Internet/CDN access is needed for this load.
By default, PeerJS uses public PeerServer Cloud for signaling. GitHub Pages
serves only static files; it does not run the signaling service or game server.
PeerJS/CDN availability and policies are outside this game's control.
Public STUN can be enabled for discovery. This game does not configure a TURN
relay. Restrictive school/hotel/mobile/router networks may prevent a direct
connection despite valid room IDs. A short code does not solve NAT traversal.
There is no promise of free infrastructure forever or guaranteed connectivity.

## Optional configuration
Edit peer-config.js to set a different compatible PeerJS SDK URL, namespace
prefix or your own PeerServer host/port/path/secure options. All players need
matching settings. A custom config.iceServers can supply your STUN/TURN servers;
credentials included in static client files are visible to visitors. Do not
commit secret long-lived credentials. No hosted backend or TURN server is
provisioned by this archive.

## Preserved systems / limits
Personal survivor inventories, host-committed shared-container actions, world
simulation, water, shapes, 3D GUI icons, Chromebook presets and local saves are
retained. Hosted saves remain repository-path namespaced. Export a backup before
upgrading, changing URLs or joining. Hosting does not upload worlds to GitHub.
Alpha limits: client-reported personal state, no secure accounts/anti-cheat,
no host migration, partial host-centered AI/simulation and heavy state broadcasts.
Disconnect ends the room; a new connection requires joining again. Signaling
reconnect does not restore a lost game connection or lost pending transaction.
Manual offer/answer-only builds cannot join this protocol version.
This is not completion of the entire Minecraft-like roadmap.

## Verification
See docs/SHORT-ROOM-TESTS.json for measured tests and their limitations.
Public CDN/cloud connectivity cannot be verified by a local transport test.
Actual internet operation must be tested from the published site on your network.

## Rights
Existing user-supplied Minecraft asset notices remain applicable. This package
does not grant new rights to publish assets. PeerJS is an external dependency;
its source/license is linked from the PeerJS website. It is not vendored here.

PeerJS docs: https://peerjs.com/client/api/peer
Data connection API: https://peerjs.com/client/api/data-connection
Cloud server: https://peerjs.com/server/cloud
