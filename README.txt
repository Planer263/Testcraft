SHADED 3D INVENTORY ICON FIX
============================
Base: Wildblock-Chromebook-Water-and-More-Blocks.zip (latest supplied build).

All 377 Java-added block item icons have been replaced:
- 195 full-cube icons now show angled, shaded cube geometry.
- 182 slab/stair icons show their actual stepped or half-height geometry.
- Each face uses its corresponding model texture and UVs. Logs/debris etc.
  retain distinct end/top and side textures where supplied by their model.
- Transparent 64x64 PNGs use inherited GUI display rotation/scale when available.
- Tools, food, existing native icons and other sprite items are unchanged.
- The same icon data is used by inventory, item browser, hotbar and item stacks.

Performance: all icons are pre-rendered and embedded in the HTML. No extra
runtime 3D icon rendering, shaders, libraries, servers or downloads are added.
The icon change does not modify gameplay JavaScript, world generation, block
IDs, save format, water or Chromebook/performance options. The exact code outside
the two existing icon-data maps was compared and is unchanged.

START
Export a save backup from the old build first. Extract this entire ZIP, then
open Wildblock.html. No new world is required for an icon change. If browser
storage differs at the new folder location, import your exported save backup.
Keep the java-library folder for the optional offline model studio.

TESTS
All 377 replacement PNGs decoded as 64x64 in Chromium (batched image checks).
A visible item-browser page loaded 128/128 icons without broken images.
Creative item pickup and the hotbar were tested for cube, stair and slab entries.
128-world startup passed, with no page errors and WebGL error code 0.
JavaScript syntax passed. This is not a full gameplay regression test.
See docs/3D-GUI-ICON-TESTS.json. Prior reports describe earlier build stages.

The 3D icons are also included individually in ui-icons/ for editing/reuse in
this project. Existing asset rights/notices remain applicable.


--- PREVIOUS BUILD NOTES ---

WILDBLOCK — CHROMEBOOK, WATER AND SHAPES UPDATE
==============================================
START
Extract the ENTIRE ZIP, then open Wildblock.html in Chrome. No Python/JAR/server
is needed. This ZIP is the full game project with its offline asset library.
Existing saves can be imported; export a backup before changing builds.
New worlds default to 256x256 rather than 512x512 to reduce memory use. Choose
128x128 on very low-memory devices. Existing world dimensions are preserved.

CHROMEBOOK PERFORMANCE
First launch of this update applies a low-cost graphics configuration once;
subsequent personal settings are retained. Mouse/FOV/volume preferences remain.
Options / Performance includes Chromebook, Ultra Low, Balanced and Quality.
The title screen also has a Low FPS? Ultra Low button.
Chromebook: 65% render scale, 40-block view distance, 30 FPS cap, fast approximate
lighting, no AO/smooth vertex lighting, clouds, rain particles, stars or shimmer;
32-block entity draw distance; one chunk mesh/frame and soft 3ms mesh budget.
Ultra Low: 45% render scale, 24-block view distance, 30 FPS cap, 16-block entity
draw distance, opaque water and a soft 2ms mesh budget. Menus/background tabs
reduce or suspend rendering. HTML inventory/UI stays at normal resolution.
Quality restores full propagated lighting/AO/smooth vertex light and effects.
Approximate fast lighting intentionally brightens caves and approximates nearby
torch light, considering at most 32 nearby torches; it is not accurate shadowing.

Additional sliders: render scale 40-100%, view distance 24-128, frame cap 20-120,
entity draw distance 16-96, chunk uploads 1-4, mesh budget 1-10ms, water update
budget 32-512 and water simulation radius 16-64. Settings persist locally.
A soft mesh budget cannot interrupt one expensive chunk. Generation and meshing
still run on the main thread. No promise of a particular Chromebook FPS.

ENGINE OPTIMIZATIONS
- Model vertices/UVs are compiled and cached, not reconstructed per voxel.
- Simplified full-cube mode skips duplicate overlay faces but keeps partial shapes.
- Meshing scans only up to the actual occupied height of each column.
- Fast lighting avoids the expensive world-wide lighting flood-fill.
- Fluid edits invalidate only their own/touching neighbour chunk meshes.
- Water processing is queued, budgeted and limited to the simulation radius;
  pending work outside that radius resumes when the player returns.
- Existing distance-based GPU chunk mesh loading/unloading remains enabled.
Voxel terrain is still bounded and fully resident, not infinite/disk-paged.

WATER
Water sources fall downward and spread up to 7 horizontal steps over a supported
floor. Flow has level-dependent height; unsupported streams form waterfalls.
Removing a source drains its dependent flow. Blocks stop and redirect water;
removing blocks next to natural source water starts local flow.
Empty buckets collect source water, not flowing streams. Bucket placement makes
a source. Water/lava contact turns the lava into obsidian (lava itself remains
non-flowing). Water is visible from both sides; transparent chunks are sorted
far-to-near. Opaque water is available as a low-cost rendering alternative.
Swimming, underwater tint and drowning use the actual water surface height.
Currents gently push the player/items; dropped items gain buoyancy in water.
Flow levels and pending simulation work are saved and restored.

Water deliberately does NOT implement full Java parity: no waterlogging, two-
source renewable pools, pressure/volume conservation, bubble columns, complete
lava simulation, sloped per-corner surfaces or exact transparent-face sorting.
Water pauses during pause/inventory screens; distant simulation is deferred.
Natural oceans remain sources and are not globally scanned/simulated on load.

MORE BLOCKS
182 new partial-shape building blocks: 97 straight stairs and 85 bottom slabs.
Appended stable IDs 451-632 preserve previous IDs 256-450. The previous 195 new
full cubes remain, for 377 added building types total. 490 block IDs now have
Java model geometry. See docs/JAVA-SHAPE-BLOCKS.json for the full addition list.
Stairs rotate to player facing on placement; their collision/raycast boxes
rotate with the visible model and survive saves. Half-height stepping helps
walking onto stairs/slabs. New slabs are bottom-only. No upside-down variants,
slab merging, waterlogging or automatic corner-stair connections in this pass.
The new additions are decorative building blocks, not newly simulated machines
or added world-generation content. They have no new survival crafting recipes.
In Creative: E, search block name, Shift-left-click or middle-click to obtain
a stack; click an inventory/hotbar slot to put it there. Regular clicks show
recipes. The original crafting/smelting/mob/container/mod systems remain.

SAVES AND ASSETS
16-bit block storage; existing mod IDs 156-254 stay reserved. Exported saves
include water state and stair orientation. New saves using new shape IDs will
not load correctly in older builds. Original 12MB import limit/localStorage
quota still apply: export regular backups of heavily edited worlds.
The Java asset library and raw visual files remain in java-library. It loads
only when opened separately, not as part of starting the game.
Assets remain the property of their owners. Uploaded files grant no new license.

VERIFICATION
See docs/CHROMEBOOK-WATER-TESTS.json for the checks actually performed. Earlier
reports describe previous builds. Headless browser tests are not Chromebook
hardware benchmarks or an exhaustive gameplay test suite.
