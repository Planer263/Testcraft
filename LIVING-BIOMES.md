# Living Biomes update

Built from the supplied Forests & Finishes Content Batch 3 archive.

New worlds use a warped temperature/moisture climate, regional terrain and river
blending. Biomes: Ocean, River, Beach, Plains, Oak woodland, Birch grove, Taiga,
Desert, Rocky peaks, Savanna, Jungle, Swamp, Snowy plains.

Jungles have taller broad crowns and higher tree density; taiga has taller,
layered conifers; savanna has sparse flat crowns; plains have rare trees;
deserts have undulating dry terrain, sandstone substrate and cacti. Swamps use
mangrove logs/leaves. Snowy plains are separate from non-snowy taiga. Existing
native materials are reused; no new mobs, blocks, vines or bamboo are claimed.

Both finite and streamed new worlds use the new climate. The streamed worker
uses the same generator as the main thread; larger tree crowns have a chunk halo.

## Existing worlds
A biomeGeneration flag is saved at the root and in streamed-world metadata.
Saves without the flag retain legacy terrain/vegetation generation. New terrain
is not retroactively injected into existing worlds. Start a new world to see it.
Do not open new saves in older builds: older builds ignore the new flag.

## Installation
Export saves/backups first. Extract this archive and replace the existing site
contents at the same URL. Open index.html. All co-op players must use this build;
its handshake is hearth-company-living-biomes-1. No new backend or build step.

## Validation
See docs/LIVING-BIOMES-TESTS.json. Node parsed eight inline scripts and the worker.
13 biome categories occurred across 66,049 sampled world coordinates for a test
seed. One chunk per category matched worker/main output and regeneration.
A legacy chunk was byte-identical to the original generator. A 512-block finite
climate sampling also reached all 13 categories. These are generator tests with
stub material registries, not a browser gameplay or rendering test. No browser
playthrough, hardware FPS benchmark, or remote multiplayer test was performed.
