# Wildblock: Nether Gates

Based on Green Grass & Smooth Streaming. Complete static-site game, not a data-only mod.

## Install
Export world and account backups. Replace the SAME existing site's contents with this ZIP, with index.html/.nojekyll at root. Preserve URL/origin/path. Refresh; do NOT clear site data. No npm build. Local testing: python -m http.server 8000 and open localhost, not file://.

## Build and light a portal
Craft flint and steel with iron and flint using the existing recipe viewer. Build an upright OBSIDIAN frame: minimum 4 blocks wide x 5 high outside, leaving a 2 x 3 opening. Corners are optional. Both X-facing and Z-facing frame planes work. Larger openings up to21 x21 are accepted. Right-click the inside face of the bottom/side obsidian with flint and steel. A valid empty frame fills with animated portal blocks and costs one durability. Stand in the purple portal for FOUR unpaused simulation seconds to travel.

The arrival portal is paired with the source. Step out after arrival before trying to return; there is also a ten-second travel cooldown. Return travel restores the original Overworld, including streamed-world metadata and edits. Breaking a frame/interior collapses its active portal. Flint and steel also lights supported fire and retains original TNT ignition. Invalid frames do not become portals.

## Nether dimension
A separate deterministic 256 x256 x64 bounded world, with bedrock shell, netherrack caverns, lava below level13, glowstone, Nether quartz/gold ores, rare buried ancient debris, soul-sand regions, basalt/blackstone regions and simple crimson/warped fungus patches with shroomlights. It is a first-pass Minecraft-inspired Nether, not an exact biome generator or infinite Nether. Overworld generators and green-grass/streaming improvements are retained.

New usable resources: quartz, nether bricks, netherite scrap/ingots; basalt, polished basalt, shroomlight. Mine quartz/gold ores for materials. Ancient debris requires a diamond-tier pickaxe, and smelts in a furnace or blast furnace. Four scraps + four gold ingots craft an ingot; storage compression is reversible. Netherite gear/smithing is NOT included. Existing Nether building entries now have natural source terrain where generated.

## Dimension persistence and safety
Separate world snapshots retain block edits, containers, furnaces, crops, directions, water state and per-world metadata. Inventory/equipment/health/hunger/XP/achievements follow the player; items are not restored from an older dimension snapshot. Save/export while in EITHER dimension includes the inactive world and portal links. Death in the Nether returns you to the Overworld respawn path. Overworld beds remain separate. Water buckets evaporate in the Nether and return an empty bucket. Soul sand slows walking. Beds in the Nether cannot sleep or set respawn in this release.

Both dimensions freeze when inactive; this is not simultaneous multi-dimension simulation. Portal travel uses explicit pairs, NOT Minecraft's 8:1 coordinate-based search. Auto-built exits use a cleared obsidian safety pad. Only loaded frames are validated, so a partially unloaded streamed portal is not destroyed. Keep backups; dimension saves cannot be opened safely in older releases.

## Scope limits
Dimension-enabled worlds are SOLO-ONLY. Existing finite co-op without portal/dimension activation retains the original transport with a new content handshake. No public/two-device multiplayer, hardware FPS, zero-hitch or production deployment claim. New Nether mob AI, fortresses/bastions, brewing, piglin trading, respawn anchors, End dimension and netherite smithing/gear are NOT added. No passive Overworld mobs spawn naturally in Nether. Beds are blocked rather than exploding. Fire damages and goes out after30 simulation seconds unless supported by netherrack; destructive fire spreading/burning blocks is not simulated. Full lava flow is not added.

See docs/NETHER-TESTS.json for actual scoped tests and exclusions. Old reports are historical. See docs/NETHER-HANDOFF.md for save/generator contracts. Active native code is inline; nether-content.js/nether-dimensions.js are reference companions, not additional script-src loads. Keep license notices.
