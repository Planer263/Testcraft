# Wildblock: Canopy Biomes

This build extends Living Biomes using Minecraft jungle and dark-oak tree shapes
as references; it is not an exact port of Minecraft world generation.

## New generation (biomeGeneration: 2)
- Jungle: mix of regular 1x1 trees and giant 2x2 jungle trees. Giant trunks are
  18-29 blocks tall, with elevated branches, branch crowns and broad top crowns.
  Low jungle bushes provide an understory. Tree candidates that exceed world
  height or lack a suitable land footprint are skipped.
- Dark forest: separate biome (ID 13) in moist temperate regions, with dense
  2x2 dark oak trees, 6-8-block trunks, broad layered crowns and short branches.
  Uses existing dark oak logs and dark oak leaves. No new block IDs.
- Tree bases check the entire 2x2 footprint and fill small height differences
  under the trunk with dirt, avoiding floating trunk columns.
- Giant crowns/branches use an eight-block spatial halo. Adjacent chunks evaluate
  the same deterministic features, rather than truncating trees at chunk edges.
- New special-tree geometry is shared by finite and streamed worlds and the
  background worker. Other Living Biomes terrain and vegetation remain.

## Compatibility
Original saves (generation 0) and previous Living Biomes saves (generation 1)
retain their existing generation. Start a new world to get generation 2.
The save retains the generation flag at its root and in streamed-world metadata.
Never load these new worlds into older builds. Back up saves before replacing
site contents. Upload the extracted contents at the existing publishing root.
No new backend or build step. All co-op players must update; handshake is
hearth-company-canopy-biomes-2.

## Tests
See docs/CANOPY-BIOMES-TESTS.json and docs/canopy-biomes-generator-tests.js.
Node parsed all eight inline scripts and the embedded worker. A 66,049-position
climate sampling reached all 14 biomes. Fourteen representative chunks matched
worker/main output and deterministic regeneration. Forced flat jungle/dark forest
fixtures verified actual 2x2 trunk columns and equality of tiled feature output
with untiled output. Both previous generation paths matched their retained
implementations for a sample chunk. Tests use a stub material registry.
No browser gameplay, visual rendering, hardware FPS, or remote multiplayer test
was performed. These changes concern naturally generated trees, not 2x2 sapling
planting/growth. Vines, cocoa, bamboo, giant mushrooms, leaf litter, biome-specific
mobs and exact Minecraft biome/feature probabilities are not added by this patch.

## Research references
https://minecraft.wiki/w/Jungle_Tree
https://minecraft.wiki/w/Jungle
https://minecraft.wiki/w/Dark_Oak
https://minecraft.wiki/w/Tree
