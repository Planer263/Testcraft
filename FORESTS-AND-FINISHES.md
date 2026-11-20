# Wildblock: Forests & Finishes — Content Batch 3

Built on supplied Wildblock-Smithing-and-Timber-Content-Batch-2.zip. All Batch 1/2
walls, netherite gear, real smithing interface, trims, accounts, saves, terrain,
portals and Shared Expeditions are retained. No unprovided Aquatic build is included.

## New content
14 blocks/block-items: acacia, dark oak, mangrove, cherry and pale oak full-bark
wood, plus crimson/warped hyphae — each with a stripped variant. IDs 950–963.
4 matching logs/stems in a square ->3 wood/hyphae; 1 ->4 matching planks. Axe-strip
normal variants. Overworld wood burns as fuel and smelts into charcoal. New Nether
hyphae intentionally do NEITHER. Native cube grain orientation is retained; new
pillar-axis metadata is not introduced.

14 working trim templates: Ward, Eye, Vex, Tide, Snout, Rib, Spire, Wayfinder,
Shaper, Silence, Raiser, Host, Flow, Bolt. Together with Sentry/Dune/Coast/Wild,
these cover the 18 armor-trim patterns found in the supplied asset catalog.
They work in the EXISTING smithing screen with all ten existing trim materials.
Textures appear in the smithing armor preview, inventory player model and remote
player armor. Trims remain cosmetic and preserve equipment durability damage.

First copies and duplicates use Batch 2's documented FORGING adaptation. Search
each template in the item browser for its seven-diamond + marker + substrate
recipe. Duplication consumes 1 template +7 diamonds + substrate to produce 2.
No structures or structure-loot acquisition have been added. Substrates/markers
are existing survival resources, not newly introduced Creative-only ingredients.

56 added crafting recipes. Totals: 682 block definitions, 807 inventory entries,
597 crafting recipes. See docs/FORESTS-FINISHES-CONTENT.json for permanent IDs,
exact recipes, sources and atlas rectangles. New material-color images adapt the
supplied trim masks; no claim of exact Java palette/geometry parity is made.
Old atlas pixels/UVs are retained; 280 new trim textures occupy verified unused
space within the same 2048x2048 atlas. All 28 original source asset ZIPs were
available for lookup; only required embedded resources ship with the game.

## Install / GitHub Pages
Export account/world backups. Extract this ZIP and upload CONTENTS at the existing
publishing root with index.html and .nojekyll. Keep the same site URL, storage and
CNAME/domain settings. No new backend or build step. Never clear site data.
All co-op players must refresh: handshake hearth-company-forests-finishes-3.
Do not load saves containing new content into an older build.

Root entrypoint: index.html. Wildblock.html redirects to it. Active new content
is embedded once before c2Register(); forests-finishes.js is reference source,
NOT a second script to load. Smithing/table/replay/epoch/account safeguards remain.
No native independent-sector multiplayer, armor toughness/knockback changes,
new mobs/structures, enchantments or fireproof item entities are added.

Current tests: docs/FORESTS-FINISHES-TESTS.json. Older test reports are historical,
not reruns. No real GitHub deployment, physical remote-device public-NAT/TURN or
hardware FPS benchmark is claimed. Supplied license notices are retained.
