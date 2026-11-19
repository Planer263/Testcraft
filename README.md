# Wildblock: Fleece & Fields

A focused farm/building update on top of Glow & Ember. Extract the entire ZIP;
index.html remains at the root for local play and GitHub Pages. No build step.
Export a backup before upgrading. Use this same build on every co-op computer.

## Sheep fixes and features
The old sheep used mismatched body transforms and leg origins above its feet.
Sheep now use an explicit upright six-part layout grounded at their collision
origin, with four swinging legs, a visible face, a separate colored fleece layer,
and a smaller lamb model. This avoids the old body bind-pose/leg-offset problem.

Right-click a nearby sheep while holding:
- Shears: adult sheep drop 1-3 wool of their fleece color; wool disappears until
  regrowth. Lambs and already-sheared sheep cannot be repeatedly harvested.
- Dye: changes fleece color and consumes one dye. All 16 colors are supported.
- Wheat: an adult enters breeding readiness for 30 seconds. Two ready adults
  within 2.5 blocks produce one lamb and get a five-minute breeding cooldown.
- Wheat on a lamb: consumes one wheat and advances growth by 30 seconds.

Sheep follow nearby players holding wheat, including connected guests known to
the host. This is simple obstacle collision/jumping, not full pathfinding.
Sheared adult sheep become ready to graze after 40 simulated seconds. If on a
grass block, they briefly graze, turn that block to dirt and regrow fleece.
Lambs mature in five simulated minutes. These timings are custom Wildblock
balancing, not a claim of exact Minecraft timings. Grazing/growth pause when
solo play is paused. Distant simulation remains the existing host-based model.
Adult sheep drops now respect fleece color and sheared state. Lambs do not drop
wool/mutton when killed. Sheep interacted with/bred by players do not disappear
just for moving beyond the previous 110-block despawn distance.

Sheep identity, color, shearing, growth and breeding timers are now saved and
restored. Old saves without sheep records still load normally. Up to 64 sheep
are serialized; total active mob breeding is capped to protect browser resources.

## 44 new block items
- 16 thin colored carpets, with small collision height and supporting-block checks.
- 13 wood-family fences with neighbor connections and tall containment collision.
- 13 openable/rotatable wood-family fence gates.
- The two missing full wool colors: light blue and light gray.

Every new block has a shaded 3D inventory icon, not a flat texture square.
IDs 633-689 are appended (open gate states have separate internal IDs), keeping
all existing IDs unchanged. All 44 block items have survival crafting paths.
Fences/gates include oak, birch, spruce, jungle, acacia, dark oak, mangrove,
cherry, pale oak, crimson, warped, bamboo and the supplied Poplar family.

Fence recipe: two rows of plank-stick-plank -> 3 matching fences.
Gate recipe: two rows of stick-plank-stick -> 1 matching gate.
Carpet recipe: 2 matching wool in a row -> 3 matching carpets.
Right-click gates even with an empty hand. Placement facing is saved/restored.
Fences connect to fences/gates and supported full solid neighbors. Connections
are recalculated as adjacent blocks change. Open gates allow passage.
These are simplified Wildblock rules: no redstone gates, wall-height adaptation,
waterlogging, complete Java connection parity, carpet support-drop updates or
fence jumping/pathfinding parity is claimed.

## Dyes and crafting
Nine dyes complete the existing seven-color palette. Wool recoloring covers
all 16 colors. This update adds 60 recipes in total, including block/dye recipes.
Mixing follows the new recipe viewer. White pigment can be extracted from white
wool; black pigment can be made from charcoal; brown comes from cocoa or brown
wool. These three extraction paths are deliberate custom survival recipes,
not Minecraft's exact dye-source recipes. This keeps colors obtainable without
pretending that skeletons/squid/new flowers are implemented.

## Co-op and retained features
Shearing, dyeing and feeding requests are validated/committed on the host using
the guest's survivor context. Fleece, lamb and grazing state are included in
normal shared mob updates; farm gate states use normal block synchronization.
Short eight-character PeerJS room codes, editor/library, warm block lighting,
water, stairs/slabs, save export/import and Chromebook presets are retained.
The protocol/build ID and PeerJS namespace changed to prevent mixing old clients.
PeerJS is still loaded on demand from CDN; public service/network limitations,
trusted-client security limitations and host-centered simulation remain.

## Publishing
Upload these extracted contents to your GitHub Pages publishing root; index.html
must be at that level. .nojekyll, peer-config.js and subfolders must remain.
Hosted saves remain repository-path scoped; import an exported backup if moving
between a local file and your hosted site. Publishing does not create cloud saves.
Keep the supplied asset-rights notices before sharing/publishing this build.

## Verification and limits
Actual results are in docs/FLEECE-FIELDS-TESTS.json. Earlier reports describe
older builds. This update does not complete the full twelve-release roadmap,
add infinite terrain, authoritative public-server security or exact Java parity.


---
## Previous short-room setup notes

# Glow & Ember — lighting update

## Start / GitHub Pages
Extract this ZIP. The entry point is index.html at the root. Upload the extracted
contents to your Pages publishing folder, retaining peer-config.js and folders.
No build step, Python or JAR is required. The short-code PeerJS system is retained;
its public SDK/cloud still require internet when hosting/joining.
Export a save backup before upgrading. No new world is needed for lighting.

## Lighting changes
All graphics presets now use a voxel-propagated block-light field. Lava, torches,
burning furnaces and supported luminous blocks light adjacent spaces instead
of merely drawing a bright texture. The old Fast mode ignored lava/furnace
illumination around neighboring blocks and only approximated nearby torches.
Torch source 14, furnace 13 and lava 15 are retained as simulation values; a new
rendering curve makes the falloff much more readable, without changing spawning.
Opaque blocks stop light; light can spread around corners. Partial-block opacity
remains approximate (slabs/stairs/doors are not full Java light-shape simulation).
Furnaces illuminate only while fuel is burning, with a self-lit front texture.
Source placement/removal and furnace ignition/extinction invalidate nearby
lighting and meshes. Network furnace transitions also refresh guest lighting.

Supported extra sources include glowstone, sea lantern, jack o'lantern,
shroomlight/froglights where present, crying obsidian and magma blocks.
A shared adjustable warm block-light tint is used, not separate RGB propagation.

## Brighter, more readable rendering
- Higher dark-area visibility and brighter moonlit surfaces.
- Smoother block-light falloff and lifted directional/AO shadow contrast.
- Adjustable warm light color; brighter source-adjacent surfaces.
- Softer distance fog and a brighter night-sky base.
- Existing smooth vertex lighting is enabled in new Chromebook/Balanced defaults;
  Ultra Low retains flat lighting. Saved personal preferences remain respected.

Options now has three sliders:
- Brightness / dark-area visibility (default .85).
- Torch / furnace / lava brightness (default 1.18).
- Warm light color (default .55).
These are rendering preferences, not changes to block light levels, world time
or spawn rules. No light-related save format or block-ID migration is needed.

## Performance
Block lighting is computed in a bounded region around the view with an extra
halo; later block edits refresh a smaller region. It no longer checks distances
to up to 32 torches per vertex. No per-fragment loops over every light source,
shadow maps, bloom or ray tracing are added. The mesh and resolution presets
remain available. Lighting can still cause CPU spikes on movement/large edits;
this is not asynchronous worker lighting and hardware Chromebook FPS is not
guaranteed. Existing global sky/block arrays remain allocated as in the base.

Fast skylight uses direct column exposure. Quality adds side-propagated skylight.
Both modes use the same propagated block lighting. Fast skylight can make closed
interiors darker than Quality before brightness correction; the new ambient/
gamma controls keep them readable. Flowing-water opacity changes can lag until
another lighting refresh; this is not a complete Minecraft lighting engine.

## Retained features and limits
Short room codes, personal survivor state, shared containers, existing world
sizes, water, stairs/slabs, shaded icons, model studio and mod editor remain.
This release focuses on lighting, not completing all planned Minecraft systems.
PeerJS SDK/cloud operation, restricted-network traversal, full Java parity,
authoritative public-server security and all roadmap updates remain out of scope.
See README.md, peer-config.js, prior release notes and included asset notices.

## Verification
Actual checks are listed in docs/GLOW-EMBER-TESTS.json. Historical reports describe
their earlier builds. Public-service PeerJS connectivity and hardware FPS are
not implied by local browser/lighting tests.


--- Previous short-room release instructions ---

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
Host creates new Peer('wildblock-hc4-' + CODE, options).
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
