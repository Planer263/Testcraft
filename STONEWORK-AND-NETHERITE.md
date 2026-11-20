# Wildblock: Stonework & Netherite — Content Batch 1

Playable static-site update based on the supplied Wildblock-GitHub-Pages-Preview-1.zip.
This is NOT based on Aquatic or Fields & Fangs: neither newer game archive was supplied.
Root game remains Shared Expeditions; isolated Sector Authority remains experimental.

## New content
21 connected wall block types and inventory items: cobblestone, mossy cobblestone,
stone brick, mossy stone brick, brick, granite, diorite, andesite, sandstone,
red sandstone, cobbled deepslate, polished deepslate, deepslate brick, deepslate
tile, blackstone, polished blackstone, polished blackstone brick, nether brick,
tuff, polished tuff and tuff brick.

9 non-block netherite gear items: pickaxe, axe, shovel, sword, hoe, helmet,
chestplate, leggings and boots.

33 recipes: 21 wall recipes, 9 upgrades, and 3 prerequisite recipes for polished
blackstone, polished blackstone bricks and dyeable red sand. Runtime totals:
660 block definitions, 766 inventory definitions, 523 crafting recipes.
Block IDs 900–920 and permanent keys are in docs/CONTENT-BATCH-1.json.
Block-items are counted once in inventory totals, not as extra non-block items.

## Play
Wall recipe: six matching blocks, two rows of three, yields six walls. Use a
workbench. Walls connect to mixed wall materials, full blocks and fence gates.
Straight runs omit the post unless covered. Physical collision is 1.5 blocks high;
ray targeting and held rendering use visual shapes. Pickaxe tier 1+ gives drops.

Netherite recipe: one matching diamond item + one netherite ingot, shapeless, at
a workbench. Accumulated durability DAMAGE is preserved (not the percentage or
remaining number). Example: a diamond pickaxe with 123 damage produces a
netherite pickaxe with 123 damage. Inputs are consumed exactly once. Armor can
be equipped in normal native equipment slots; tools use native mining/combat.

Mine ancient debris in the existing Nether, smelt scraps, then use the existing
scraps + gold ingot recipe for netherite ingots. Blackstone comes from the Nether;
2x2 blackstone produces 4 polished blackstone, and a second 2x2 produces bricks.
Red sand uses a documented Wildblock dyeing adaptation: 8 sand around red dye
produces 8 red sand. Existing 2x2 red-sand crafting produces red sandstone.
Search 'batch 1', 'stonework', 'netherite' or the material name in the item browser.

## Deliberate limits — not exact Minecraft parity
- Netherite uses a workbench adaptation, not a smithing-template/table interface.
- Armor uses existing armor-point/durability rules. Extra armor toughness,
  knockback resistance, enchantment transfer and fireproof item entities are NOT added.
- Walls have native neighbor-derived state, not exact Java tall-side/waterlogging rules.
- No mobs, terrain formulas, dimensions or generators were added/replaced.
- This is a limited first batch, NOT every Minecraft block/item and NOT an Aquatic merge.
- Native independent sector multiplayer remains unfinished; this update does not change that.

## Compatibility and hosting
No old block IDs, item keys, account identities, account vault formats, world-save
formats, storage keys, generator versions/formulas or site paths were changed.
Content handshake is hearth-company-content-batch-1. Refresh every participant;
older builds must be rejected rather than interpreting unknown content.
Do not load new-content saves in an old build. Export account/world backups,
keep your existing site origin/path, and NEVER clear site data to install this.

Extract the archive and upload its CONTENTS to your GitHub Pages publishing root.
Keep index.html and .nojekyll there. Preserve any existing CNAME/custom domain.
No build system or new backend is required. See DEPLOY-TO-GITHUB-PAGES.txt.
For local preview: python -m http.server 8000, then http://localhost:8000/.
Wildblock.html remains the supplied alternate entrypoint; the canonical game is index.html.

## Verification and maintenance
Current report: docs/CONTENT-BATCH-1-TESTS.json. Prior reports are historical.
Content list/asset provenance: docs/CONTENT-BATCH-1.json.
Architecture handoff: docs/CONTENT-BATCH-1-HANDOFF.md.
Static-hosting checks: site-check.html. They are not a remote-network benchmark.
No live GitHub deployment, physical-device/public-NAT test, or hardware FPS claim.
Supplied license notices are retained. No player accounts, private keys, worlds,
passwords or external asset archives are included in the release.
