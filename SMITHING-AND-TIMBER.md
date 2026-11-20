# Wildblock: Smithing & Timber — Content Batch 2

Base: supplied Stonework & Netherite Content Batch 1. All prior wall/gear identities,
accounts, saves, dimensions and generators are retained. This does not contain
unprovided Aquatic/Fields & Fangs builds. Native multiplayer remains Shared Expeditions.

## Play
Craft the EXISTING smithing-table block (ID 420) using two iron ingots above four
planks. Right-click it to open Upgrade Gear: template + equipment + material ->
output, plus inventory/hotbar and a textured armor-stand-style preview. Click slots
normally or shift-click inventory inputs; shift-click output sends it to inventory.
Full inventory/cursor, invalid inputs, missing/out-of-reach/obstructed tables and
wrong dimensions do not consume inputs. Close/Escape returns personal inputs;
a table does not store player gear for other players.

Netherite upgrade: Netherite Upgrade Template + matching diamond gear + netherite
ingot. Template/gear/ingot are consumed only when taking output. Accumulated
durability DAMAGE and existing trim are preserved. The old Batch 1 two-input
workbench recipe is removed. Existing netherite items remain unchanged/usable.

Armor trims: Sentry, Dune, Coast, Wild; apply to supported armor using iron, copper,
gold, diamond, emerald, lapis, redstone, quartz, netherite or amethyst. Pattern/color
are per-stack metadata (not new item IDs). Trims are cosmetic. Exact reapplication
is blocked; replacing a trim consumes a new template/material. Actual supplied
armor textures and recolored trim masks are visible in the smithing preview,
native inventory player preview and remote-player armor; item icons show a trim
badge and tooltips show pattern/material. Native geometry/poses are adaptations.

Templates: first copies use clearly documented Wildblock FORGING recipes, not
new structure loot. Seven diamonds + a marker resource + substrate produce one.
Duplication consumes seven diamonds + an existing template + substrate, produces
two. See item-browser recipes for all five templates. Upgrade substrate is
netherrack, Sentry/Coast cobblestone, Dune sandstone, Wild mossy cobblestone.
Markers respectively: netherite scrap, iron ingot, copper ingot, gold ingot,
emerald (see exact recipe JSON for unambiguous mappings).

Eight full-bark blocks: oak, birch, spruce, jungle wood and stripped variants.
Four matching logs -> three wood; one wood -> four matching planks. Axe-strip
normal wood. All work as furnace fuel and smelt into charcoal. IDs 930–937.

## Scope and limits
668 block definitions, 779 inventory definitions, 541 crafting recipes.
8 new blocks/block-items +5 templates. Existing smithing table made functional.
27 crafting recipes added, nine obsolete workbench upgrades removed; smithing
transformations are live station operations, not fake crafting outputs.
Four trim patterns only, ten materials; not all Minecraft content.
No new structures, enchantments, toughness, knockback resistance, fireproof item
entities, armor-stand world entity or native independent sector multiplayer.
Trim metadata is validated to known pattern/material enums and survives native
stack, inventory, equipment, save/profile, drop/pickup and transport paths.

## Update / GitHub Pages
Export account and world backups first. Extract this ZIP; upload its CONTENTS at
the existing publishing root with index.html and .nojekyll. Keep the same site URL,
storage and existing CNAME/domain. Never clear site data. No new backend/build step.
All co-op participants must refresh; handshake is hearth-company-smithing-timber-2.
Do not load new-content saves in older builds. Existing account/save formats and
terrain formulas/versions are not replaced. Only optional per-stack trim metadata
is added. Root entrypoint is index.html; Wildblock.html redirects to it.

## Sources, tests, maintenance
Current: docs/SMITHING-TIMBER-TESTS.json and SMITHING-TIMBER-CONTENT.json.
Prior reports are historical, not reruns. Active source is EMBEDDED in index.html;
smithing-timber.js is a reference companion, do not load a second copy.
Smithing inputs reuse existing personal craftGrid slots 0–2 (fourth stays empty),
so returnGrid/pendingInventory/player profiles protect them on close/save. After
reload, reopen a table; recovered personal grid items are returned before opening.
Native smith actions use existing host commit/ack, durable receipt and room-scope
checks; output is computed server-side, never accepted from a client.
Atlas adds 94 small armor/trim rectangles in unused space; original 2048x2048
size and old rectangle coordinates are retained. Licenses/notices preserved.
No real GitHub deployment/public physical-device/NAT/TURN/FPS claims.
