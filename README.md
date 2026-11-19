# Wildblock: Builder's Workshop

Complete updated static site, based on the attached Frontiers streamed-world release. No new world generation or Nether content is added. Existing terrain generators and streamed-world bookkeeping remain intact.

## Install
Export account/world backups. Extract onto the SAME existing GitHub Pages site, keeping index.html and .nojekyll at root. Refresh. Do NOT clear browser site data. Preserve the origin and path for local accounts and saves. No build step is needed. For localhost testing: python -m http.server 8000. Do not use file:// for encrypted accounts.

## Content
27 new placeable blocks and one internal crop block, 10 new non-block items, 60 new crafting recipes. Native block IDs 740–767 are fixed; original IDs and mod allocation 156–254 are unchanged.

- Clear glass panes and all 16 stained-glass pane colors, with neighbor-connected geometry/collision.
- Iron bars with the same thin connection logic, separate from glass panes.
- Standing/hanging iron and copper lantern models from supplied Minecraft assets; level-15 light.
- Iron/copper chains, vertical or horizontal according to the clicked face, with saved axis.
- Hay bales, with reversible nine-wheat compression.
- Light-blue/light-gray stained glass and concrete complete the existing color sets.
- All 16 concrete colors gain a wet-mix recipe. Two sand + two gravel + dye + water bucket produce four concrete and RETURN the empty bucket. Output/inventory overflow uses existing safe insertion/drop paths.
- Leather armor and chainmail armor, four pieces each, with slot acceptance, armor reduction and durability.
- Copper nuggets, reversible nine-to-one with ingots.
- Pumpkin seeds from pumpkins; plant on farmland, grow for 160 simulation seconds, then harvest/replant through the existing crop system.
- Search workshop in the item browser; recipe views show returned buckets. In-game guide explains acquisition and adaptations.

## Explicit adaptations and limits
This update is Minecraft-inspired, not exact Java parity. Chainmail is craftable from iron chains. Concrete is wet-mixed at a workbench; no new concrete-powder gravity simulation. Pumpkins grow in a regrowing crop plot rather than vanilla adjacent-block stems: right-click mature plants for one pumpkin; breaking mature plants gives one pumpkin and two seeds, immature plants one seed. Glass retains the inherited cutout renderer, not blended transparent tinting. Copper lanterns/chains do not oxidize or wax. Lantern support-dependent breakage and chain-powered physics are not implemented. Existing leather supply is unchanged; no new animals or loot-generator changes were added.

No new world is needed for recipes/content. Existing Frontiers infinite-style streaming remains solo-only; finite worlds retain co-op with a new build handshake. All participants must use this release. Do not downgrade new-content saves into older builds. Frontiers generator ID/formulas and sparse ledgers are preserved.

See docs/WORKSHOP-TESTS.json for current validation and exclusions. Earlier test reports are historical, not reruns. No real two-device multiplayer, public signaling/TURN, hardware FPS or production deployment test is claimed.

## Development
workshop-content.js is a reference companion; active code is inline before bootMods() in index.html. Do not load it a second time. The seven-script account/login wrapper order is unchanged. New crop atlas tiles occupy previously unused pixels; all prior UVs and atlas dimensions remain unchanged. Preserve supplied license notices. The previous Frontiers README is in docs/FRONTIERS-README.md.
