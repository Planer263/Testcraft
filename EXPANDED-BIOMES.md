# Wildblock: Expanded Biomes — generation 3

Built from the supplied Wildblock-Canopy-Biomes.zip.

## Play
Extract and upload the contents at the same existing site root. Open index.html.
Back up saves first. In the new-world controls, use "Biome / standalone realm".
Choose Natural Overworld, a single Overworld biome, an underground biome preset,
Standalone End, Standalone Nether, or a single End/Nether biome. There is also a
special Void platform preset. Realm presets use a finite 256x256 world and are
solo-only. Natural Overworld supports the existing finite and streamed sizes.
All multiplayer peers must use handshake hearth-company-expanded-biomes-3.

## Catalogue and generation coverage
67 named Java biome targets are catalogued: 52 Overworld surface, 4 underground,
5 Nether, 5 End, and the special Void. The full machine-readable catalogue is
in docs/EXPANDED-BIOMES-CATALOGUE.json. This is adaptation coverage, NOT exact
Minecraft gameplay parity or a claim that every associated feature is implemented.

New surface variants include flower/sunflower terrain, cherry and pale oak groves,
dappled poplar forest, tall old-growth birch and 2x2 spruce, bamboo jungle,
mangrove mud, terracotta badlands/spires, mycelium/giant mushrooms, frozen shores,
ice spikes/iceberg-like formations and temperature/depth ocean variants.
Existing branching 2x2 jungle and short, broad 2x2 dark oak trees are retained.
Caves gain regional moss/glow-berry, dripstone, sulfur/cinnabar and sculk treatments.
Cave biome presets select the underground treatment, not a replacement surface.
Native textures already included in the supplied atlas are reused. New blocks
980-990 add podzol, mycelium, moss, mushroom stem/caps, sunflower, pointed
dripstone, glow-berry vines and chorus plant/flower. Some plants use crossed-sprite
rather than exact Minecraft block geometry. No texture downloads are required.

The five Nether types have explicit identities, appropriate surface materials,
fungi where supported, and basalt stacks. Existing paired Nether travel remains.
The End realm has a central island, obsidian pillars, surrounding void and outer
island highland/midland/barren/small-island regions, with chorus on highlands.

## Important limits
The End is a separately created standalone world option, NOT an added End portal
or a completed third-dimension travel/progression system. There is no dragon,
End city/gateway/loot progression or End mob implementation in this patch.
Standalone realm saves are isolated worlds; load another saved world to leave.
Normal paired Nether travel is disabled inside standalone realm previews.

Biome-specific Minecraft mobs, structures, loot, aquatic coral/kelp/seagrass
assemblages, complete mangrove root/vine networks, creaking mechanics, Warden,
sulfur-cube mechanics, exact climate distributions and all per-biome feature
probabilities are not implemented. Sulfur has terrain materials, not its complete
Minecraft chemical/hazard behavior. This build does not claim Bedrock legacy-ID
parity or unreleased experimental biomes. Small worlds need not contain every
biome; single-biome presets make each target directly inspectable.

## Save compatibility
Generation 0 (original), 1 (Living Biomes) and 2 (Canopy Biomes) retain their
previous terrain paths. New worlds save biomeGeneration=3 plus wbForcedBiome
and wbRealm. Do not load generation-3 saves into older builds. New terrain does
not get injected into older worlds. Back up before replacing site contents.
Prior dimension snapshots retain their own generation settings.

## Verification
All eight inline scripts and the worker parse in Node. A 148,225-position
natural Overworld sample reached all 52 surface categories. All 57
Overworld/cave/Void presets were exercised at streamed and finite heights, with
worker/main byte equality and repeat-generation equality checked on one chunk
per preset. Previous generation paths matched retained generators on a sample
chunk each. All five Nether and End presets generated and passed basic spawn
checks; natural realm runs exposed all five respective categories. Tests use
real block IDs with mocked engine services and are included under docs/.
No browser playthrough, visual/GPU benchmark, physical-device multiplayer test,
or full account/save roundtrip was performed. Previous reports are historical.

## Research target
The Java biome catalogue from https://minecraft.wiki/w/Biome/ID and
https://minecraft.wiki/w/Biome was used in the preceding research. Sulfur Caves
and Dappled Forest were cross-checked against the official Java 26.2 and 26.3
release pages. Upcoming Ice Caves is not included in the released target.
