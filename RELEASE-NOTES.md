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
